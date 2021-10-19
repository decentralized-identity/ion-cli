import { Command, flags } from '@oclif/command';
import * as path from 'path';
import CurrentState from '../CurrentState';
import Output from '../Output';
import Package from '../Package';
const ION = require('@decentralized-identity/ion-tools');
const { cli } = require('cli-ux');

export default class Resolve extends Command {
  public static description = 'Resolves the provided DID and outputs the document to the console, optionally caching the DID state.';

  public static examples = [
    '$ ion resolve did:ion:EiB29JB4R0mbLmJ6_BEYjr8bGZKEPABwFopSNsDJBh_Diw',
    '$ ion resolve did:ion:EiB29JB4R0mbLmJ6_BEYjr8bGZKEPABwFopSNsDJBh_Diw --node https://some.node --escape',
    '$ ion resolve did:ion:EiB29JB4R0mbLmJ6_BEYjr8bGZKEPABwFopSNsDJBh_Diw --node https://some.node --cache',
    '$ ion resolve did:ion:EiB29JB4R0mbLmJ6_BEYjr8bGZKEPABwFopSNsDJBh_Diw --node https://some.node --cache --cacheTtl 60 --name SomeDID',
  ];

  public static flags = {
    help: flags.help({ char: 'h' }),

    // Flag for specifying a directory to which keys and documents should be saved.
    directory: flags.string({ char: 'd', description: 'to which the DID package should be saved. Defaults to environment variable DID_PATH if set.', env: 'DID_PATH' }),

    // Flag for specifying the node to use for resolving DIDs.
    node: flags.string({ description: 'URI of the node you desire to contact for resolution. If you are running your own node, use this to pass in your node\'s resolution endpoint.' }),

    // Flag for specifying the JSON string output should be escaped.
    escape: flags.boolean({ description: 'specifies that the output JSON string should be escaped. Use this when using the output as input to another command.' }),

    // Flag for specifying the name of the DID to use when caching.
    name: flags.string({ description: 'URI of the node you desire to contact for resolution. If you are running your own node, use this to pass in your node\'s resolution endpoint.' }),

    // Flag for specifying the ttl for the document cache. Default is 24hrs.
    cacheTtl: flags.integer({ description: 'specifies the time to live (ttl) for a cached document in in seconds.', default: 86400 }),

    // Flag for specifying that a successful resolution should be cached.
    cache: flags.boolean({ description: 'specifies that the resolved document should be cached in the specified directory and if cached read from the directory.', dependsOn: ['directory', 'name'] }),
  };

  public static args = [
    {
      name: 'DID',
      required: true,
      description: 'The DID to resolve',
    },
  ];

  /**
   * Checks whether the state should be refreshed by comparing the
   * refreshedAt with the current time adjusted by timeToLive.
   * @param refreshedAt date and time the state was last refreshed.
   * @param timeToLive to determine whether the state should be refreshed.
   */
  private static refreshState (refreshedAt: Date, timeToLive: number): boolean {
    const now = Date.now() / 1000;
    const nextRefresh = new Date(refreshedAt).getTime() / 1000 + timeToLive;
    return (nextRefresh <= now);
  }

  public async run () {
    const { args, flags } = this.parse(Resolve);

    const options: any = {};
    if (flags.node) {
      options.nodeEndpoint = flags.node;
    }

    let didDocument;

    // Check if the cache flag has been enabled. If
    // so check if we have a cached instance and
    // if it is with in the cache lifetime.
    cli.action.start('Resolving DID');
    if (flags.cache) {
      cli.action.start('Checking DID cache');
      const cacheDirectory = path.join(flags.directory!, 'cache');

      if (Package.exists(cacheDirectory, flags.name!)) {
        cli.action.stop('DID found in cache.');
        const didPackage = await Package.loadPackage(cacheDirectory, flags.name!);

        // Check if the package has a state entry
        if (didPackage.currentState) {
          cli.action.start('Checking DID cache TTL.');
          // Check if the state should be refreshed.
          const refresh = Resolve.refreshState(didPackage.currentState.refreshedAt, flags.cacheTtl);

          if (refresh) {
            cli.action.stop('cache expired. Refreshing DID.');
            didDocument = await ION.resolve(args.DID, options);
            // Update the state in the package
            didPackage.currentState = new CurrentState(didDocument, new Date());
            await didPackage.savePackage(cacheDirectory);
            cli.action.stop();
          } else {
            cli.action.stop('Returning cached DID.');
            // Return the document from the state
            didDocument = didPackage.currentState.document;
          }
        }
      } else {
        cli.action.stop('DID not in cache.');
        // Never resolved before, so resolve first then
        // create a package and save state
        didDocument = await ION.resolve(args.DID, options);
        const newPackage = new Package(
          flags.name!,
          args.DID,
          [],
          new CurrentState(didDocument, new Date()));
        cli.action.stop();

        cli.action.start('Caching DID.');
        await newPackage.savePackage(cacheDirectory);
        cli.action.stop();
      }
    } else {
      didDocument = await ION.resolve(args.DID, options);
    }

    cli.action.stop();
    this.log(Output.toJsonString(didDocument, flags.escape));
  }
}
