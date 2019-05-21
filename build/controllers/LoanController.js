"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _loanHelper = _interopRequireDefault(require("../helpers/loanHelper"));

var _dbCon = _interopRequireDefault(require("../models/dbCon"));

var _queries = _interopRequireDefault(require("../models/queries"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var loanStatus = {
  badRequestStatus: 400,
  succcessStatus: 200,
  notFoundStatus: 404,
  badRequestMessage: "You dont have the right for this activity! Please contact Admin"
};

var statusMessageFunction = function statusMessageFunction(res, status, message) {
  return res.status(status).json({
    status: status,
    message: message
  });
};

var loanController = {
  applyLoan: function applyLoan(req, res) {
    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var _validate$validateLoa, error, arrErrors, allValdatorFunct, theTenor, theAmount, theInterest, thepaymentInstallment, theBalance, email, haveApplyLoan, loan, createLoan;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _validate$validateLoa = _loanHelper["default"].validateLoan(req.body), error = _validate$validateLoa.error;
              arrErrors = [];

              allValdatorFunct = function allValdatorFunct() {
                for (var i = 0; i < error.details.length; i++) {
                  arrErrors.push(error.details[i].message);
                }
              };

              if (!error) {
                _context.next = 9;
                break;
              }

              "".concat(allValdatorFunct());

              if (!error) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return", res.status(400).json({
                status: 400,
                errors: arrErrors
              }));

            case 7:
              _context.next = 29;
              break;

            case 9:
              theTenor = parseInt(req.body.tenor);
              theAmount = parseFloat(req.body.amount);
              theInterest = parseFloat(req.body.amount) * 0.05;
              thepaymentInstallment = parseFloat((theAmount + theInterest) / theTenor).toFixed(2);
              theBalance = parseFloat(theAmount + theInterest).toFixed(2);
              email = req.user.email;
              _context.next = 17;
              return _dbCon["default"].query(_queries["default"].fetchUserWithLoan, [email]);

            case 17:
              haveApplyLoan = _context.sent;

              if (!(req.user.status === 'verified')) {
                _context.next = 28;
                break;
              }

              if (!(!haveApplyLoan.rows[0] || haveApplyLoan.rows[0].repaid === true)) {
                _context.next = 25;
                break;
              }

              loan = {
                email: req.user.email,
                created_on: new Date(),
                status: 'pending',
                repaid: 'false',
                tenor: theTenor,
                amount: theAmount,
                paymentinstallment: thepaymentInstallment,
                balance: theBalance,
                interest: theInterest.toFixed(2)
              };
              _context.next = 23;
              return _dbCon["default"].query(_queries["default"].insertLoan, [req.user.email, loan.status, loan.repaid, loan.amount, loan.tenor, loan.paymentinstallment, loan.balance, loan.interest, loan.created_on]);

            case 23:
              createLoan = _context.sent;
              return _context.abrupt("return", res.status(201).json({
                status: 201,
                message: 'Loan Applied Successfully, Good Luck!',
                data: {
                  "loanid": createLoan.rows[0].id,
                  "firstName": req.user.firstName,
                  "lastName": req.user.lastName,
                  "email": createLoan.rows[0].email,
                  "tenor": createLoan.rows[0].tenor,
                  "amount": createLoan.rows[0].amount,
                  "paymentInstallement": createLoan.rows[0].paymentinstallment,
                  "status": createLoan.rows[0].status,
                  "balance": createLoan.rows[0].balance,
                  "interest": createLoan.rows[0].interest
                }
              }));

            case 25:
              statusMessageFunction(res, 400, "Oops!! You have unpaid Loan of ## ".concat(haveApplyLoan.rows[0].balance, " ## applied on ").concat(haveApplyLoan.rows[0].created_on, " , Please repay the loan!"));
              _context.next = 29;
              break;

            case 28:
              statusMessageFunction(res, 400, 'Sorry! Your are not yet verified, Please contact Admin !');

            case 29:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  allLoans: function allLoans(req, res) {
    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var reqLoanStatus, reqLoanRepaid, reqLoans, _ref3, rows;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(req.user.isadmin === true)) {
                _context2.next = 23;
                break;
              }

              _context2.prev = 1;
              reqLoanStatus = req.query.status;
              reqLoanRepaid = req.query.repaid; // Get all loans according to the loan status and loan repayment

              _context2.next = 6;
              return _dbCon["default"].query(_queries["default"].getRepaidLoans, [reqLoanStatus, reqLoanRepaid]);

            case 6:
              reqLoans = _context2.sent;

              if (!(reqLoans.rows.length !== 0)) {
                _context2.next = 9;
                break;
              }

              return _context2.abrupt("return", res.status(200).json({
                status: loanStatus.succcessStatus,
                data: reqLoans.rows
              }));

            case 9:
              _context2.next = 11;
              return _dbCon["default"].query(_queries["default"].getAllLoans);

            case 11:
              _ref3 = _context2.sent;
              rows = _ref3.rows;

              if (!(reqLoanStatus == null && reqLoanRepaid == null && rows.length !== 0)) {
                _context2.next = 15;
                break;
              }

              return _context2.abrupt("return", res.status(200).json({
                status: loanStatus.succcessStatus,
                message: 'message',
                data: rows
              }));

            case 15:
              return _context2.abrupt("return", res.status(404).send({
                status: loanStatus.notFoundStatus,
                error: 'No loan Found !'
              }));

            case 18:
              _context2.prev = 18;
              _context2.t0 = _context2["catch"](1);
              res.status(500).json({
                status: 500,
                error: 'Internal Server Error'
              });

            case 21:
              _context2.next = 24;
              break;

            case 23:
              statusMessageFunction(res, 400, "".concat(loanStatus.badRequestMessage));

            case 24:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 18]]);
    }))();
  },
  specificLoan: function specificLoan(req, res) {
    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var id, findLoan;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(req.user.isadmin === true)) {
                _context3.next = 10;
                break;
              }

              id = req.params.id;
              _context3.next = 4;
              return _dbCon["default"].query(_queries["default"].fetchOneLoan, [parseInt(id)]);

            case 4:
              findLoan = _context3.sent;

              if (findLoan.rows[0]) {
                _context3.next = 7;
                break;
              }

              return _context3.abrupt("return", res.status(404).json({
                status: 404,
                error: "Loan with ## ".concat(id, " ## not Found! ")
              }));

            case 7:
              return _context3.abrupt("return", res.status(200).send({
                status: 200,
                data: findLoan.rows[0]
              }));

            case 10:
              statusMessageFunction(res, 400, "".concat(loanStatus.badRequestMessage));

            case 11:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }))();
  },
  approveLoan: function approveLoan(req, res) {
    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      var _validate$validateApp, _error, _arrErrors, allValdatorFunct, id, findLoan, aproveData, loanUpdate;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!(req.user.isadmin === true)) {
                _context4.next = 31;
                break;
              }

              _validate$validateApp = _loanHelper["default"].validateApproveLoan(req.body), _error = _validate$validateApp.error;
              _arrErrors = [];

              allValdatorFunct = function allValdatorFunct() {
                for (var i = 0; i < _error.details.length; i++) {
                  _arrErrors.push(_error.details[i].message);
                }
              };

              if (!_error) {
                _context4.next = 10;
                break;
              }

              "".concat(allValdatorFunct());

              if (!_error) {
                _context4.next = 8;
                break;
              }

              return _context4.abrupt("return", res.status(400).json({
                status: 400,
                errors: _arrErrors
              }));

            case 8:
              _context4.next = 29;
              break;

            case 10:
              _context4.prev = 10;
              id = req.params.id;
              _context4.next = 14;
              return _dbCon["default"].query(_queries["default"].fetchOneLoan, [parseInt(id)]);

            case 14:
              findLoan = _context4.sent;

              if (findLoan.rows[0]) {
                _context4.next = 17;
                break;
              }

              return _context4.abrupt("return", res.status(404).json({
                status: 404,
                error: "Loan with ".concat(id, " not Found! ")
              }));

            case 17:
              if (!(findLoan.rows[0].status === 'approved')) {
                _context4.next = 19;
                break;
              }

              return _context4.abrupt("return", res.status(loanStatus.badRequestStatus).json({
                status: loanStatus.badRequestStatus,
                error: "Loan Application Already Up-to-date(Approved)!"
              }));

            case 19:
              aproveData = {
                status: req.body.status,
                id: id
              };
              _context4.next = 22;
              return _dbCon["default"].query(_queries["default"].updateLoan, [aproveData.id, aproveData.status]);

            case 22:
              loanUpdate = _context4.sent;
              return _context4.abrupt("return", res.status(200).send({
                status: 200,
                message: "Loan with ".concat(id, " Approved! "),
                data: {
                  loanId: loanUpdate.rows[0].id,
                  loanAmount: loanUpdate.rows[0].amount,
                  tenor: loanUpdate.rows[0].tenor,
                  status: loanUpdate.rows[0].status,
                  monthlyInstallment: loanUpdate.rows[0].paymentInstallment,
                  interest: loanUpdate.rows[0].interest
                }
              }));

            case 26:
              _context4.prev = 26;
              _context4.t0 = _context4["catch"](10);
              res.status(500).json({
                status: 500,
                error: 'Internal Server Error'
              });

            case 29:
              _context4.next = 32;
              break;

            case 31:
              statusMessageFunction(res, 400, "".concat(loanStatus.badRequestMessage));

            case 32:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[10, 26]]);
    }))();
  },
  repayLoan: function repayLoan(req, res) {
    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee5() {
      var _validate$validateRep, _error2, id, findLoan, theAmount, theDiffrence, weOfferYou, repayment, newBalance, newLoanUpdate, createRepayment, _newLoanUpdate, _createRepayment;

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!(req.user.isadmin === true)) {
                _context5.next = 41;
                break;
              }

              _validate$validateRep = _loanHelper["default"].validateRepayment(req.body), _error2 = _validate$validateRep.error;

              if (!_error2) {
                _context5.next = 4;
                break;
              }

              return _context5.abrupt("return", res.status(400).json({
                status: 400,
                error: _error2.details[0].message
              }));

            case 4:
              id = req.params.id;
              _context5.next = 7;
              return _dbCon["default"].query(_queries["default"].fetchOneLoan, [id]);

            case 7:
              findLoan = _context5.sent;

              if (findLoan.rows[0]) {
                _context5.next = 10;
                break;
              }

              return _context5.abrupt("return", res.status(404).json({
                status: 404,
                error: "Loan application with ".concat(id, " not Found! ")
              }));

            case 10:
              theAmount = parseFloat(req.body.amount);
              theDiffrence = theAmount - findLoan.rows[0].balance;

              weOfferYou = function weOfferYou() {
                return theDiffrence;
              };

              repayment = {
                created_on: new Date(),
                loanId: findLoan.rows[0].id,
                amount: theAmount,
                monthlypayment: findLoan.rows[0].paymentinstallment,
                balance: findLoan.rows[0].balance
              };

              if (!(findLoan.rows[0].status === 'pending' || findLoan.rows[0].status === 'rejected')) {
                _context5.next = 16;
                break;
              }

              return _context5.abrupt("return", res.status(404).json({
                status: 404,
                error: "Oops Nothing to repay! Your Loan Application on [ ".concat(findLoan.rows[0].created_on, " ] for [ ").concat(findLoan.rows[0].amount, " ] still Pending or rejected!")
              }));

            case 16:
              if (!(findLoan.rows[0].balance === '0')) {
                _context5.next = 20;
                break;
              }

              statusMessageFunction(res, 400, "Oops Nothing to repay, You have paid all your loan balance, Fill free to apply another loan!");
              _context5.next = 39;
              break;

            case 20:
              if (!(repayment.amount >= parseFloat(findLoan.rows[0].balance))) {
                _context5.next = 31;
                break;
              }

              newBalance = {
                balance: '0',
                repaid: "true"
              };
              _context5.next = 24;
              return _dbCon["default"].query(_queries["default"].updateLoanAfterHighRepayment, [findLoan.rows[0].id, newBalance.balance, newBalance.repaid]);

            case 24:
              newLoanUpdate = _context5.sent;
              _context5.next = 27;
              return _dbCon["default"].query(_queries["default"].insertRepayment, [findLoan.rows[0].id, repayment.amount, repayment.monthlypayment, newLoanUpdate.rows[0].balance, repayment.created_on]);

            case 27:
              createRepayment = _context5.sent;
              return _context5.abrupt("return", res.status(201).json({
                status: 201,
                message: "Repayment Created Successfully and You repay over-Amount! We of offer you [ ".concat(weOfferYou(), " ]"),
                data: {
                  id: createRepayment.rows[0].id,
                  loanId: createRepayment.rows[0].loanid,
                  CreatedOn: createRepayment.rows[0].created_on,
                  amount: newLoanUpdate.rows[0].amount,
                  monthlyInstallment: newLoanUpdate.rows[0].monthlypayment,
                  paidAmount: createRepayment.rows[0].amount,
                  balance: createRepayment.rows[0].balance
                }
              }));

            case 31:
              findLoan.rows[0].balance = findLoan.rows[0].balance - theAmount;
              _context5.next = 34;
              return _dbCon["default"].query(_queries["default"].updateLoanAfterLowRepayment, [findLoan.rows[0].id, findLoan.rows[0].balance]);

            case 34:
              _newLoanUpdate = _context5.sent;
              _context5.next = 37;
              return _dbCon["default"].query(_queries["default"].insertRepayment, [findLoan.rows[0].id, repayment.amount, repayment.monthlypayment, _newLoanUpdate.rows[0].balance, repayment.created_on]);

            case 37:
              _createRepayment = _context5.sent;
              return _context5.abrupt("return", res.status(201).json({
                status: 201,
                message: "Repayment Created Successfully!",
                data: {
                  id: _createRepayment.rows[0].id,
                  loanId: _createRepayment.rows[0].loanid,
                  CreatedOn: _createRepayment.rows[0].created_on,
                  amount: _newLoanUpdate.rows[0].amount,
                  monthlyInstallment: _newLoanUpdate.rows[0].monthlypayment,
                  paidAmount: _createRepayment.rows[0].amount,
                  balance: _createRepayment.rows[0].balance
                }
              }));

            case 39:
              _context5.next = 42;
              break;

            case 41:
              statusMessageFunction(res, 400, "".concat(loanStatus.badRequestMessage));

            case 42:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }))();
  },
  allRepaymentLoan: function allRepaymentLoan(req, res) {
    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6() {
      var _ref8, rows;

      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return _dbCon["default"].query(_queries["default"].getAllRepayments);

            case 3:
              _ref8 = _context6.sent;
              rows = _ref8.rows;

              if (rows.length) {
                _context6.next = 7;
                break;
              }

              return _context6.abrupt("return", res.status(404).send({
                status: 404,
                error: 'No loan repayment created !'
              }));

            case 7:
              return _context6.abrupt("return", res.status(200).send({
                status: 200,
                data: rows
              }));

            case 10:
              _context6.prev = 10;
              _context6.t0 = _context6["catch"](0);
              res.status(500).json({
                status: 500,
                error: 'Internal Server Error'
              });

            case 13:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[0, 10]]);
    }))();
  },
  specificLoanRepayment: function specificLoanRepayment(req, res) {
    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee7() {
      var id, findLoanRepayment;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              if (!(req.user.isadmin === true)) {
                _context7.next = 16;
                break;
              }

              _context7.prev = 1;
              id = req.params.id;
              _context7.next = 5;
              return _dbCon["default"].query(_queries["default"].fetchOneRepayment, [id]);

            case 5:
              findLoanRepayment = _context7.sent;

              if (findLoanRepayment.rows[0]) {
                _context7.next = 8;
                break;
              }

              return _context7.abrupt("return", res.status(404).json({
                status: 404,
                error: "Loan Repayment application with ".concat(id, " not Found! ")
              }));

            case 8:
              return _context7.abrupt("return", res.status(200).send({
                status: 200,
                data: findLoanRepayment.rows[0]
              }));

            case 11:
              _context7.prev = 11;
              _context7.t0 = _context7["catch"](1);
              res.status(500).json({
                status: 500,
                error: 'Internal Server Error'
              });

            case 14:
              _context7.next = 17;
              break;

            case 16:
              statusMessageFunction(res, 400, "".concat(loanStatus.badRequestMessage));

            case 17:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, null, [[1, 11]]);
    }))();
  }
};
var _default = loanController;
exports["default"] = _default;