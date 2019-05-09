"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _userRoute = _interopRequireDefault(require("./routes/userRoute"));

var _loanRoute = _interopRequireDefault(require("./routes/loanRoute"));

var _swagger = _interopRequireDefault(require("../swagger.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use(_express["default"].json());
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use(_userRoute["default"]);
app.use(_loanRoute["default"]);
var port = process.env.PORT || 4000;
app.get('/', function (req, res) {
  res.send({
    status: 200,
    message: 'Welcome to Quick credit web application'
  });
});
app.get('/api/documentations', _swaggerUiExpress["default"].serve, _swaggerUiExpress["default"].setup(_swagger["default"]));
app.listen(port, function () {
  console.log("Server is runnig on (http://127.0.0.1:".concat(port, ")"));
});
var _default = app;
exports["default"] = _default;