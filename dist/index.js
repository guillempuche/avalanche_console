'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const avalanche_1 = require('avalanche');
const dotenv_1 = __importDefault(require('dotenv'));
dotenv_1.default.config({ path: '.env' });
var utxos = require('./data');
console.log(process.env.HOST);
console.log(process.env.HOST);
console.log(process.env.PROTOCOL);
console.log(typeof process.env.HOST);
console.log(typeof process.env.HOST);
// console.log(process.env);
// Set up the connection
const avalancheNetwork = new avalanche_1.Avalanche(
  String(process.env.HOST),
  Number(process.env.PORT),
  String(process.env.PROTOCOL)
);
// const avalancheNetwork = new avalanche.Avalanche({
// 	protocol: process.env.PROTOCOL,
// 	port: process.env.PORT,
// 	host: '127.0.0.1',
// });
// Tooling
var bintools = avalanche_1.BinTools.getInstance();
// UTXOs
const cb58Decoded = bintools.cb58Decode(utxos[0]);
console.log(cb58Decoded);
