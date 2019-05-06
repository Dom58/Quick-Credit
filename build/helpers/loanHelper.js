"use strict";

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports.validateLoan = function (loan) {
  var schema = _joi["default"].object().keys({
    amount: _joi["default"].number().required(),
    tenor: _joi["default"].number().min(1).max(12).required()
  });

  return _joi["default"].validate(loan, schema, {
    abortEarly: false
  });
};

exports.validateApproveLoan = function (loan) {
  var schema = _joi["default"].object().keys({
    status: _joi["default"].string().valid('approved', 'rejected').required()
  });

  return _joi["default"].validate(loan, schema, {
    abortEarly: false
  });
};

exports.validateRepayment = function (repayment) {
  var schema = _joi["default"].object().keys({
    amount: _joi["default"].number().required()
  });

  return _joi["default"].validate(repayment, schema);
};