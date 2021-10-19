import { Command, flags } from '@oclif/command';
const ION = require('@decentralized-identity/ion-tools');

export default class Publish extends Command {
  public static description = 'Publishes the specified DID to the ION network.';

  public static examples = [
    '$ ion publish {ESCAPED INITIAL STATE}',
  ];

  public static flags = {
    help: flags.help({ char: 'h' }),
  };

  public static args = [
    {
      name: 'initialState',
      required: true,
      description: 'the initial state of the DID being published.',
    },
  ];

  public async run () {
    const { args } = this.parse(Publish);

    const jsonInitialState = JSON.parse(args.initialState);
    const did = new ION.DID(jsonInitialState);
    const requestBody = await did.generateRequest();
    const request = new ION.AnchorRequest(requestBody);
    await request.submit();
  }
}
