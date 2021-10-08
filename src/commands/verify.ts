import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import Package from '../Package';

const ION = require('@decentralized-identity/ion-tools');

export default class Verify extends Command {
    static description = 'Sign payload using the private key associated with the specified DID.'

    static examples = [
        `$ ion verify '2tleS0xIiwiYWxnIjoiRVMyNTZLIn0.ImhlbGxvIHdvcmxkIg.D7kXXnQmtSw1WX1RCW3IzA6T5-qivSOL2_6RVydIo1Z_wXKO00GEUl2xjwvRpHlr4B7jBy1_PZenCNP9_mWx1Q' FriendlyName -d d:/dids`,
        `$ ion verify '2tleS0xIiwiYWxnIjoiRVMyNTZLIn0.ImhlbGxvIHdvcmxkIg.D7kXXnQmtSw1WX1RCW3IzA6T5-qivSOL2_6RVydIo1Z_wXKO00GEUl2xjwvRpHlr4B7jBy1_PZenCNP9_mWx1Q' FriendlyName -d d:/dids`,
        `$ ion verify '2tleS0xIiwiYWxnIjoiRVMyNTZLIn0..D7kXXnQmtSw1WX1RCW3IzA6T5-qivSOL2_6RVydIo1Z_wXKO00GEUl2xjwvRpHlr4B7jBy1_PZenCNP9_mWx1Q' FriendlyName 'hello world' -d d:/dids`,
    ]

    static flags = {
        help: flags.help({ char: 'h' }),

        // Flag for specifying a directory to which keys and documents should be saved
        directory: flags.string({ char: 'd', description: 'from which to read DID and key.', required: true }),

        // Flag for indicating whether the newly created DID should be published to the ION network.
        detached: flags.boolean({ char: 's', description: 'flag indicating a payload-detached JWS should be output. Default is false.', default: false }),
    }

    static args = [
        {
            name: 'jws',
            required: true,
            description: 'signature to verify.'
        },
        {
            name: 'friendlyName',
            required: true,
            description: 'of the DID to use to verify the signature'
        },
        {
            name: 'payload',
            required: false,
            description: 'when verifying a payload-detached JWS'
        }
    ]

    async run() {
        const { args, flags } = this.parse(Verify)

        // Load the did package from the directory
        cli.action.start(`Loading DID package with name '${args.friendlyName}' from directory path '${flags.directory}.'`);
        const didPackage = await Package.loadPackage(flags.directory, args.friendlyName);
        cli.action.stop()

        // Create the ION did instance
        cli.action.start(`Verifying payload.`);
        const verifiedPayload = await ION.verifyJws({
            jws: args.jws,
            publicJwk: didPackage.keys,
            payload: args.payload
        });
        cli.action.stop()
        console.log(verifiedPayload);
    }
}
