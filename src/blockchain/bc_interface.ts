import { User } from '../storage';

export abstract class Blockchain<T> {
  abstract readonly network: T;

  abstract createUser({ username, password }: UserParams): Promise<void>;

  abstract listAllUsers(): Promise<string[]> | Promise<User[]>;

  /**
   * Create user's address and return that address.
   * @param user
   * @return User's address created.
   */
  abstract createUserAddress(user: User): Promise<string>;

  abstract getAllUserAddress(user: User): Promise<string[]>;

  // abstract putDemoFundOnUser(
  //   fundsFrom: string,
  //   toUserName: string,
  // ): Promise<void>;

  // abstract createNFTAsset({
  //   name,
  //   symbol,
  //   fromUserName,
  //   fromXChainAddresses,
  // }: CreateNFTAssetParams): Promise<void>;
}

////////////////////////////////
////////// Interfaces and types

export type UserParams = {
  username: string;
  password: string;
};

export type CreateNFTAssetParams = {
  name: string;
  symbol: string;
  fromUserName: string;
  fromXChainAddresses: string[];
};
