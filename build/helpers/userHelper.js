"use strict";

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports.validateSignup = function (user) {
  var schema = _joi["default"].object().keys({
    // eslint-disable-next-line newline-per-chained-call
    firstname: _joi["default"].string().min(3).max(40).required().label('First Name').empty(/\s+/).trim(),
    lastname: _joi["default"].string().min(3).max(40).required().label('Last Name').empty(/\s+/).trim(),
    email: _joi["default"].string().email({
      minDomainAtoms: 2
    }).required().label('Email'),
    address: _joi["default"].string().label('User Adress'),
    isadmin: _joi["default"]["boolean"]().label('Admin'),
    password: _joi["default"].string().regex(/^[a-zA-Z0-9]{6,30}$/).label('Password').empty(/\s+/).trim().error(function (error) {
      return "Password is required and strong ( * mix characters and numbers) and at least 6 characters long";
    })
  });

  return _joi["default"].validate(user, schema, {
    abortEarly: false
  });
};

exports.validateLogin = function (user) {
  var login = {
    email: _joi["default"].string().email().required().label('Email'),
    password: _joi["default"].string().required().label("Password").empty(/\s+/).trim()
  };
  return _joi["default"].validate(user, login, {
    abortEarly: false
  });
};

exports.validateApplication = function (user) {
  var schema = _joi["default"].object().keys({
    status: _joi["default"].string().valid('verified', 'unverified').required().label('Verification ')
  });

  return _joi["default"].validate(user, schema, {
    abortEarly: false
  });
};