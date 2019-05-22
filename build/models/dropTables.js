"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _dbCon = _interopRequireDefault(require("./dbCon"));

var _queries = _interopRequireDefault(require("./queries"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var dropTables =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _dbCon["default"].query(_queries["default"].dropTables);

          case 2:
            console.log('Three Tables (users, loans,repayment) tables. Deleted Successfully !!');

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function dropTables() {
    return _ref.apply(this, arguments);
  };
}();

_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee2() {
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _dbCon["default"].query(dropTables);

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
}))()["catch"](function (error) {
  return console.log(error);
});

var _default = dropTables;
exports["default"] = _default;