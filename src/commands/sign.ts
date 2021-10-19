import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import Package from '../Package';

const ION = require('@decentralized-identity/ion-tools');

export default class Sign extends Command {
  public static description = 'Sign payload using the private key associated with the specified DID.';

  public static examples = [
    '$ ion sign \'Hello World\' FriendlyName -d d:/dids',
    '$ ion sign \'Hello World\' FriendlyName -d d:/dids -k \'key-1\'',
    '$ ion sign \'Hello World\' FriendlyName -d d:/dids -k \'key-1\' -s',
    '$ ion sign \'Hello World\' FriendlyName -d d:/dids -k \'key-1\' -s -n https://node.local/1.0/identifiers/',
  ];

  public static flags = {
    help: flags.help({ char: 'h' }),

    // Flag for specifying a directory to which keys and documents should be saved
    directory: flags.string({ char: 'd', description: 'from which to read DID and key. Defaults to environment variable DID_PATH if set.', required: true, env: 'DID_PATH' }),

    // Flag for specifying the node to use for resolving DIDs.
    kid: flags.string({ char: 'k', description: ' of the private key to use for signing.', default: 'key-1', required: false }),

    // Flag for indicating whether the newly created DID should be published to the ION network.
    detached: flags.boolean({ char: 's', description: 'flag indicating a payload-detached JWS should be output. Default is false.', default: false }),
  };

  public static args = [
    {
      name: 'payload',
      required: true,
      description: 'to sign',
    },
    {
      name: 'friendlyName',
      required: true,
      description: 'of the DID to use to sign the payload',
    },
  ];

  public async run () {
    const { args, flags } = this.parse(Sign);

    // Load the did package from the directory
    cli.action.start(`Loading DID package with name '${args.friendlyName}' from directory path '${flags.directory}.'`);
    const didPackage = await Package.loadPackage(flags.directory, args.friendlyName);
    cli.action.stop();

    // Create the ION did instance
    const did = new ION.DID(didPackage.initialState);

    cli.action.start(`Signing payload using '${flags.kid}'.`);
    const jws = await ION.signJws({
      payload: args.payload,
      privateJwk: didPackage.keys,
      header: { kid: `${await did.getURI()}#${flags.kid}` },
      detached: flags.detached,
    });
    cli.action.stop();
    console.log(jws);
  }
}
