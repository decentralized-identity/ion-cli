import { plainToClass } from 'class-transformer';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import CurrentState from './CurrentState';
import InitialState from './InitialState';
import Output from './Output';

/**
 * Class describing a package for saving and loading
 * DID metadata and keys.
 */
export default class Package {
  /**
   * Package version.
   */
  public readonly version: string = 'v0.2.0';

  /**
   * Date indicating the date and time
   * the package was created.
   */
  public readonly created: Date;

  /**
   * Constructs a new instance on the @see Message class.
   * @param name of the DID package.
   * @param initialState of the DID.
   * @param keys associated with the DID.
   * @param [currentState] of the DID. See @class CurrentState.
   */
  constructor (public readonly name: string, public readonly initialState: InitialState, public readonly keys: any[], public currentState?: CurrentState) {
    this.created = new Date();
  }

  /**
   * Checks if the specified package exists.
   * @param directory from which to load the package.
   * @param name of the package to load.
   */
  public static exists (directory: string, name: string): boolean {
    if (!directory) {
      throw new Error('A directory is required.');
    }

    if (!name) {
      throw new Error('A name is required.');
    }

    // Check if the file exists.
    const packagePath = path.join(directory, `${name}.json`);
    return fs.existsSync(packagePath);
  }

  /**
   * Loads the DID package with @param name from the specified directory.
   * @param directory from which to load the package.
   * @param name of the package to load.
   */
  public static async loadPackage (directory: string, name: string): Promise<Package> {
    if (!directory) {
      throw new Error('A directory is required.');
    }

    if (!name) {
      throw new Error('A name is required.');
    }

    // Load the package from the directory and
    // return
    const packagePath = path.join(directory, `${name}.json`);
    const packageFile = await fsPromises.readFile(packagePath, { encoding: 'utf-8' });
    const packageJson = JSON.parse(packageFile);
    return plainToClass(Package, <object>packageJson);
  }

  /**
   * Saves the instance of the package to specified directory
   * as a json file.
   * @param directory to save the package to.
   */
  public async savePackage (directory: string): Promise<void> {
    if (!directory) {
      throw new Error('A directory is required.');
    }

    // This will also create the specified directory if
    // it does not exist.
    const basePath = path.join(directory);
    await fsPromises.mkdir(basePath, { recursive: true });

    // Add the package and and write file
    const packagePath = path.join(directory, `${this.name}.json`);
    await fsPromises.writeFile(packagePath, Output.toJsonString(this), { encoding: 'utf-8' });
  }
}
