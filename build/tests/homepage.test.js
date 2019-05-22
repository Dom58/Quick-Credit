"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _app = _interopRequireDefault(require("../app.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var expect = _chai["default"].expect;

_chai["default"].use(_chaiHttp["default"]);

describe('Homepage message', function () {
  it('should navigate index page', function () {
    _chai["default"].request(_app["default"]).get('/').end(function (err, res) {
      expect(res.body.status).to.equal(200);
    });
  });
});
