import prompts, { prompt, Answers } from 'inquirer';
import { BcAvalanche } from './blockchain/bc_impl_avalanche';
import { bunchOfUsers, Storage, User } from './storage';
// import { from } from 'rxjs';
// import prompt from 'prompt';
// import { prompt, PromptObject } from 'prompts';

export class Console {
  static async start(): Promise<void> {
    this.showMenu();
  }

  static showMenu(): void {
    // Add a blank line on the console.
    console.log('\n');

    // Questions of the menu.
    const question: Question = {
      name: 'show_menu',
      type: 'list',
      message: 'Choice an action?',
      choices: [
        'Create users on X-Chain',
        'Get list of all users on X-Chain',
        "Create user's address on X-Chain",
        "Get user's address on X-Chain",
        // 'Exit',
      ],
    };

    prompt<Answers>(question).then(async (answer) => {
      Storage.instance.saveLastActionToHistory({
        name: question.name,
        value: answer.show_menu,
      });

      // Depending on what you select, the program takes
      // a different action
      switch (answer.show_menu) {
        // Create a bunch of users
        case question.choices![0]:
          this.createUsers();
          break;

        // Get all the list of users on the network.
        case question.choices![1]: {
          await this.listAllUsers();
          break;
        }

        // Create an address on X-Chain for one user.
        case question.choices![2]:
          await this.createUserXAddress();
          break;

        // Get all addresses on X-Chain for one user.
        case question.choices![3]:
          await this.getAllUserAddress();
          break;

        // case question.choices![4]:
        //   // TODO: exit prompt
        //   console.log('exit');
        //   break;
      }
    });
  }

  static createUsers(): void {
    prompt({
      name: 'create_users',
      type: 'input',
      message: 'How many users do you want to create (min 1, max 5)?',
      default: 2,
      validate(input: string): true | string {
        if (input.match(/^[1-5]$/i)) {
          return true;
        }

        return 'Please enter a number between 1 and 5';
      },
    }).then(async (answer) => {
      Storage.instance.saveLastActionToHistory({
        name: 'create_users',
        value: answer.create_users,
      });

      try {
        for (let index = 0; index < answer.create_users; index++) {
          await BcAvalanche.instance.createUser(bunchOfUsers[index]);
        }

        console.log(`${answer.create_users} user(s) created.`);
      } catch (err) {
        console.error(err);
      }

      this.showMenu();
    });
  }

  static async listAllUsers(): Promise<void> {
    const usersname = await BcAvalanche.instance.listAllUsers();

    console.log('List of usernames:');
    usersname.forEach((username) => console.log(`- ${username}`));

    this.showMenu();
  }

  static async createUserXAddress(): Promise<void> {
    const allUsernames = await BcAvalanche.instance.listAllUsers();

    prompt({
      name: 'create_user_address_x_chain',
      type: 'list',
      message: 'Create an address on X-Chain for one of next users?',
      choices: allUsernames,
    }).then(async (answer) => {
      const username: string = answer.create_user_address_x_chain;
      answer.create_user_address_x_chain;

      console.log(`Creating an address for "${username}"...`);

      Storage.instance.saveLastActionToHistory({
        name: 'create_user_address_x_chain',
        value: username,
      });

      try {
        const user: User | undefined = bunchOfUsers.find(
          (user) => user.username == username,
        ); //.forEach((user) => )

        if (user === undefined) throw Error(`${username} doesn't exist.`);

        const address = await BcAvalanche.instance.createUserAddress(user);
        console.log(`Address ${address} created`);
      } catch ({ message }) {
        console.error(message);
      }

      this.showMenu();
    });
  }

  static async getAllUserAddress(): Promise<void> {
    const allUsernames = await BcAvalanche.instance.listAllUsers();

    prompt({
      name: 'get_all_user_address',
      type: 'list',
      message: 'Get all addresses of one of these users:',
      choices: allUsernames,
    }).then(async (answer) => {
      const username = answer.get_all_user_address;
      const user: User | undefined = bunchOfUsers.find(
        (user) => user.username == username,
      );

      if (user != undefined) {
        const addresses = await BcAvalanche.instance.getAllUserAddress(user);

        console.log(`List of addresses for ${user.username}`);
        addresses.forEach((address) => console.log(`- ${address}`));
      } else {
        console.log(`${username} doesn't exist on local database.`);
      }

      this.showMenu();
    });
  }
}

interface Question {
  name: string;
  type: 'list' | 'input';
  message: string;
  choices?: string[];
  validate?: (input: string) => true | string;
}
