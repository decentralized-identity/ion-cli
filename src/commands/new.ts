import {Command, flags} from '@oclif/command'
import Package from '../Package';
const ION = require('@decentralized-identity/ion-tools');
const { cli } = require('cli-ux');

export default class New extends Command {
  static description = 'Creates a new ION DID, optionally publishes to the network and writes the private key a *.jwk file and the DID to a *.json file.'

  static examples = [
    `$ ion new FriendlyName`,
    `$ ion new FriendlyName -d d:/dids`,
    `$ ion new FriendlyName -d d:/dids -c secp256k1`,
    `$ ion new FriendlyName -d d:/dids -c secp256k1 -p`,
    `$ ion new FriendlyName -d d:/dids -c secp256k1 -p -n https://node.local/1.0/identifiers/ `,
    `$ ion new FriendlyName -d d:/dids -c secp256k1 -p -n https://node.local/1.0/identifiers/ -k key-1`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
  
    // Flag for specifying the curve to use when generating keys
    curve: flags.enum({ char: 'c', description: 'specify the elliptic curve to use for the keys.', options:['secp256k1', 'Ed25519'], default: 'secp256k1'}),

    // Flag for indicating whether the newly created DID should be published to the ION network.
    publish: flags.boolean({ char: 'p', description: 'flag indicating whether the DID should be published to the ION network. Default is false.', default: false }),

    // Flag for specifying a directory to which keys and documents should be saved
    directory: flags.string({char: 'd', description: 'to which to save the *jwk and *.json files.'}),

    // Flag for specifying key pair identifier
    kid: flags.string({char: 'k', description: ' for the key pair', default: 'key-1'}),

    // Flag for specifying the node to use for resolving DIDs.
    node: flags.string({char: 'n', description: `URI of the node you desire to contact for resolution. If you are running your own node, use this to pass in your node's resolution endpoint.`}),
  }
  
  static args = [
    {
      name: 'name',
      required: true,
      description: 'name for the new DID. Name should not include spaces or special characters.'
    }
  ]


  async run() {
    const { args, flags } = this.parse(New)

    // Create the key pair for the new DID
    cli.action.start('Generating key pair');
    const keyPair = await ION.generateKeyPair(flags.curve);

    // Mix in the kid
    const privateKey = Object.assign({ kid: flags.kid }, keyPair.privateJwk);

    cli.action.stop();
    console.log(
      keyPair
    );

    // Now generate the DID using the new key
    cli.action.start('Creating new ION DID');
    const did = new ION.DID({
      content: {
        publicKeys: [
          {
            id: flags.kid,
            type: 'EcdsaSecp256k1VerificationKey2019',
            publicKeyJwk: keyPair.publicJwk,
            purposes: [ 'authentication', 'keyAgreement' ]
          },
        ]
      }
    });

    let options: any = {};
    if (flags.node) {
      cli.action.start(`Using node '${flags.node}' for resolving DIDs`);
      options.nodeEndpoint = flags.node;
      cli.action.stop();
    }

    const didDocument = await ION.resolve(await did.getURI(), options);
    cli.action.stop();
    console.log(didDocument);

    if (flags.publish) {
      const shortForm = await did.getURI('short');
      cli.action.start(`Publishing '${shortForm}' to the ION network`);

      const requestBody = await did.generateRequest();
      const request = new ION.AnchorRequest(requestBody);
      await request.submit();
      cli.action.stop();
    }

    // If a directory has been specified, save the
    // keys and document to the directory to the directory.
    if (flags.directory) {
      cli.action.start(`Creating DID package with name '${args.name}' and saving to directory path '${flags.directory}.`);
      // Create a new package
      const didPackage = new Package(args.name, didDocument, privateKey);
      await didPackage.savePackage(flags.directory);
      cli.action.stop();
    }
  }
}
