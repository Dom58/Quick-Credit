import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { expect } = chai;
chai.use(chaiHttp);

describe('signup', () => {
const userDemo = {
      id:1,
      firstName: 'admin',
      lastName: 'admin58',
      email: 'admin@gmail.com',
      status: "verified",
      isAdmin:"true",
      password:'zxasqw58'
    }

	const token = jwt.sign(userDemo, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });
    
	it('should not found the created user accounts', () => {
	    chai.request(server)
	      .get('/api/v1/auth/users')
	      .set('Authorization', token)
	      .end((err, res) => {
	        expect(res.body.status).to.equal(404);
	        expect(res.body).to.have.property('status');
            expect(res.body).to.be.an('object');
	      });
	});
	
    it('shoud create admin account', () =>{
       chai.request(server)
      .post('/api/v1/auth/signup')
      .send({
          firstName: 'admin',
          lastName: 'admin58',
          email: 'admin@gmail.com',
          isAdmin:"true",
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

    it('should create client account', () =>{
       chai.request(server)
      .post('/api/v1/auth/signup')
      .send({
          firstName: 'client',
          lastName: 'client58',
          email: 'client@gmail.com',
          address:'Kigali/Gasabo',
          isAdmin:'false',
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
      .post('/api/v1/auth/signup')
      .send({
          firstName: '',
          lastName: '',
          email: '',
          isAdmin:'',
          password: '',
        })
        .end((err, res) => {
          expect(res.body.status).to.equal(400);
          expect(res.body).to.have.property('status');
          expect(res.body).to.be.an('object');
        });
    });

    it('should not create user because email already registed', () =>{
       chai.request(server)
      .post('/api/v1/auth/signup')
      .send({
          firstName: 'damascene',
          lastName: 'damas58',
          email: 'admin@gmail.com',
          isAdmin:"false",
          password: 'zxasqw58',
        })
        .end((err, res) => {
          expect(res.body.status).to.equal(409);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');
          expect(res.body).to.be.an('object');
        });
    });

    it('should not create user because email format is invalid', () =>{
       chai.request(server)
      .post('/api/v1/auth/signup')
      .send({
          firstName: 'damascene',
          lastName: 'damas58',
          email: 'clientgmailcom',
          address:'hdhh',
          isAdmin:"false",
          password: 'zxasqw58',
        })
        .end((err, res) => {
          expect(res.body.status).to.equal(400);
          expect(res.body).to.have.property('status');
          expect(res.body).to.be.an('object');
        });
    });
});

describe('signin', () => {

	it('should not signin because email and password are required', () => {
        chai.request(server)
          .post('/api/v1/auth/signin')
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

    it('should not signin because password is incorrect', () => {
        chai.request(server)
          .post('/api/v1/auth/signin')
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
          .post('/api/v1/auth/signin')
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
          email: 'admin@gmail.com',
          password: 'zxasqw58',
        };
        chai.request(server)
          .post('/api/v1/auth/signin')
          .send(user)
          .end((err, res) => {
            expect(res.body.status).to.equal(200);
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('data');
            expect(res.body).to.be.an('object');
          });
          
      });
});

describe('Users', () => {

	it('should not allowed to view all users because token required', () => {
	    chai.request(server)
	      .get('/api/v1/auth/users')
	      .end((err, res) => {
	        expect(res.body.status).to.equal(403);
	        expect(res.body).to.have.property('status');
            expect(res.body).to.be.an('object');
	      });
	});

  	const userDemo = {
      id:1,
      firstName: 'admin',
      lastName: 'admin58',
      email: 'admin@gmail.com',
      status: "verified",
      isAdmin:"true",
      password:'zxasqw58'
    }

	const token = jwt.sign(userDemo, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });
    
	it('should verify a client because isAdmin is found in token', () => {

	    chai.request(server)
	      .patch('/api/v1/users/client@gmail.com/verify')
	      .set('Authorization', token)
	      .send({
	        status: "verified",
	      })
	      .end((err, res) => {
	        expect(res.body.status).to.equal(200);
	        expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('data');
            expect(res.body).to.be.an('object');
	      });
	});

	it('should not verify user because email is invalid', () => {

	    chai.request(server)
	      .patch('/api/v1/users/clientxxx@gmail.com/verify')
	      .set('Authorization', token)
	      .send({
	        status: "verified",
	      })
	      .end((err, res) => {
	        expect(res.body.status).to.equal(404);
	        expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('message');
            expect(res.body).to.be.an('object');
	      });
	});

	it('should not verify user because email have already Verified', () => {

	    chai.request(server)
	      .patch('/api/v1/users/client@gmail.com/verify')
	      .set('Authorization', token)
	      .send({
	        status: "verified",
	      })
	      .end((err, res) => {
	        expect(res.body.status).to.equal(400);
	        expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('message');
            expect(res.body).to.be.an('object');
	      });
	});

	it('should not virify user because no token provided', () => {

	    chai.request(server)
	      .patch('/api/v1/users/client@gmail.com/verify')
	      .set('Authorization', !token)
	      .send({
	        status: "verified",
	      })
	      .end((err, res) => {
	        expect(res.body.status).to.equal(401);
	      });
	});

	it('should get all users', () => {
	    chai.request(server)
	      .get('/api/v1/auth/users')
	      .set('Authorization', token)
	      .end((err, res) => {
	        expect(res.body.status).to.equal(200);
	        expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('data');
            expect(res.body).to.be.an('object');
	      });
	});

	

	it('should not view all users because no token provided', () => {
	    chai.request(server)
	      .get('/api/v1/auth/users')
	      .set('Authorization', !token)
	      .end((err, res) => {
	        expect(res.body.status).to.equal(401);
	        expect(res.body).to.have.property('status');;
	      });
	});
});

describe('IsAdmin equal false', () => {
  	const notIsAdmin = {
      id:5,
      firstName: 'clients',
      lastName: 'client58s',
      email: 'clientzz@gmail.com',
      isAdmin:"false",
      password:'zxasqw58'
    }

	const token = jwt.sign(notIsAdmin, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });
    
	it('should not view all users because user not an admin', () => {
	    chai.request(server)
	      .get('/api/v1/auth/users')
	      .set('Authorization', token)
	      .end((err, res) => {
	        expect(res.body.status).to.equal(400);
	        expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('error');
            expect(res.body).to.be.an('object');
	      });
	});

	it('should not verify because user not an admin', () => {
	    chai.request(server)
	      .patch('/api/v1/users/clients@gmail.com/verify')
	      .set('Authorization', token)
	      .send({
	        status: "verified",
	      })
	      .end((err, res) => {
	        expect(res.body.status).to.equal(400);
	        expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('error');
            expect(res.body).to.be.an('object');
	      });
	});
});