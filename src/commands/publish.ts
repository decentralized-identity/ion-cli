import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import StorageItem from '../StorageItem';
const ION = require('@decentralized-identity/ion-tools');

export default class Publish extends Command {
  public static description = 'Publishes the specified DID to the ION network.';

  public static examples = [
    '$ ion publish {ESCAPED INITIAL STATE} --friendlyName={FRIENDLY_NAME}',
  ];

  public static flags = {
    help: flags.help({ char: 'h' }),

    // Flag for specifying a directory to which keys and documents should be saved.
    directory: flags.string({ char: 'd', description: 'to which the DID should be saved. Defaults to environment variable DID_PATH if set.', env: 'DID_PATH', required: false, dependsOn: ['friendlyName'] }),

    // Flag for specifying the friendly name of the DID to load
    friendlyName: flags.string({ description: 'specifies the friendly name of the DID to load and publish.', required: false, dependsOn: ['directory']}),
  };

  public static args = [
    {
      name: 'initialState',
      required: false,
      description: 'the initial state of the DID being published.',
    }
  ];

  public async run () {
    const { args, flags } = this.parse(Publish);

    let jsonInitialState;
    let didPackage: StorageItem;
    let updateStorageItem: boolean = false;

    if (args.initialState) {
      cli.action.start('Checking initial state.');
      // Check if we have been passed a storage item and extract
      // the initial state, then check that the initial state
      // contains the expected properties. 
      jsonInitialState = JSON.parse(args.initialState.initialState ? args.initialState.initialState : args.initialState);
      if (!jsonInitialState.longForm || !jsonInitialState.ops || jsonInitialState.ops.length === 0) {
        throw new Error(`The initialState argument provided does not include the expected properties.`);
      }
      cli.action.stop();
    } else {
      // Load the DID and return
      cli.action.start(`Loading DID '${flags.friendlyName}' from '${flags.directory}'.`);
      didPackage = await StorageItem.load(flags.directory!, flags.friendlyName!);

      // Check if the DID has already been published
      if (didPackage.published) {
        throw new Error(`The DID '${flags.friendlyName}' has already been published.`);
      }

      jsonInitialState = didPackage.initialState;
      updateStorageItem = true;
      cli.action.stop();
    }

    cli.action.start(`Publishing DID '${flags.friendlyName}'.`);
    const did = new ION.DID(jsonInitialState);
    const requestBody = await did.generateRequest();
    const request = new ION.AnchorRequest(requestBody);
   
    // Now submit the anchoring request
    await request.submit();
    if (updateStorageItem) {
      didPackage!.published = true;
      didPackage!.save(flags.directory!);
    }
          
    cli.action.stop();
  }
}
