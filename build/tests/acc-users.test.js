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
  var userDemo = {
    id: 1,
    firstName: 'admin',
    lastName: 'admin58',
    email: 'admin@gmail.com',
    status: 'verified',
    isAdmin: 'true',
    password: 'zxasqw58'
  };

  var token = _jsonwebtoken["default"].sign(userDemo, "".concat(process.env.SECRET_KEY_CODE), {
    expiresIn: '24h'
  });

  it('should not found the created user accounts', function () {
    _chai["default"].request(_app["default"]).get('/api/v1/auth/users').set('Authorization', token).end(function (err, res) {
      expect(res.body.status).to.equal(404);
      expect(res.body).to.have.property('status');
      expect(res.body).to.be.an('object');
    });
  });
  it('shoud create admin account', function () {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send({
      firstName: 'admin',
      lastName: 'admin58',
      email: 'admin@gmail.com',
      isAdmin: 'true',
      password: 'zxasqw58'
    }).end(function (err, res) {
      expect(res.body.status).to.equal(201);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('data');
      expect(res.body).to.be.an('object');
    });
  });
  it('should create client account', function () {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send({
      firstName: 'client',
      lastName: 'client58',
      email: 'client@gmail.com',
      address: 'Kigali/Gasabo',
      isAdmin: 'false',
      password: 'zxasqw58'
    }).end(function (err, res) {
      expect(res.body.status).to.equal(201);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('data');
      expect(res.body).to.be.an('object');
    });
  });
  it('should not create a user because all field are required', function () {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send({
      firstName: '',
      lastName: '',
      email: '',
      isAdmin: '',
      password: ''
    }).end(function (err, res) {
      expect(res.body.status).to.equal(400);
      expect(res.body).to.have.property('status');
      expect(res.body).to.be.an('object');
    });
  });
  it('should not create user because email already registed', function () {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send({
      firstName: 'damascene',
      lastName: 'damas58',
      email: 'admin@gmail.com',
      isAdmin: 'false',
      password: 'zxasqw58'
    }).end(function (err, res) {
      expect(res.body.status).to.equal(409);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');
      expect(res.body).to.be.an('object');
    });
  });
  it('should not create user because email format is invalid', function () {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send({
      firstName: 'damascene',
      lastName: 'damas58',
      email: 'clientgmailcom',
      address: 'hdhh',
      isAdmin: 'false',
      password: 'zxasqw58'
    }).end(function (err, res) {
      expect(res.body.status).to.equal(400);
      expect(res.body).to.have.property('status');
      expect(res.body).to.be.an('object');
    });
  });
});
describe('signin', function () {
  it('should not signin because email and password are required', function () {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/signin').send({
      email: '',
      password: ''
    }).end(function (err, res) {
      expect(res.body.status).to.equal(400);
      expect(res.body).to.have.property('status');
      expect(res.body).to.be.an('object');
    });
  });
  it('should not signin because password is incorrect', function () {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/signin').send({
      email: 'admin@gmail.com',
      password: 'zxcvzxc'
    }).end(function (err, res) {
      expect(res.body.status).to.equal(401);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');
      expect(res.body).to.be.an('object');
    });
  });
  it('should not signin because email is not valid', function () {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/signin').send({
      email: 'adminzz@gmail.com',
      password: 'zxasqw58'
    }).end(function (err, res) {
      expect(res.body.status).to.equal(401);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');
      expect(res.body).to.be.an('object');
    });
  });
  it('should signin in quick credit web application', function () {
    var user = {
      email: 'admin@gmail.com',
      password: 'zxasqw58'
    };

    _chai["default"].request(_app["default"]).post('/api/v1/auth/signin').send(user).end(function (err, res) {
      expect(res.body.status).to.equal(200);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('data');
      expect(res.body).to.be.an('object');
    });
  });
});
describe('Users', function () {
  it('should not allowed to view all users because token required', function () {
    _chai["default"].request(_app["default"]).get('/api/v1/auth/users').end(function (err, res) {
      expect(res.body.status).to.equal(403);
      expect(res.body).to.have.property('status');
      expect(res.body).to.be.an('object');
    });
  });
  var userDemo = {
    id: 1,
    firstName: 'admin',
    lastName: 'admin58',
    email: 'admin@gmail.com',
    status: 'verified',
    isAdmin: 'true',
    password: 'zxasqw58'
  };

  var token = _jsonwebtoken["default"].sign(userDemo, "".concat(process.env.SECRET_KEY_CODE), {
    expiresIn: '24h'
  });

  it('should verify a client because isAdmin is found in token', function () {
    _chai["default"].request(_app["default"]).patch('/api/v1/users/client@gmail.com/verify').set('Authorization', token).send({
      status: 'verified'
    }).end(function (err, res) {
      expect(res.body.status).to.equal(200);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('data');
      expect(res.body).to.be.an('object');
    });
  });
  it('should not verify user because email is invalid', function () {
    _chai["default"].request(_app["default"]).patch('/api/v1/users/clientxxx@gmail.com/verify').set('Authorization', token).send({
      status: 'verified'
    }).end(function (err, res) {
      expect(res.body.status).to.equal(404);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('message');
      expect(res.body).to.be.an('object');
    });
  });
  it('should not verify user because email have already Verified', function () {
    _chai["default"].request(_app["default"]).patch('/api/v1/users/client@gmail.com/verify').set('Authorization', token).send({
      status: 'verified'
    }).end(function (err, res) {
      expect(res.body.status).to.equal(400);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('message');
      expect(res.body).to.be.an('object');
    });
  });
  it('should not virify user because no token provided', function () {
    _chai["default"].request(_app["default"]).patch('/api/v1/users/client@gmail.com/verify').set('Authorization', !token).send({
      status: 'verified'
    }).end(function (err, res) {
      expect(res.body.status).to.equal(401);
    });
  });
  it('should get all users', function () {
    _chai["default"].request(_app["default"]).get('/api/v1/auth/users').set('Authorization', token).end(function (err, res) {
      expect(res.body.status).to.equal(200);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('data');
      expect(res.body).to.be.an('object');
    });
  });
  it('should not view all users because no token provided', function () {
    _chai["default"].request(_app["default"]).get('/api/v1/auth/users').set('Authorization', !token).end(function (err, res) {
      expect(res.body.status).to.equal(401);
      expect(res.body).to.have.property('status');
      ;
    });
  });
});
describe('IsAdmin equal false', function () {
  var notIsAdmin = {
    id: 5,
    firstName: 'clients',
    lastName: 'client58s',
    email: 'clientzz@gmail.com',
    isAdmin: 'false',
    password: 'zxasqw58'
  };

  var token = _jsonwebtoken["default"].sign(notIsAdmin, "".concat(process.env.SECRET_KEY_CODE), {
    expiresIn: '24h'
  });

  it('should not view all users because user not an admin', function () {
    _chai["default"].request(_app["default"]).get('/api/v1/auth/users').set('Authorization', token).end(function (err, res) {
      expect(res.body.status).to.equal(400);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');
      expect(res.body).to.be.an('object');
    });
  });
  it('should not verify because user not an admin', function () {
    _chai["default"].request(_app["default"]).patch('/api/v1/users/clients@gmail.com/verify').set('Authorization', token).send({
      status: 'verified'
    }).end(function (err, res) {
      expect(res.body.status).to.equal(400);
      expect(res.body).to.have.property('status');
    });
  });
});