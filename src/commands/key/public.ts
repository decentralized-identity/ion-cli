import { Command, flags } from '@oclif/command';
import Output from '../../Output';
const { cli } = require('cli-ux');

export default class Public extends Command {
  public static description = 'Returns the public key JWK.';

  public static examples = [
    '$ ion key:public {ESCAPED JSON STRING}',
    '$ ion key:public {ESCAPED JSON STRING} --escape',
  ];

  public static flags = {
    help: flags.help({ char: 'h' }),

    // Flag for specifying the JSON string output should be escaped.
    escape: flags.boolean(
      { description: 'specifies that the output JSON string should be escaped. Use this when using the output as input to another command.' }),
  };

  public static args = [
    {
      name: 'jwk',
      required: true,
      description: 'an escaped JSON string containing the private key jwk.',
      strict: false,
    },
  ];

  public async run() {
    const { args, flags } = this.parse(Public);

    // Create the key pair for the new DID
    cli.action.start('Returning public key JWK');
    const privateJwk = JSON.parse(args.jwk);
    const { d, ...publicJwk } = privateJwk;
    const publicKeyJson = Output.toJson({ ...publicJwk }, flags.escape);
    cli.action.stop();
    this.log(publicKeyJson);
    this.exit();
  }
}
