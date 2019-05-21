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

describe('Display loan applications', function () {
  var isadmin = {
    firstname: 'admin',
    lastname: 'admin58',
    email: 'admin@gmail.com',
    address: 'Nyamata/Rebero',
    status: 'verified',
    isadmin: true,
    password: 'zxasqw58'
  };

  var token = _jsonwebtoken["default"].sign(isadmin, "".concat(process.env.SECRET_KEY_CODE), {
    expiresIn: '24h'
  });

  it('should not return loans beacuse no loans application created yet', function () {
    _chai["default"].request(_app["default"]).get('/api/v2/loans').set('Authorization', token).end(function (err, res) {
      expect(res.body.status).to.equal(404);
      expect(res.body).to.have.property('error');
    });
  });
});
describe('Loan applications', function () {
  var isClient = {
    firstname: 'client',
    lastname: 'client58',
    email: 'clientz@gmail.com',
    address: 'Kigali/Gasabo',
    status: 'verified',
    isadmin: false,
    password: 'zxasqw58'
  };

  var token = _jsonwebtoken["default"].sign(isClient, "".concat(process.env.SECRET_KEY_CODE), {
    expiresIn: '24h'
  });

  it('should not apply loan because amount must be a number', function () {
    _chai["default"].request(_app["default"]).post('/api/v2/loans').set('Authorization', token).send({
      amount: '5909z',
      tenor: '12'
    }).end(function (err, res) {
      expect(res.body.status).to.equal(400);
      expect(res.body).to.have.property('status');
    });
  });
  it('should not apply loan because tenor should be a number', function () {
    _chai["default"].request(_app["default"]).post('/api/v2/loans').set('Authorization', token).send({
      amount: '59099',
      tenor: '12s'
    }).end(function (err, res) {
      expect(res.body.status).to.equal(400);
    });
  });
  it('should not apply loan because tenor must between 1 and 12', function () {
    _chai["default"].request(_app["default"]).post('/api/v2/loans').set('Authorization', token).send({
      amount: '59099',
      tenor: '58'
    }).end(function (err, res) {
      expect(res.body.status).to.equal(400);
    });
  }); //   it('should not apply loan because amount and tenor are required', () => {
  //     chai.request(server)
  //       .post('/api/v2/loans')
  //       .set('Authorization', token)
  //       .send({
  //         amount:"",
  //         tenor: ""
  //       })
  //       .end((err, res) => {
  //         expect(res.body.status).to.equal(400);
  //         expect(res.body).to.have.property('erros');
  //       });
  //   });

  it('should create loan application', function () {
    _chai["default"].request(_app["default"]).post('/api/v2/loans').set('Authorization', token).send({
      amount: '10000',
      tenor: '12'
    }).end(function (err, res) {
      console(res.body);
      expect(res.body.status).to.equal(201);
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('message');
      expect(res.body).to.be.an('object');
    });
  }); //   it('should not allowed to apply again a loan because you have unpaid loan', () => {
  //     chai.request(server)
  //       .post('/api/v2/loans')
  //       .set('Authorization', token)
  //       .send({
  //         amount: '10000',
  //         tenor: '12'
  //       })
  //       .end((err, res) => {
  //         expect(res.body.status).to.equal(400);
  //         expect(res.body).to.have.property('status');
  //         expect(res.body).to.have.property('message');
  //         expect(res.body).to.be.an('object');
  //       });
  //   });
  //   it('should not allowed to repay a loans, only admin', () => {
  //     chai.request(server)
  //       .post('/api/v2/loans/1/repayment')
  //       .set('Authorization', token)
  //       .end((err, res) => {
  //         expect(res.body.status).to.equal(400);
  //         expect(res.body).to.have.property('status');
  //         expect(res.body).to.be.an('object');
  //       });
  //   });
  // });

  describe('Repayment loan', function () {
    var isadmin = {
      firstname: 'admin',
      lastname: 'admin58',
      email: 'admin@gmail.com',
      address: 'Nyamata/Rebero',
      status: 'verified',
      isadmin: 'true',
      password: 'zxasqw58'
    };

    var token = _jsonwebtoken["default"].sign(isadmin, "".concat(process.env.SECRET_KEY_CODE), {
      expiresIn: '24h'
    });

    it('should not accept others status rather than approved or rejected', function () {
      _chai["default"].request(_app["default"]).patch('/api/v2/loans/1').set('Authorization', token).send({
        status: 'not-approved'
      }).end(function (err, res) {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
    }); //   it('should not found loan application id', () => {
    //     chai.request(server)
    //       .patch('/api/v2/loans/2')
    //       .set('Authorization', token)
    //       .send({
    //         status: 'approved'
    //       })
    //       .end((err, res) => {
    //         expect(res.body.status).to.equal(404);
    //         expect(res.body).to.have.property('status');
    //         expect(res.body).to.be.an('object');
    //       });
    //   });
    //   it('should not repay loan because it is pending or rejected', () => {
    //     chai.request(server)
    //       .post('/api/v2/loans/1/repayment')
    //       .set('Authorization', token)
    //       .send({
    //         amount: '500000'
    //       })
    //       .end((err, res) => {
    //         expect(res.body.status).to.equal(400);
    //         expect(res.body).to.have.property('status');
    //         expect(res.body).to.be.an('object');
    //       });
    //   });
    //   it('should approve loan application', () => {
    //     chai.request(server)
    //       .patch('/api/v2/loans/1')
    //       .set('Authorization', token)
    //       .send({
    //         status: 'approved'
    //       })
    //       .end((err, res) => {
    //         expect(res.body.status).to.equal(200);
    //         expect(res.body).to.have.property('status');
    //         expect(res.body).to.be.an('object');
    //       });
    //   });
    //   it('should not approve loan application because it is up-to-date', () => {
    //     chai.request(server)
    //       .patch('/api/v2/loans/1')
    //       .set('Authorization', token)
    //       .send({
    //         status: 'approved'
    //       })
    //       .end((err, res) => {;
    //         expect(res.body.status).to.equal(400);
    //         expect(res.body).to.have.property('status');
    //         expect(res.body).to.be.an('object');
    //       });
    //   });
    //   it('should return all loan application', () => {
    //     chai.request(server)
    //       .get('/api/v2/loans')
    //       .set('Authorization', token)
    //       .end((err, res) => {
    //         expect(res.body.status).to.equal(200);
    //         expect(res.body).to.have.property('status');
    //         expect(res.body).to.be.an('object');
    //       });
    //   });
    //   it('should not repay loan because loan id not found ', () => {
    //     chai.request(server)
    //       .post('/api/v2/loans/6/repayment')
    //       .set('Authorization', token)
    //       .send({
    //         amount: '5000'
    //       })
    //       .end((err, res) => {
    //         expect(res.body.status).to.equal(404);
    //         expect(res.body).to.have.property('status');
    //         expect(res.body).to.be.an('object');
    //       });
    //   });
    //   it('should now repay loan application', () => {
    //     chai.request(server)
    //       .post('/api/v2/loans/1/repayment')
    //       .set('Authorization', token)
    //       .send({
    //         amount: '5000'
    //       })
    //       .end((err, res) => {
    //         expect(res.body.status).to.equal(201);
    //         expect(res.body).to.have.property('status');
    //         expect(res.body).to.have.property('message');
    //         expect(res.body).to.be.an('object');
    //       });
    //   });
    //   it('should create a repayment loan even if the amount are greater than responsibility ', () => {
    //     chai.request(server)
    //       .post('/api/v2/loans/1/repayment')
    //       .set('Authorization', token)
    //       .send({
    //         amount: '500000'
    //       })
    //       .end((err, res) => {
    //         expect(res.body.status).to.equal(201);
    //         expect(res.body).to.have.property('status');
    //         expect(res.body).to.have.property('message');
    //         expect(res.body).to.be.an('object');
    //       });
    //   });
    //   it('should not repay loan because no loan you have', () => {
    //     chai.request(server)
    //       .post('/api/v2/loans/1/repayment')
    //       .set('Authorization', token)
    //       .send({
    //         amount: '500000'
    //       })
    //       .end((err, res) => {
    //         expect(res.body.status).to.equal(400);
    //         expect(res.body).to.have.property('status');
    //         expect(res.body).to.be.an('object');
    //       });
    //   });
    //   it('should return all repayment history', () => {
    //     chai.request(server)
    //       .get('/api/v2/repayments/loans')
    //       .set('Authorization', token)
    //       .end((err, res) => {
    //         expect(res.body.status).to.equal(200);
    //         expect(res.body).to.have.property('status');
    //         expect(res.body).to.be.an('object');
    //       });
  });
});