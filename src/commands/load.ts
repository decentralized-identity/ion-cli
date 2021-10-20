import { Command, flags } from '@oclif/command';
import Output from '../Output';
import StorageItem from '../StorageItem';
const { cli } = require('cli-ux');

export default class Load extends Command {
  public static description = 'Loads a DID from the directory using the friendly name.';

  public static examples = [
    '$ ion load FriendlyName',
    '$ ion load FriendlyName -d d:/dids',
    '$ ion load FriendlyName -d d:/dids --escape',
  ];

  public static flags = {
    help: flags.help({ char: 'h' }),

    // Flag for specifying a directory to which keys and documents should be saved.
    directory: flags.string({ char: 'd', description: 'to which the DID should be saved. Defaults to environment variable DID_PATH if set.', env: 'DID_PATH', required: true }),

    // Flag for specifying what specific objects to load from the package
    what: flags.enum({ description: 'specify the objects from the specified package to load.', options: ['All', 'InitialState', 'Keys'], default: 'All' }),

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
    const { args, flags } = this.parse(Load);

    // Load the DID and return
    cli.action.start(`Loading DID '${args.name}' from '${flags.directory}'.`);
    const didPackage: StorageItem = await StorageItem.load(flags.directory, args.name);
    cli.action.stop();

    let packageSubset;
    switch (flags.what) {
      case 'InitialState':
        packageSubset = didPackage.initialState;
        break;
      case 'Keys':
        packageSubset = didPackage.keys;
        break;
      default:
        packageSubset = didPackage;
    }

    this.log(Output.toJson(packageSubset, flags.escape));
    this.exit();
  }
}
