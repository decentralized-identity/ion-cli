import { Command, flags } from '@oclif/command';
import Output from '../Output';
import Package from '../Package';
const ION = require('@decentralized-identity/ion-tools');
const { cli } = require('cli-ux');

export default class New extends Command {
  public static description = 'Creates a new ION DID with either defaults or the specified input.';

  public static examples = [
    '$ ion new FriendlyName',
    '$ ion new FriendlyName -d d:/dids',
    '$ ion new FriendlyName -d d:/dids --curve secp256k1 --kid key-1',
    '$ ion new FriendlyName -d d:/dids --input {ESCAPED JSON STRING}',
  ];

  public static flags = {
    help: flags.help({ char: 'h' }),

    // Flag for specifying a directory to which keys and documents should be saved.
    directory: flags.string({ char: 'd', description: 'to which the DID package should be saved. Defaults to environment variable DID_PATH if set.', env: 'DID_PATH' }),

    // Flag for specifying the curve to use when generating keys.
    curve: flags.enum({ char: 'c', description: 'specify the elliptic curve to use for the keys.', options: ['secp256k1', 'Ed25519'], default: 'secp256k1' }),

    // Flag for specifying key pair identifier.
    kid: flags.string({ description: ' for the key pair.', default: 'key-1' }),

    // Flag for specifying the input to use when creating a new DID.
    input: flags.string({ description: 'specifies the input to use when generating the ION DID.', exclusive: ['curve', 'kid'] }),

    // Flag for specifying the JSON string output should be escaped.
    escape: flags.boolean({ description: 'specifies that the output JSON string should be escaped. Use this when using the output as input to another command.' }),
  };

  public static args = [
    {
      name: 'name',
      required: true,
      description: 'name for the new DID. Name should not include spaces or special characters.',
    },
  ];

  public async run () {
    const { args, flags } = this.parse(New);

    let did;
    let privateKey;
    let keyPair;

    if (flags.input) {
      cli.action.start('Creating new ION DID using the specified input');
      did = new ION.DID(JSON.parse(flags.input));
      cli.action.stop();
    } else {
      // Create the key pair for the new DID
      cli.action.start('Generating key pair');
      keyPair = await ION.generateKeyPair(flags.curve);

      // Mix in the kid
      privateKey = Object.assign({ kid: flags.kid }, keyPair.privateJwk);

      cli.action.stop();
      console.log(
        Output.toJsonString(keyPair),
      );

      // Now generate the DID using the new key
      cli.action.start('Creating new ION DID');
      did = new ION.DID({
        content: {
          publicKeys: [
            {
              id: flags.kid,
              type: 'EcdsaSecp256k1VerificationKey2019',
              publicKeyJwk: keyPair.publicJwk,
              purposes: ['authentication', 'keyAgreement'],
            },
          ],
        },
      });
    }

    cli.action.stop();
    const didState = await did.getState();
    this.log(Output.toJsonString(didState, flags.escape));

    // If a directory has been specified, save the
    // keys and document to the directory to the directory.
    if (flags.directory) {
      cli.action.start(`Creating DID package with name '${args.name}' and saving to directory path '${flags.directory}.`);
      // Create a new package
      const didPackage = new Package(args.name, didState, privateKey);
      await didPackage.savePackage(flags.directory);
      cli.action.stop();
    }
  }
}
