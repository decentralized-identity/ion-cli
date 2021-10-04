import {Command, flags} from '@oclif/command'
const ION = require('@decentralized-identity/ion-tools');
const { cli } = require('cli-ux');
const fs = require('fs/promises');
const path = require('path');

export default class New extends Command {
  static description = 'Creates a new ION DID, optionally publishes to the network and writes the key pair to a *.jwk file and the DID to a *.json file.'

  static examples = [
    `$ ion new`,
    `$ ion new -d d:/dids`,
    `$ ion new -d d:/dids -c secp256k1`,
    `$ ion new -d d:/dids -c secp256k1 -p`,
    `$ ion new -d d:/dids -c secp256k1 -p -n https://node.local/1.0/identifiers/ `,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
  
    // Flag for specifying the curve to use when generating keys
    curve: flags.enum({ char: 'c', description: 'specify the elliptic curve to use for the keys.', options:['secp256k1', 'Ed25519'], default: 'secp256k1'}),

    // Flag for indicating whether the newly created DID should be published to the ION network.
    publish: flags.boolean({ char: 'p', description: 'flag indicating whether the DID should be published to the ION network. Default is false.', default: false }),

    // Flag for specifying a directory to which keys and documents should be saved
    directory: flags.string({char: 'd', description: 'to which to save the *jwk and *.json files.'}),

    // Flag for specifying the node to use for resolving DIDs.
    node: flags.string({char: 'n', description: `URI of the node you desire to contact for resolution. If you are running your own node, use this to pass in your node's resolution endpoint.`}),
  }

  async run() {
    const { flags } = this.parse(New)

    // Create the key pair for the new DID
    cli.action.start('Generating key pair');
    let keyPair = await ION.generateKeyPair(flags.curve);
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
            id: 'key-1',
            type: 'EcdsaSecp256k1VerificationKey2019',
            publicKeyJwk: keyPair.publicJwk,
            purposes: [ 'authentication' ]
          }
        ]
      }
    });

    let options: any = {};
    if (flags.node) {
      cli.action.start(`Using node '${flags.node}' for resolving DIDs`);
      options.nodeEndpoint = flags.node;
      cli.action.stop();
    }

    const didDocument = await ION.resolve(await did.getURI());
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
      // Use the did suffix as the folder name.
      const suffix = await did.getSuffix();

      // This will also create the specified directory if
      // it does not exist.
      const basePath = path.join(flags.directory, `/${suffix}`);
      cli.action.start(`Creating file path ${basePath}`);
      await fs.mkdir(basePath, { recursive: true });
      cli.action.stop();

      // Write the key file.
      fs.mkdir(`${basePath}/keys`)
      const jwkFile = path.join(basePath, `/keys/key-1.jwk`);
      cli.action.start(`Saving key to ${jwkFile}`);
      await fs.writeFile(jwkFile, JSON.stringify(keyPair, null, 2));
      cli.action.stop();

      // Write the DID document.
      const didDocumentFile = path.join(basePath, 'document.json');
      cli.action.start(`Saving DID document to ${didDocumentFile}`);
      await fs.writeFile(didDocumentFile, JSON.stringify(didDocument, null, 2));
      cli.action.stop();
    }
  }
}
