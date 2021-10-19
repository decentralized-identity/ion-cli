import { Command, flags } from '@oclif/command';
import Output from '../../Output';
const ION = require('@decentralized-identity/ion-tools');
const { cli } = require('cli-ux');

export default class New extends Command {
  public static description = 'Creates a new elliptic curve key for the specified curve, returning a JSON serialized and optionally escaped representation.';

  public static examples = [
    '$ ion keys:new key-1',
    '$ ion keys:new key-1 --curve secp256k1',
    '$ ion keys:new key-1 --curve secp256k1 --escape',
  ];

  public static flags = {
    help: flags.help({ char: 'h' }),

    // Flag for specifying the curve to use when generating keys
    curve: flags.enum({ description: 'specifies the elliptic curve to use for the keys.', options: ['secp256k1', 'Ed25519'], default: 'secp256k1' }),

    // Flag for specifying the JSON string output should be escaped.
    escape: flags.boolean(
      { description: 'specifies that the output JSON string should be escaped. Use this when using the output as input to another command.' }),
  };

  public static args = [
    {
      name: 'kid',
      required: false,
      description: 'identifier for the key (kid).',
      default: 'key-1',
    },
  ];

  public async run() {
    const { args, flags } = this.parse(New);

    // Create the key pair for the new DID
    cli.action.start('Generating key pair');
    const keyPair = await ION.generateKeyPair(flags.curve);

    // Mix in the kid
    const privateKey = Object.assign({ kid: args.kid }, keyPair.privateJwk);
    const privateKeyJson = Output.toJsonString(privateKey, flags.escape);
    cli.action.stop();
    this.log(privateKeyJson);
    this.exit();
  }
}
