import {Command, flags} from '@oclif/command'
const ION = require('@decentralized-identity/ion-tools');
const { cli } = require('cli-ux');

export default class Resolve extends Command {
  static description = 'Resolves the provided DID and outputs the document to the console.'

  static examples = [
    `$ ion resolve did:ion:EiB29JB4R0mbLmJ6_BEYjr8bGZKEPABwFopSNsDJBh_Diw`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
  
    // Flag for specifying the node to use for resolving DIDs.
    node: flags.string({char: 'n', description: `URI of the node you desire to contact for resolution. If you are running your own node, use this to pass in your node's resolution endpoint.`}),
  }

  static args = [
    {
      name: 'DID',
      required: true,
      description: 'The DID to resolve'
    }
  ]

  async run() {
    const { args, flags } = this.parse(Resolve)

    let options: any = {};
    if (flags.node) {
      options.nodeEndpoint = flags.node;
    }

    const didDocument = await ION.resolve(args.DID, options);
    cli.action.stop();
    console.log(didDocument);
  }
}
