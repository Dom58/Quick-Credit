"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _app = _interopRequireDefault(require("../app.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var expect = _chai["default"].expect;

_chai["default"].use(_chaiHttp["default"]);

describe('signup', function () {
  var app = _app["default"];
  beforeEach(function () {});
  var userDemo = {
    id: 1,
    firstname: 'admin',
    lastname: 'admin58',
    email: 'superadmin@gmail.com',
    status: 'verified',
    isadmin: true,
    password: 'zxasqw58'
  };

  var token = _jsonwebtoken["default"].sign(userDemo, "".concat(process.env.SECRET_KEY_CODE), {
    expiresIn: '24h'
  });

  it('should not create a user because all field are required', function () {
    _chai["default"].request(_app["default"]).post('/api/v2/auth/signup').send({
      firstname: ' ',
      lastname: ' ',
      email: '',
      password: ''
    }).end(function (err, res) {
      console.log(res.body);
      expect(res.body.status).to.equal(400);
      expect(res.body).to.have.property('status');
      expect(res.body).to.be.an('object');
    });
  });
  it('should not create user because email already registed', function () {
    _chai["default"].request(_app["default"]).post('/api/v2/auth/signup').send({
      firstname: 'damascene',
      lastname: 'damas58',
      email: 'client@gmail.com',
      password: 'zxasqw58'
    }).end(function (err, res) {
      console.log(res.body);
      expect(res.body.status).to.equal(409);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');
      expect(res.body).to.be.an('object');
    });
  });
  it('should not create user because email format is invalid', function () {
    _chai["default"].request(_app["default"]).post('/api/v2/auth/signup').send({
      firstname: 'damascene',
      lastname: 'damas58',
      email: 'clientgmailcom',
      address: 'hdhh',
      isadmin: false,
      password: 'zxasqw58'
    }).end(function (err, res) {
      console.log(res.body);
      expect(res.body.status).to.equal(400);
      expect(res.body).to.have.property('status');
      expect(res.body).to.be.an('object');
    });
  });
});
