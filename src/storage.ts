import fs, { writeFile } from 'fs';
import path from 'path';
import ConfigStore from 'configstore';

export const utxos = {
  user_a: [
    '112AMw3s4TKkpoXp9cvFQvvmXHhJFofGEUGW4YH42EVD3qGW6qrFEvpCpWfQaCW1Gw7bFtB3NK8aUoMayWRujk4hyK1mtmsCgwfsjfGhTWQuFaCUqSZCitvUBX7TYBpjZLTjNgFQdjsemFgiSG3u1qJro52pUxfod',
    '118bnavbo4Xj98uCDpGfeDwieUtzsfzuk5uCYTvHSC7AVHT3qVkqKQBmV9ubm8QShHDTqXibqSXSAs8f429UeDkuZMj6WjLA64R8eok5WuSkAkJEijQwJ1bM5cvs8xtXKXfDRHxoQisP5fXYWWzKrsQc8SjHZWCLC1rbTq',
  ],
};

const relativePath = path.resolve(__dirname);

export class Storage {
  filename = `${relativePath}/data.json`;

  private constructor() {
    if (!fs.existsSync(this.filename)) {
      const initialContent: object = { history: [] };

      fs.writeFileSync(this.filename, JSON.stringify(initialContent));
    }

    // Parse JSON string to JSON object
    const file = JSON.parse(
      fs.readFileSync(this.filename, { encoding: 'utf8' }),
    );
    this.dataFile = new ConfigStore(file.name);
  }

  private static _instance: Storage;
  public dataFile: ConfigStore;

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  /**
   * Get object from data file.
   */
  readDataFile(): DataFile {
    // If data file doesn't exits, create one.
    if (!fs.existsSync(this.filename)) {
      this.writeDataFile(initialDataFile);
    }

    const jsonString = fs.readFileSync(this.filename, { encoding: 'utf-8' });
    return JSON.parse(jsonString);
  }

  /**
   * Save data to database.
   *
   * The new data will replace the old data of the database.
   */
  writeDataFile(data: DataFile): void {
    // If data file doesn't exits, create one.
    if (!fs.existsSync(this.filename)) {
      this.writeDataFile(initialDataFile);
    }

    fs.writeFileSync(this.filename, JSON.stringify(data, null, 2));
  }

  saveLastActionToHistory(params: ActionParams): void {
    const action = Object.assign(params, {
      dateTime: new Date().toISOString(),
    });

    const data = this.readDataFile();
    data.history.push(action);
    this.writeDataFile(data);
  }

  getLastActionFromHistory(): Action {
    const history: Action[] = this.dataFile.get('history');

    return history[history.length];
  }

  getAllUsers(): User[] {
    return this.readDataFile().users;
  }
}

////////////////////////////////
////////// Interfaces and types

export type DataFile = {
  history: Action[];
  users: User[];
};

export type Action = {
  name: string;
  value: string | null;
  dateTime: string;
};
export type ActionParams = {
  name: string;
  value: string | null;
};

export type User = {
  username: string;
  password: string;
};

////////////////////////////////
////////// Sample data

export const initialDataFile: DataFile = {
  history: [],
  users: [],
};

/**
 * See Avalanchde docs about the restrictions for username and password https://docs.avax.network/build/avalanchego-apis/keystore#keystorecreateuser
 */
export const bunchOfUsers: User[] = [
  {
    username: 'user_a',
    password: 'Avalanche_-11',
  },
  {
    username: 'user_b',
    password: 'Avalanche_-22',
  },
  {
    username: 'user_c',
    password: 'Avalanche_-33',
  },
  {
    username: 'user_d',
    password: 'Avalanche_-44',
  },
  {
    username: 'user_e',
    password: 'Avalanche_-55',
  },
];
