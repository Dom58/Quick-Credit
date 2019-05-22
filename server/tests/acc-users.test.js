import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import server from '../app.js'

dotenv.config();

const { expect } = chai;
chai.use(chaiHttp);

describe('signup', () => {
  let app = server
  beforeEach(()=>{

  })
  const userDemo = {
    id: 1,
    firstname: 'admin',
    lastname: 'admin58',
    email: 'superadmin@gmail.com',
    status: 'verified',
    isadmin: true,
    password: 'zxasqw58'
  }
  const token = jwt.sign(userDemo, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });

  it('should not create a user because all field are required', () =>{
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send({
        firstname: ' ',
        lastname: ' ',
        email: '',
        password: '',
      })
      .end((err, res) => {
        console.log(res.body)
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });

  it('should not create user because email already registed', () =>{
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send({
        firstname: 'damascene',
        lastname: 'damas58',
        email: 'client@gmail.com',
        password: 'zxasqw58',
      })
      .end((err, res) => {
        console.log(res.body)
        expect(res.body.status).to.equal(409);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body).to.be.an('object');
      });
  });

  it('should not create user because email format is invalid', () =>{
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send({
        firstname: 'damascene',
        lastname: 'damas58',
        email: 'clientgmailcom',
        address: 'hdhh',
        isadmin: false,
        password: 'zxasqw58',
      })
      .end((err, res) => {
        console.log(res.body)
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });
});