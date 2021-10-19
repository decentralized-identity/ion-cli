import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import { value as jsonPathValue } from 'jsonpath';
const ION = require('@decentralized-identity/ion-tools');

export default class Verify extends Command {
  public static description = 'Verify payload using the private key associated with the specified DID.';

  public static examples = [
    '$ ion verify \'2tleS0xIiwiYWxnIjoiRVMyNTZLIn0..D7kXXnQmtSw1WX1RCW3IzA6T5-qivSOL2_6RVydIo1Z_wXKO00GEUl2xjwvRpHlr4B7jBy1_PZenCNP9_mWx1Q\' \'{ESCAPED DID DOCUMENT}\' \'hello world\' -k \'#key-1\'',
  ];

  public static flags = {
    help: flags.help({ char: 'h' }),

    // Flag indicating the public key identifier to use.
    kid: flags.string({ description: ' identifier of the public key to use for verifying.', required: false }),
  };

  public static args = [
    {
      name: 'jws',
      required: true,
      description: 'signature to verify.',
    },
    {
      name: 'document',
      required: true,
      description: 'the escaped DID document of the entity that signed the payload.',
    },
    {
      name: 'payload',
      required: false,
      description: 'when verifying a payload-detached JWS',
    },
  ];

  public async run () {
    const { args, flags } = this.parse(Verify);

    // Load the DID document into an ION DID
    const document = JSON.parse(args.document);

    // If a kid has been provided attempt to get the matching key
    // from the DID document, throwing if not found. If no kid
    // specified get the first key from the document.
    // QUESTION: Should we parse the jws and see if a kid is specified in the header.
    let publicKeyJwk;
    const keyIdentifier = flags.kid ?? jsonPathValue(document, '$..authentication[0]');
    publicKeyJwk = jsonPathValue(document, `$..verificationMethod[?(@.id=="${keyIdentifier}")].publicKeyJwk`);
    if (!publicKeyJwk) {
      throw new Error(`The specified DID document does not have a public key with id '${keyIdentifier}' that can be used for verifying the signature.`);
    }

    // Create the ION did instance
    cli.action.start('Verifying payload.');
    const verifiedPayload = await ION.verifyJws({
      jws: args.jws,
      publicJwk: publicKeyJwk,
      payload: args.payload,
    });
    this.log(verifiedPayload);
    cli.action.stop();
    this.exit();
  }
}
