"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _UserController = _interopRequireDefault(require("../controllers/UserController"));

var _auth = _interopRequireDefault(require("../middleware/auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var route = _express["default"].Router();

route.post('/api/v2/auth/signup', _UserController["default"].signup);
route.get('/api/v2/auth/users', _auth["default"], _UserController["default"].allUsers);
route.post('/api/v2/auth/signin', _UserController["default"].signin);
route.patch('/api/v2/users/:email/verify', _auth["default"], _UserController["default"].verifyUser);
var _default = route;
exports["default"] = _default;
