import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import server from '../app.js'

dotenv.config();

const { expect } = chai;
chai.use(chaiHttp);

describe('Display loan applications', () => {
  const isAdmin = {
    firstName: 'admin',
    lastName: 'admin58',
    email: 'admin@gmail.com',
    address: 'Nyamata/Rebero',
    status: 'verified',
    isAdmin: 'true',
    password: 'zxasqw58',
  }
  const token = jwt.sign(isAdmin, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });

  it('should not return loans beacuse no loans application created yet', () => {
    chai.request(server)
      .get('/api/v1/loans')
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.body.status).to.equal(404);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body).to.be.an('object');
      });
  });
});


describe('Loan applications', () => {
  const isClient = {
    firstName: 'client',
    lastName: 'client58',
    email: 'client@gmail.com',
    address: 'Kigali/Gasabo',
    status: 'verified',
    isAdmin: 'false',
    password: 'zxasqw58',
  }

  const token = jwt.sign(isClient, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });

  it('should not apply loan because amount must be a number', () => {
    chai.request(server)
      .post('/api/v1/loans')
      .set('Authorization', token)
      .send({
        amount: '5909z',
        tenor: '12'
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
      });
  });

  it('should not apply loan because tenor should be a number', () => {
    chai.request(server)
      .post('/api/v1/loans')
      .set('Authorization', token)
      .send({
        amount: '59099',
        tenor: '12s'
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
      });
  });

  it('should not apply loan because tenor must between 1 and 12', () => {
    chai.request(server)
      .post('/api/v1/loans')
      .set('Authorization', token)
      .send({
        amount: '59099',
        tenor: '58'
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
      });
  });

  it('should not apply loan because amount and tenor are required', () => {
    chai.request(server)
      .post('/api/v1/loans')
      .set('Authorization', token)
      .send({
        amount: '',
        tenor: ''
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
      });
  });

  it('should create loan application', () => {
    chai.request(server)
      .post('/api/v1/loans')
      .set('Authorization', token)
      .send({
        amount: '10000',
        tenor: '12'
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(201);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body).to.be.an('object');
      });
  });

  it('should not allowed to apply again a loan because you have unpaid loan', () => {
    chai.request(server)
      .post('/api/v1/loans')
      .set('Authorization', token)
      .send({
        amount: '10000',
        tenor: '12'
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body).to.be.an('object');
      });
  });
  it('should not allowed to repay a loans, only admin', () => {
    chai.request(server)
      .post('/api/v1/loans/1/repayment')
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });
});

describe('Repayment loan', () => {
  const isAdmin = {
    firstName: 'admin',
    lastName: 'admin58',
    email: 'admin@gmail.com',
    address: 'Nyamata/Rebero',
    status: 'verified',
    isAdmin: 'true',
    password: 'zxasqw58',
  }
  const token = jwt.sign(isAdmin, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });
  it('should not accept others status rather than approved or rejected', () => {
    chai.request(server)
      .patch('/api/v1/loans/1')
      .set('Authorization', token)
      .send({
        status: 'not-approved'
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });
  it('should not found loan application id', () => {
    chai.request(server)
      .patch('/api/v1/loans/2')
      .set('Authorization', token)
      .send({
        status: 'approved'
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(404);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });
  it('should not repay loan because it is pending or rejected', () => {
    chai.request(server)
      .post('/api/v1/loans/1/repayment')
      .set('Authorization', token)
      .send({
        amount: '500000'
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });
  it('should approve loan application', () => {
    chai.request(server)
      .patch('/api/v1/loans/1')
      .set('Authorization', token)
      .send({
        status: 'approved'
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });
  it('should not approve loan application because it is up-to-date', () => {
    chai.request(server)
      .patch('/api/v1/loans/1')
      .set('Authorization', token)
      .send({
        status: 'approved'
      })
      .end((err, res) => {;
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });
  it('should return all loan application', () => {
    chai.request(server)
      .get('/api/v1/loans')
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });
  it('should not repay loan because loan id not found ', () => {
    chai.request(server)
      .post('/api/v1/loans/6/repayment')
      .set('Authorization', token)
      .send({
        amount: '5000'
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(404);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });
  it('should now repay loan application', () => {
    chai.request(server)
      .post('/api/v1/loans/1/repayment')
      .set('Authorization', token)
      .send({
        amount: '5000'
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(201);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body).to.be.an('object');
      });
  });
  it('should create a repayment loan even if the amount are greater than responsibility ', () => {
    chai.request(server)
      .post('/api/v1/loans/1/repayment')
      .set('Authorization', token)
      .send({
        amount: '500000'
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(201);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body).to.be.an('object');
      });
  });
  it('should not repay loan because no loan you have', () => {
    chai.request(server)
      .post('/api/v1/loans/1/repayment')
      .set('Authorization', token)
      .send({
        amount: '500000'
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });
  it('should return all repayment history', () => {
    chai.request(server)
      .get('/api/v1/repayments/loans')
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });
});
