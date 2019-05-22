"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pg = require("pg");

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var pool = {};

if (process.env.NODE_ENV == 'test') {
  pool = new _pg.Pool({
    connectionString: process.env.DATABASE_URL_TEST
  });
} else if (process.env.NODE_ENV == 'prod') {
  pool = new _pg.Pool({
    connectionString: process.env.DATABASE_URL_PRO
  });
} else {
  pool = new _pg.Pool({
    connectionString: process.env.DATABASE_URL
  });
}

pool.on('connect', function () {
  return console.log('Connected to database...');
});
var _default = pool;
exports["default"] = _default;
