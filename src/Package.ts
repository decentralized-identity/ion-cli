import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Class describing an identity hub message.
 */
export default class Package {

    /**
     * Date indicating the date and time
     * the package was created.
     */
    public readonly created: Date;

    /**
     * Constructs a new instance on the @see Message class.
     * @param name of the DID package.
     * @param did document.
     * @param keys associated with the DID
     */
    constructor(public readonly name: string, public readonly did: any, public readonly keys: any[]) {
        this.created = new Date();
    }

    /**
     * Loads the DID package with @param name from the specified directory.
     * @param name of the package to load.
     * @param directory from which to load the package.
     */
    public static async loadPackage(directory: string, name: string): Promise<Package> {

        if (!directory) {
            throw new Error('A directory is required.');
        }

        if (!name) {
            throw new Error('A name is required.');
        }

        // Load the package from the directory and
        // return
        const packagePath = path.join(directory, `${name}.json`);
        const packageFile = await fs.readFile(packagePath, { encoding: 'utf-8' });
        return <Package>JSON.parse(packageFile);
    }

    /**
     * Saves the instance of the package to specified directory
     * as a json file.
     * @param directory to save the package to.
     */
    public async savePackage(directory: string): Promise<void> {
        if (!directory) {
            throw new Error('A directory is required.');
        }

        // This will also create the specified directory if
        // it does not exist.
        const basePath = path.join(directory);
        await fs.mkdir(basePath, { recursive: true });

        // Add the package and and write file
        const packagePath = path.join(directory, `${this.name}.json`);
        await fs.writeFile(packagePath, JSON.stringify(this, null, 2) , { encoding: 'utf-8' });
    }
}
