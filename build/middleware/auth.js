"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var authenticated = function authenticated(req, res, next) {
  try {
    var header = req.headers.authorization;
    if (!header || header === '') return res.status(403).json({
      status: 403,
      error: 'FORBIDDEN'
    });

    var token = _jsonwebtoken["default"].verify(header, "".concat(process.env.SECRET_KEY_CODE), {
      expiresIn: '24h'
    });

    req.user = token;
    next();
  } catch (_unused) {
    return res.status(401).json({
      status: 401,
      error: 'UNAUTHORIZED!'
    });
  }
};

var _default = authenticated;
exports["default"] = _default;
