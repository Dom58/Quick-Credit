import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import server from '../app.js';
import pool from '../models/dbCon';
import emptyTables from '../models/emptytables';
import CreateTable from '../models/queries'

dotenv.config();

const { expect } = chai;
chai.use(chaiHttp);

describe('signup', () => {
  let app = server
  beforeEach(()=>{
    const adminData = {
      firstname: 'admin',
      lastname: 'admin58',
      email: 'superadmin@gmail.com',
      status: 'verified',
      address: 'Kigali',
      isadmin: true,
      password: 'domdom58',
      created_on: new Date(),
    }
    const token = jwt.sign(adminData, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });
    const createAdminRow = async () => {
      let createAdmin = await pool.query(CreateTable.insertAdminAccount, [adminData.firstname, adminData.lastname,adminData.email,adminData.address,adminData.status,adminData.isadmin, adminData.password, adminData.created_on]);
    };
    
    (async () => {
      await pool.query(createAdminRow);
    })().catch(error =>console.log(error))
  })
  
  it('should create admin account', () =>{
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send({
        firstname: 'admin',
        lastname: 'admin58',
        email: 'admin@gmail.com',
        address: 'kigali',
        isadmin: true,
        password: 'zxasqw58',
      })
      .end((err, res) => {
        console.log(token)
        expect(res.body.status).to.equal(201);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        expect(res.body).to.be.an('object');
      });
  });

  it('should create admin account', () =>{
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send({
        firstname: 'admin',
        lastname: 'admin58',
        email: 'admingmail.com',
        address: 'kigali',
        isadmin: 'true',
        password: 'xxxxxxz',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('errors');
        expect(res.body).to.be.an('object');
      });
  });

  it('should create client account', () =>{
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send({
        firstname: 'client',
        lastname: 'client58',
        email: 'client@gmail.com',
        address: 'Kigali/Gasabo',
        isadmin: 'false',
        password: 'zxasqw58',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(201);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        expect(res.body).to.be.an('object');
      });
  });

  it('should not create a user because all field are required', () =>{
    chai.request(server)
      .post('/api/v2/auth/signup')
      .send({
        firstname:'',
        lastname:'',
        address:'',
        isadmin:'',
        email:'',
        password:'',
      })
      .end((err, res) => {
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
        expect(res.body.status).to.equal(409);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body).to.be.an('object');
      });
  });

});

describe('signin', () => {

  it('should not signin because email and password are required', () => {
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send({
        email: '',
        password: '',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });
  it('should not signin because password must be valid', () => {
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send({
        email: 'superadmin@gmail.com',
        password: 'nn',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });

  it('should not signin because password is incorrect', () => {
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send({
        email: 'admin@gmail.com',
        password: 'zxcvzxc',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(401);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body).to.be.an('object');
      });
  });

  it('should not signin because email is not valid', () => {
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send({
        email: 'adminzz@gmail.com',
        password: 'zxasqw58',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(401);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body).to.be.an('object');
      });
  });

  it('should signin in quick credit web application', () => {
    const user = {
      email: 'superadmin@gmail.com',
      password: 'domdom58',
    };
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send(user)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        expect(res.body).to.be.an('object');
      });
  });
  it('should return an error because there are the field which is not requred', () => {
    const user = {
      emails:'superadmin@gmail.com',
      emailss:'superadmin@gmail.com',
      passwords: 'domdom58',
    };
    chai.request(server)
      .post('/api/v2/auth/signin')
      .send(user)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('errors');
        expect(res.body).to.be.an('object');
      });
  });
});




describe('Users', () => {
  it('should not allowed to view all users because token required', () => {
    chai.request(server)
      .get('/api/v2/auth/users')
      .end((err, res) => {
        expect(res.body.status).to.equal(403);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });

  const userDemo = {
    id: 1,
    firstname: 'admin',
    lastname: 'admin58',
    email: 'adminn@gmail.com',
    status: 'verified',
    isadmin: true,
    password: 'zxasqw58'
  }

  const tokenn = jwt.sign(userDemo, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });
    
  it('should not verify because isAdmin is found in token', () => {
    chai.request(server)
      .patch('/api/v2/users/client@gmail.com/verify')
      .set('Authorization', tokenn)
      .send({
        status: 'verified',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(401);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });

  it('should not verify user because email is invalid', () => {
    chai.request(server)
      .patch('/api/v2/users/clientxxx@gmail.com/verify')
      .set('Authorization', tokenn)
      .send({
        status: 'verified',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(401);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });

  it('should not verify user because email have already Verified', () => {
    chai.request(server)
      .patch('/api/v2/users/client@gmail.com/verify')
      .set('Authorization', tokenn)
      .send({
        status: 'verified',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(409);
        expect(res.body).to.have.property('status');
        expect(res.body).to.be.an('object');
      });
  });

  it('path not devined', () => {
    chai.request(server)
      .patch('/api/v2/users/client@gmail.com/verify')
      .set('Authorization', tokenn)
      .send({
        status: 'verifieds',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body).to.have.property('errors');
        expect(res.body).to.be.an('object');
      });
  });

  it('should not virify user because no token provided', () => {

    chai.request(server)
      .patch('/api/v2/users/client@gmail.com/verify')
      .set('Authorization', !tokenn)
      .send({
        status: 'verified',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(401);
      });
  });

  it('should get all users', () => {
    chai.request(server)
      .get('/api/v2/auth/users')
      .set('Authorization', tokenn)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body).to.be.an('object');
      });
  });

  it('should not view all users because no token provided', () => {
    chai.request(server)
      .get('/api/v2/auth/users')
      .set('Authorization', !tokenn)
      .end((err, res) => {
        expect(res.body.status).to.equal(401);
        expect(res.body).to.have.property('status');;
      });
  });
});
