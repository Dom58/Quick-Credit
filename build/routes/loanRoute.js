"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _LoanController = _interopRequireDefault(require("../controllers/LoanController"));

var _auth = _interopRequireDefault(require("../middleware/auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var route = _express["default"].Router();

route.post('/api/v2/loans', _auth["default"], _LoanController["default"].applyLoan);
route.get('/api/v2/loans', _auth["default"], _LoanController["default"].allLoans);
route.get('/api/v2/loans/:id', _auth["default"], _LoanController["default"].specificLoan);
route.patch('/api/v2/loans/:id', _auth["default"], _LoanController["default"].approveLoan);
route.post('/api/v2/loans/:id/repayment', _auth["default"], _LoanController["default"].repayLoan);
route.get('/api/v2/loans/:id/repayments', _auth["default"], _LoanController["default"].specificLoanRepayment);
route.get('/api/v2/repayments/loans', _auth["default"], _LoanController["default"].allRepaymentLoan);
var _default = route;
exports["default"] = _default;
