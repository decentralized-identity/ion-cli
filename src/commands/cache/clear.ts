import { Command, flags } from '@oclif/command';
import * as fs from 'fs-extra';
import * as path from 'path';
const { cli } = require('cli-ux');

export default class Clear extends Command {
  public static description = 'Clears the DID cache, removing all previously resolved DIDs.';

  public static examples = [
    '$ ion cache:clear -d d:\dids',
  ];

  public static flags = {
    help: flags.help({ char: 'h' }),

    // Flag for specifying a directory to which keys and documents should be saved.
    directory: flags.string({ char: 'd', description: 'that contains the cache. Defaults to environment variable DID_PATH if set.', env: 'DID_PATH', required: true }),
  };

  public async run () {
    const { flags } = this.parse(Clear);

    // Clear the cache
    cli.action.start('Clearing cache.');
    const cacheDirectory = path.join(flags.directory, 'cache');
    await fs.emptyDir(cacheDirectory);
    cli.action.stop();
    this.exit();
  }
}
