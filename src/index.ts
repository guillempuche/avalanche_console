import { config as dotenvConfig } from 'dotenv';
import { Console } from './console';

// Load environment variables
dotenvConfig({ path: '.env', debug: process.env.NODE_ENV == 'development' });

Console.start();

// // Tooling
// const bintools = BinTools.getInstance();

// // UTXOs
// const cb58Decoded = bintools.cb58Decode(utxos.user_a[0]);
