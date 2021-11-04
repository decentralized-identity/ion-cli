import { plainToClass } from 'class-transformer';
import * as fs from 'fs-extra';
import * as path from 'path';
import InitialState from './InitialState';

/**
 * Class describing a storage item for saving and loading
 * DID metadata and keys.
 */
export default class StorageItem {
  /**
   * Storage item version.
   */
  public readonly version: string = 'v0.2.1';

  /**
   * Date indicating the date and time
   * the storage was created.
   */
  public readonly created: Date;

  /**
   * Flag indicating whether the DID has been
   * published to the network.
   */
  public published: boolean = false;

  /**
   * Constructs a new instance on the @see StorageItem class.
   * @param name of the DID.
   * @param initialState of the DID.
   * @param keys associated with the DID.
   */
  constructor (public readonly name: string, public readonly initialState: InitialState, public readonly keys: any[]) {
    this.created = new Date();
  }

  /**
   * Checks if the specified storage item exists.
   * @param directory from which to load the storage item.
   * @param name of the storage item to load.
   */
  public static exists (directory: string, name: string): boolean {
    if (!directory) {
      throw new Error('A directory is required.');
    }

    if (!name) {
      throw new Error('A name is required.');
    }

    // Check if the file exists.
    const storageItemPath = path.join(directory, `${name}.json`);
    return fs.existsSync(storageItemPath);
  }

  /**
   * Loads the DID with @param name from the specified directory.
   * @param directory from which to load the DID.
   * @param name of the DID to load.
   */
  public static async load (directory: string, name: string): Promise<StorageItem> {
    if (!directory) {
      throw new Error('A directory is required.');
    }

    if (!name) {
      throw new Error('A name is required.');
    }

    // Load the DID from the directory and
    // return
    const storageItemPath = path.join(directory, `${name}.json`);
    const storageItemJson = await fs.readJson(storageItemPath, { encoding: 'utf-8' });
    return plainToClass(StorageItem, <object>storageItemJson);
  }

  /**
   * Saves the instance of the DID to specified directory
   * as a json file.
   * @param directory to save the DID to.
   */
  public async save (directory: string): Promise<void> {
    if (!directory) {
      throw new Error('A directory is required.');
    }

    // This will also create the specified directory if
    // it does not exist.
    const basePath = path.join(directory);
    await fs.mkdir(basePath, { recursive: true });

    // Write the json to file
    const storageItemPath = path.join(directory, `${this.name}.json`);
    await fs.writeJSON(storageItemPath, this, { spaces: 2 });
  }
}
