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

    // Check if we have been passed a storage item and extract
    // the initial state, before checking that the initial state
    // conating the expected properties. 
    const initialState = args.initialState.initialState ? args.initialState.initialState : args.initialState;
    if (!initialState.longForm || !initialState.ops || initialState.ops.length === 0) {
      throw new Error(`The initialState argument provided does not include the expected properties.`);
    }

    const jsonInitialState = JSON.parse(initialState);
    const did = new ION.DID(jsonInitialState);
    const requestBody = await did.generateRequest();
    const request = new ION.AnchorRequest(requestBody);
    await request.submit();
  }
}
