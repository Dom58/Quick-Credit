import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import server from '../app.js'

dotenv.config();

const { expect } = chai;
chai.use(chaiHttp);

describe('Display loan applications', () => {
  const isadmin = {
    firstname: 'admin',
    lastname: 'admin58',
    email: 'admin@gmail.com',
    address: 'Nyamata/Rebero',
    status: 'verified',
    isadmin: true,
    password: 'zxasqw58',
  }
  const token = jwt.sign(isadmin, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });

  it('should not return loans beacuse no loans application created yet', () => {
    chai.request(server)
      .get('/api/v2/loans')
      .set('Authorization', token)
      .end((err, res) => {
        expect(res.body.status).to.equal(404);
        expect(res.body).to.have.property('error');
      });
  });
});

describe('Loan applications', () => {
  const isClient = {
    firstname: 'client',
    lastname: 'client58',
    email: 'clientz@gmail.com',
    address: 'Kigali/Gasabo',
    status: 'verified',
    isadmin: false,
    password: 'zxasqw58',
  }

  const token = jwt.sign(isClient, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });

  it('should not apply loan because amount must be a number', () => {
    chai.request(server)
      .post('/api/v2/loans')
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
      .post('/api/v2/loans')
      .set('Authorization', token)
      .send({
        amount: '59099',
        tenor: '12s'
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
      });
  });

  it('should not apply loan because tenor must between 1 and 12', () => {
    chai.request(server)
      .post('/api/v2/loans')
      .set('Authorization', token)
      .send({
        amount: '59099',
        tenor: '58'
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
      });
  });

  it('should create loan application', () => {
    chai.request(server)
      .post('/api/v2/loans')
      .set('Authorization', token)
      .send({
        amount: '10000',
        tenor: '12'
      })
      .end((err, res) => {
          console(res.body);
        expect(res.body.status).to.equal(201);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body).to.be.an('object');
      });
  });

describe('Repayment loan', () => {
  const isadmin = {
    firstname: 'admin',
    lastname: 'admin58',
    email: 'admin@gmail.com',
    address: 'Nyamata/Rebero',
    status: 'verified',
    isadmin: 'true',
    password: 'zxasqw58',
  }
  const token = jwt.sign(isadmin, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });
  it('should not accept others status rather than approved or rejected', () => {
    chai.request(server)
      .patch('/api/v2/loans/1')
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
  });
});

