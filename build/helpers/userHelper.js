"use strict";

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports.validateSignup = function (user) {
  var schema = _joi["default"].object().keys({
    firstName: _joi["default"].string().min(3).max(40).required(),
    lastName: _joi["default"].string().min(3).max(40).required(),
    email: _joi["default"].string().email({
      minDomainAtoms: 2
    }).required(),
    address: _joi["default"].string(),
    isAdmin: _joi["default"]["boolean"](),
    password: _joi["default"].string().regex(/^[a-zA-Z0-9]{6,30}$/)
  });

  return _joi["default"].validate(user, schema, {
    abortEarly: false
  });
};

exports.validateLogin = function (user) {
  var login = {
    email: _joi["default"].string().email().required(),
    password: _joi["default"].string().required()
  };
  return _joi["default"].validate(user, login, {
    abortEarly: false
  });
};