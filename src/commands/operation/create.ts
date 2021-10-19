import { Command, flags } from '@oclif/command';
import Output from '../../Output';
const ION = require('@decentralized-identity/ion-tools');
const { cli } = require('cli-ux');
const fs = require('fs/promises');
const path = require('path');

export default class Create extends Command {
  public static description = 'Creates a payload for generating a new ION DID.';

  public static examples = [
    '$ ion operation:create {ESCAPED KEY}',
    '$ ion operation:create {ESCAPED KEY} {ESCAPED SERVICES} --escape',
  ];

  public static flags = {
    help: flags.help({ char: 'h' }),

    // Flag for passing in a public key for including in the input
    //key: flags.string({ description: 'specifies the public key to use for the input.', required: true }),

    // Flag for passing services for including in the input
    //services: flags.string({ description: 'specifies any services to be included in the create.' }),

    // Flag for specifying the JSON string output should be escaped.
    escape: flags.boolean({ description: 'specifies that the output JSON string should be escaped. Use this when using the output as input to another command.' }),
  };

  public static args = [
    {
      name: 'key',
      required: true,
      description: 'specifies the public key to use for the create operation.',
    },
    {
      name: 'services',
      required: false,
      description: 'specifies any services to be included in the create operation.',
    },
  ];

  public async run () {
    const { args, flags } = this.parse(Create);

    // Create the key pair for the new DID
    cli.action.start('Creating input');

    // Check if we have been passed a private
    // key. EC private keys will a "d" property
    // so use rest syntax (...) to remove.
    const { d, ...publicJwk } = JSON.parse(args.key);

    let input = {
      content: {
        publicKeys: [
          {
            id: publicJwk.kid ?? 'key-1',
            type: 'EcdsaSecp256k1VerificationKey2019',
            publicKeyJwk: publicJwk,
            purposes: ['authentication', 'keyAgreement'],
          },
        ],
      },
    };

    // Add any services to the input
    if (args.services) {
      input.content = Object.assign(input.content, JSON.parse(args.services));
    }

    const inputJson = Output.toJsonString(input, flags.escape);
    cli.action.stop();
    this.log(inputJson);
    this.exit();
  }
}
