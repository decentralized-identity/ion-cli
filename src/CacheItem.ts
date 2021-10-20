import { plainToClass } from 'class-transformer';
import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Class describing a cache item for saving and reading
 * cached DIDs.
 */
export default class CacheItem {
    /**
     * Package version.
     */
    public readonly version: string = 'v0.2.0';

    /**
     * Date indicating the date and time
     * the cache item was created.
     */
    public readonly created: Date;

    /**
     * Constructs a new instance on the @see Message class.
     * @param name for the cache item.
     * @param did being cached.
     * @param document containing the latest state of the DID.
     * @param lastResolved indicating the last time the cached item was resolved.
     * @param published indicating whether the DID has been published to the network.
     */
    constructor(public readonly name: string, public readonly did: string, public document: any, public lastResolved: Date, public published: boolean) {
        this.created = new Date();
    }

    /**
     * Loads the cache item with @param name from the specified directory.
     * @param directory that contains the cache.
     * @param name of the cache item to read.
     * @returns the cached item if found, otherwise undefined.
     */
    public static async read(directory: string, name: string): Promise<CacheItem | undefined> {
        if (!directory) {
            throw new Error('A directory is required.');
        }

        if (!name) {
            throw new Error('A name is required.');
        }
        
        try {
            // Load the cache item from the directory and
            // return
            const cacheItemPath = path.join(directory, `cache/${CacheItem.appendType(name)}`);
            const cacheJson = await fs.readJson(cacheItemPath);
            return plainToClass(CacheItem, <object>cacheJson);
        } catch (error) {
            // If the item is found, but is invalid
            // rethrow the error.
            if (error instanceof SyntaxError) {
                throw error;
            }
        }
    }

    /**
     * Saves the instance of the cache item to specified directory
     * as a json file.
     * @param directory to save the package to.
     */
    public async save(directory: string): Promise<void> {
        if (!directory) {
            throw new Error('A directory is required.');
        }

        // This will also create the specified directory if
        // it does not exist.
        const basePath = path.join(directory, 'cache');
        await fs.mkdir(basePath, { recursive: true });

        // Now save the item
        const cacheItemPath = path.join(directory, `cache/${CacheItem.appendType(this.name)}`);
        await fs.writeJSON(cacheItemPath, this, { spaces: 2 });
    }

    /**
     * Checks to see if the file name includes the
     * type '.json' and if not appends.
     * @param fileName to check.
     * @returns the filename with type appended.
     */
    private static appendType(fileName: string): string {
        if (fileName.endsWith('.json')) {
            return fileName;
        }

        return `${fileName}.json`;
    }
}
