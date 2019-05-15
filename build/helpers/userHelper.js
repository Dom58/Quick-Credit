"use strict";

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports.validateSignup = function (user) {
  var schema = _joi["default"].object().keys({
    // eslint-disable-next-line newline-per-chained-call
    firstName: _joi["default"].string().min(3).max(40).required().label('First Name'),
    lastName: _joi["default"].string().min(3).max(40).required().label('Last Name'),
    email: _joi["default"].string().email({
      minDomainAtoms: 2
    }).required().label('Email'),
    address: _joi["default"].string().label('User Adress'),
    isAdmin: _joi["default"]["boolean"]().label('Admin'),
    password: _joi["default"].string().regex(/^[a-zA-Z0-9]{6,30}$/).label('Password')
  });

  return _joi["default"].validate(user, schema, {
    abortEarly: false
  });
};

exports.validateLogin = function (user) {
  var login = {
    email: _joi["default"].string().email().required().label('Email'),
    password: _joi["default"].string().required().label('Password')
  };
  return _joi["default"].validate(user, login, {
    abortEarly: false
  });
};