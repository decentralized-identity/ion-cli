import { Command, flags } from '@oclif/command';
import { IBooleanFlag, IOptionFlag } from '@oclif/parser/lib/flags';
import * as fs from 'fs-extra';
import * as path from 'path';
import CacheItem from '../../CacheItem';
import Output from '../../Output';
const { cli } = require('cli-ux');

export interface TableItem {
    name: string, did: string, lastResolved: Date, published: boolean
}

export default class List extends Command {
  public static description = 'Lists the cached DIDs.';

  public static examples = [
    '$ ion cache:list -d d:\dids',
  ];

  public static flags: { help: IBooleanFlag<boolean>, directory: IOptionFlag<string> } = {
    help: flags.help({ char: 'h' }),
 
    // Flag for specifying a directory to which keys and documents should be saved.
    directory: flags.string({ char: 'd', description: 'that contains the cache. Defaults to environment variable DID_PATH if set.', env: 'DID_PATH', required: true }),

    ...cli.table.flags()
  };

  public async run () {
    const { flags } = this.parse(List);

    // Clear the cache
    const cacheDirectory = path.join(flags.directory, 'cache');
    const cachedFiles = await fs.readdir(cacheDirectory);
    
    const cacheList: Array<TableItem> = await Promise.all(cachedFiles.map(async (file): Promise<any> => {
        const cachedItem = await CacheItem.read(flags.directory, file);
        if (cachedItem) {
            return {
                name: cachedItem['name'],
                did: cachedItem.did,
                lastResolved: cachedItem.lastResolved,
                published: cachedItem.published
            };
        } 
    }));

    // Output as a table
    cli.table(
        cacheList,
        {
            name: {},
            lastResolved: {},
            published: {},
            did: { }
        },
        {
            printLine: this.log,
            ...flags as {}
        }
    )
    this.exit();
  }
}
