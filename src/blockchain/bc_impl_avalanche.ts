import { Avalanche as Ava } from 'avalanche';
import { AVMAPI } from 'avalanche/dist/apis/avm';
import { KeystoreAPI } from 'avalanche/dist/apis/keystore';
import { User } from '../storage';
import { Blockchain, UserParams } from './bc_interface';

export class BcAvalanche implements Blockchain<Ava> {
  readonly network: Ava;
  private _keystore: KeystoreAPI;
  private _xChain: AVMAPI;

  private constructor() {
    // Set up the connection to Avalanche network.
    this.network = new Ava(
      String(process.env.HOST),
      Number(process.env.PORT),
      String(process.env.PROTOCOL),
    );

    this._keystore = this.network.NodeKeys();
    this._xChain = this.network.XChain();
  }

  private static _instance: BcAvalanche;

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  async createUser({ username, password }: UserParams): Promise<void> {
    try {
      const result = await this._keystore.createUser(username, password);
      console.log(result);
    } catch ({ message }) {
      console.log(message);
    }
  }

  /**
   * @returns List of usernames.
   */
  async listAllUsers(): Promise<string[]> {
    return await this._keystore.listUsers();
  }

  async createUserAddress(user: User): Promise<string> {
    return await this._xChain.createAddress(user.username, user.password);
  }

  async getAllUserAddress(user: User): Promise<string[]> {
    const response = await this._xChain.listAddresses(
      user.username,
      user.password,
    );
    return response;
  }
}
