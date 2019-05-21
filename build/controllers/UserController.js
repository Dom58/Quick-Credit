"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _userHelper = _interopRequireDefault(require("../helpers/userHelper"));

var _dbCon = _interopRequireDefault(require("../models/dbCon"));

var _queries = _interopRequireDefault(require("../models/queries"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

_dotenv["default"].config();

var theStatus = {
  badRequestStatus: 400,
  succcessStatus: 200,
  unAuthorizedStatus: 401,
  notFoundStatus: 404,
  badRequestMessage: "You dont have the right for this activity!"
};

var statusMessageFunction = function statusMessageFunction(res, status, message) {
  return res.status(status).json({
    status: status,
    message: message
  });
};

var userController = {
  signup: function signup(req, res) {
    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var _validate$validateSig, error, arrErrors, allValdatorFunct, findUser, adminData, _payload, createAdmin, userData, payload, createUser;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _validate$validateSig = _userHelper["default"].validateSignup(req.body), error = _validate$validateSig.error;
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

              return _context.abrupt("return", res.status(theStatus.badRequestStatus).json({
                status: theStatus.badRequestStatus,
                errors: arrErrors
              }));

            case 7:
              _context.next = 33;
              break;

            case 9:
              _context.prev = 9;
              _context.next = 12;
              return _dbCon["default"].query(_queries["default"].fetchOneUser, [req.body.email]);

            case 12:
              findUser = _context.sent;

              if (!findUser.rows[0]) {
                _context.next = 15;
                break;
              }

              return _context.abrupt("return", res.status(409).json({
                status: 409,
                error: 'Email already registered!'
              }));

            case 15:
              if (!(req.body.isadmin === "true")) {
                _context.next = 22;
                break;
              }

              adminData = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                address: 'Kigali/Gasabo',
                status: 'verified',
                isadmin: req.body.isadmin,
                password: _bcrypt["default"].hashSync(req.body.password, 10),
                created_on: new Date()
              };
              _payload = _jsonwebtoken["default"].sign(adminData, "".concat(process.env.SECRET_KEY_CODE), {
                expiresIn: '24h'
              });
              _context.next = 20;
              return _dbCon["default"].query(_queries["default"].insertAdminAccount, [adminData.firstname, adminData.lastname, adminData.email, adminData.address, adminData.status, adminData.isadmin, adminData.password, adminData.created_on]);

            case 20:
              createAdmin = _context.sent;
              return _context.abrupt("return", res.status(201).json({
                status: 201,
                message: 'Admin Created successfully',
                data: {
                  token: _payload,
                  id: createAdmin.rows[0].id,
                  firstName: createAdmin.rows[0].firstname,
                  lastName: createAdmin.rows[0].lastname,
                  email: createAdmin.rows[0].email
                }
              }));

            case 22:
              userData = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                address: req.body.address,
                status: 'unverified',
                isadmin: 'false',
                password: _bcrypt["default"].hashSync(req.body.password, 10),
                created_on: new Date()
              };
              payload = _jsonwebtoken["default"].sign(userData, "".concat(process.env.SECRET_KEY_CODE), {
                expiresIn: '24h'
              });
              _context.next = 26;
              return _dbCon["default"].query(_queries["default"].insertUser, [userData.firstname, userData.lastname, userData.email, userData.address, userData.status, userData.isadmin, userData.password, userData.created_on]);

            case 26:
              createUser = _context.sent;
              return _context.abrupt("return", res.status(201).json({
                status: 201,
                message: 'User Created successfully',
                data: {
                  token: payload,
                  id: createUser.rows[0].id,
                  firstName: createUser.rows[0].firstname,
                  lastName: createUser.rows[0].lastname,
                  email: createUser.rows[0].email
                }
              }));

            case 30:
              _context.prev = 30;
              _context.t0 = _context["catch"](9);
              res.status(500).json({
                status: 500,
                error: 'Internal Server Error'
              });

            case 33:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[9, 30]]);
    }))();
  },
  signin: function signin(req, res) {
    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var _validate$validateLog, error, arrErrors, allValdatorFunct, findUser, comparePassword, userDetails, payload;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _validate$validateLog = _userHelper["default"].validateLogin(req.body), error = _validate$validateLog.error;
              arrErrors = [];

              allValdatorFunct = function allValdatorFunct() {
                for (var i = 0; i < error.details.length; i++) {
                  arrErrors.push(error.details[i].message);
                }
              };

              if (!error) {
                _context2.next = 9;
                break;
              }

              "".concat(allValdatorFunct());

              if (!error) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt("return", res.status(theStatus.badRequestStatus).json({
                status: theStatus.badRequestStatus,
                errors: arrErrors
              }));

            case 7:
              _context2.next = 26;
              break;

            case 9:
              _context2.prev = 9;
              _context2.next = 12;
              return _dbCon["default"].query(_queries["default"].fetchOneUser, [req.body.email]);

            case 12:
              findUser = _context2.sent;

              if (findUser.rows[0]) {
                _context2.next = 15;
                break;
              }

              return _context2.abrupt("return", res.status(theStatus.unAuthorizedStatus).json({
                status: theStatus.unAuthorizedStatus,
                error: 'Incorrect Email'
              }));

            case 15:
              comparePassword = _bcrypt["default"].compareSync(req.body.password, findUser.rows[0].password);

              if (comparePassword) {
                _context2.next = 18;
                break;
              }

              return _context2.abrupt("return", res.status(theStatus.unAuthorizedStatus).json({
                status: theStatus.unAuthorizedStatus,
                error: 'Incorrect Password'
              }));

            case 18:
              userDetails = {
                id: findUser.rows[0].id,
                firstName: findUser.rows[0].firstname,
                lastName: findUser.rows[0].lastname,
                email: findUser.rows[0].email,
                status: findUser.rows[0].status,
                isadmin: findUser.rows[0].isadmin
              }; // console.log(userDetails);

              payload = _jsonwebtoken["default"].sign(userDetails, "".concat(process.env.SECRET_KEY_CODE), {
                expiresIn: '24h'
              });
              return _context2.abrupt("return", res.status(200).json({
                status: 200,
                message: 'You are signed in!',
                data: {
                  token: payload,
                  id: findUser.rows[0].id,
                  firstName: findUser.rows[0].firstname,
                  lastName: findUser.rows[0].lastname,
                  email: findUser.rows[0].email
                }
              }));

            case 23:
              _context2.prev = 23;
              _context2.t0 = _context2["catch"](9);
              res.status(500).json({
                status: 500,
                error: 'Internal Server Error'
              });

            case 26:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[9, 23]]);
    }))();
  },
  verifyUser: function verifyUser(req, res) {
    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var _validate$validateApp, _error, _arrErrors, allValdatorFunct, email, findUser, verifyUser, updateUserQuery;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(req.user.isadmin === true)) {
                _context3.next = 29;
                break;
              }

              _validate$validateApp = _userHelper["default"].validateApplication(req.body), _error = _validate$validateApp.error;
              _arrErrors = [];

              allValdatorFunct = function allValdatorFunct() {
                for (var i = 0; i < _error.details.length; i++) {
                  _arrErrors.push(_error.details[i].message);
                }
              };

              if (!_error) {
                _context3.next = 10;
                break;
              }

              "".concat(allValdatorFunct());

              if (!_error) {
                _context3.next = 8;
                break;
              }

              return _context3.abrupt("return", res.status(theStatus.badRequestStatus).json({
                status: theStatus.badRequestStatus,
                errors: _arrErrors
              }));

            case 8:
              _context3.next = 29;
              break;

            case 10:
              _context3.prev = 10;
              email = req.params.email;
              _context3.next = 14;
              return _dbCon["default"].query(_queries["default"].fetchOneUser, [email]);

            case 14:
              findUser = _context3.sent;

              if (findUser.rows[0]) {
                _context3.next = 17;
                break;
              }

              return _context3.abrupt("return", res.status(theStatus.notFoundStatus).json({
                status: theStatus.notFoundStatus,
                message: 'Email not found!'
              }));

            case 17:
              if (!(findUser.rows[0].status === 'verified')) {
                _context3.next = 19;
                break;
              }

              return _context3.abrupt("return", res.status(theStatus.badRequestStatus).json({
                status: theStatus.badRequestStatus,
                message: 'User account Already Up-to-date!'
              }));

            case 19:
              verifyUser = {
                status: req.body.status
              };
              _context3.next = 22;
              return _dbCon["default"].query(_queries["default"].updateUser, [email, verifyUser.status]);

            case 22:
              updateUserQuery = _context3.sent;
              return _context3.abrupt("return", res.status(200).json({
                status: 200,
                message: 'User account updated',
                data: {
                  email: updateUserQuery.rows[0].email,
                  firstName: updateUserQuery.rows[0].firstname,
                  lastName: updateUserQuery.rows[0].lastname,
                  password: updateUserQuery.rows[0].password,
                  address: updateUserQuery.rows[0].address,
                  status: updateUserQuery.rows[0].status
                }
              }));

            case 26:
              _context3.prev = 26;
              _context3.t0 = _context3["catch"](10);
              res.status(500).json({
                status: 500,
                error: 'Internal Server Error'
              });

            case 29:
              return _context3.abrupt("return", res.status(theStatus.badRequestStatus).json({
                status: theStatus.badRequestStatus,
                error: theStatus.badRequestMessage
              }));

            case 30:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[10, 26]]);
    }))();
  },
  allUsers: function allUsers(req, res) {
    return _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      var _ref5, rows;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!(req.user.isadmin === true)) {
                _context4.next = 14;
                break;
              }

              _context4.prev = 1;
              _context4.next = 4;
              return _dbCon["default"].query(_queries["default"].getAllUsers);

            case 4:
              _ref5 = _context4.sent;
              rows = _ref5.rows;

              if (!(rows.length === 0)) {
                _context4.next = 8;
                break;
              }

              return _context4.abrupt("return", res.status(theStatus.notFoundStatus).json({
                status: theStatus.notFoundStatus,
                message: 'No user created!'
              }));

            case 8:
              return _context4.abrupt("return", res.status(200).send({
                status: 200,
                data: rows
              }));

            case 11:
              _context4.prev = 11;
              _context4.t0 = _context4["catch"](1);
              res.status(500).json({
                status: 500,
                error: 'Internal Server Error'
              });

            case 14:
              return _context4.abrupt("return", res.status(theStatus.badRequestStatus).json({
                status: theStatus.badRequestStatus,
                error: theStatus.badRequestMessage
              }));

            case 15:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[1, 11]]);
    }))();
  }
};
var _default = userController;
exports["default"] = _default;