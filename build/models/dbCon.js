"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pg = require("pg");

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import config from '../config/config'
// console.log(config);
_dotenv["default"].config();

var pool = new _pg.Pool({
  connectionString: process.env.DATABASE_URL
});
pool.on('connect', function () {
  return console.log('Connected to database...');
});
var _default = pool; // import { Pool } from 'pg';
// import dotenv from 'dotenv';
// dotenv.config();
// let pool = {}
// if (process.env.NODE_ENV === 'DEV') {
//   pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//   });
//   pool.on('connect', () => console.log('Connected to database...'));
// }
// if (process.env.NODE_ENV === 'TEST') {
//   pool = new Pool({
//     connectionString: process.env.DATABASE_URL_TEST,
//   });
//   pool.on('connect', () => console.log('Connected to database...'));
// }
// export default pool;

exports["default"] = _default;