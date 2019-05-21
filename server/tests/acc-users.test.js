import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import server from '../app.js'

dotenv.config();

const { expect } = chai;
chai.use(chaiHttp);

// // describe('earth', function(){
// //     before(function(){
// //       console.log('see.. this function is run ONCE only, before first describe()')
// //     })
// //     describe('singapre', function(){
// //       it('birds should fly', function(){ /** ... */ })
// //     })
// //     describe('malaysia', function(){
// //       it('birds should soar', function(){ /** ... */ })
// //     })
// //   })


// describe('signup', () => {
//   const userDemo = {
//     id: 1,
//     firstname: 'admin',
//     lastname: 'admin58',
//     email: 'superadmin@gmail.com',
//     status: 'verified',
//     isadmin: true,
//     password: 'zxasqw58'
//   }
//   const token = jwt.sign(userDemo, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });

//   it('should not found the created user accounts', () => {
//     chai.request(server)
//       .get('/api/v2/auth/users')
//       .set('Authorization', token)
//       .end((err, res) => {
//         expect(res.body.status).to.equal(404);
//         expect(res.body).to.have.property('status');
//         expect(res.body).to.be.an('object');
//       });
//   });
	
//   it('should create admin account', () =>{
//     chai.request(server)
//       .post('/api/v2/auth/signup')
//       .send({
//         firstname: 'admin',
//         lastname: 'superadmin58',
//         email: 'admin@gmail.com',
//         isadmin: "true",
//         password: 'zxasqw58',
//       })
//       .end((err, res) => {
//         console.log(res.body)
//         expect(res.body.status).to.equal(201);
//         expect(res.body).to.have.property('status');
//         expect(res.body).to.have.property('message');
//         expect(res.body).to.have.property('data');
//         expect(res.body).to.be.an('object');
//       });
//   });

//   it('should create client account', () =>{
//     chai.request(server)
//       .post('/api/v2/auth/signup')
//       .send({
//         firstname: 'client',
//         lastname: 'client58',
//         email: 'client@gmail.com',
//         address: 'Kigali/Gasabo',
//         isadmin: "false",
//         password: 'zxasqw58',
//       })
//       .end((err, res) => {
//         console.log(res.body)
//         expect(res.body.status).to.equal(201);
//         expect(res.body).to.have.property('status');
//         expect(res.body).to.have.property('message');
//         expect(res.body).to.have.property('data');
//         expect(res.body).to.be.an('object');
//       });
//   });

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
// });

// describe('signin', () => {

//   // it('should not signin because email and password are required', () => {
//   //   chai.request(server)
//   //     .post('/api/v2/auth/signin')
//   //     .send({
//   //       email: ' ',
//   //       password: ' ',
//   //     })
//   //     .end((err, res) => {
//   //       console.log(res.body)
//   //       expect(res.body.status).to.equal(400);
//   //       expect(res.body).to.have.property('status');
//   //       expect(res.body).to.be.an('object');
//   //     });
//   // });
//   // it('should not signin because password must be valid', () => {
//   //   chai.request(server)
//   //     .post('/api/v2/auth/signin')
//   //     .send({
//   //       email: 'clientgmailcom',
//   //       password: 'nn',
//   //     })
//   //     .end((err, res) => {
//   //       console.log(res.body)
//   //       expect(res.body.status).to.equal(400);
//   //       expect(res.body).to.have.property('status');
//   //       expect(res.body).to.be.an('object');
//   //     });
//   // });

//   // it('should not signin because password is incorrect', () => {
//   //   chai.request(server)
//   //     .post('/api/v2/auth/signin')
//   //     .send({
//   //       email: 'superadmin@gmail.com',
//   //       password: 'zxcvzxc',
//   //     })
//   //     .end((err, res) => {
//   //       expect(res.body.status).to.equal(401);
//   //       expect(res.body).to.have.property('status');
//   //       expect(res.body).to.have.property('error');
//   //       expect(res.body).to.be.an('object');
//   //     });
//   // });

//   it('should not signin because email is not valid', () => {
//     chai.request(server)
//       .post('/api/v2/auth/signin')
//       .send({
//         email: 'adminzz@gmail.com',
//         password: 'zxasqw58',
//       })
//       .end((err, res) => {
//         expect(res.body.status).to.equal(401);
//         expect(res.body).to.have.property('status');
//         expect(res.body).to.have.property('error');
//         expect(res.body).to.be.an('object');
//       });
//   });

//   it('should signin in quick credit web application', () => {
//     const user = {
//       email: 'admin@gmail.com',
//       password: 'zxasqw58',
//     };
//     chai.request(server)
//       .post('/api/v2/auth/signin')
//       .send(user)
//       .end((err, res) => {
//         console.log(res.body)
//         expect(res.body.status).to.equal(200);
//         expect(res.body).to.have.property('status');
//         expect(res.body).to.have.property('message');
//         expect(res.body).to.have.property('data');
//         expect(res.body).to.be.an('object');
//       });
//   });
// });

// // describe('Users', () => {

// //   it('should not allowed to view all users because token required', () => {
// //     chai.request(server)
// //       .get('/api/v2/auth/users')
// //       .end((err, res) => {
// //         expect(res.body.status).to.equal(403);
// //         expect(res.body).to.have.property('status');
// //         expect(res.body).to.be.an('object');
// //       });
// //   });

//   const userDemo = {
//     id: 1,
//     firstname: 'admin',
//     lastname: 'admin58',
//     email: 'superadmin@gmail.com',
//     status: 'verified',
//     address:'kigali/Gasabo',
//     isadmin: true,
//     password: 'zxasqw58'
//   }

//   const token = jwt.sign(userDemo, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });
    
// //   it('should verify a client because isadmin is found in token', () => {
// //     chai.request(server)
// //       .patch('/api/v2/users/client@gmail.com/verify')
// //       .set('Authorization', token)
// //       .send({
// //         status: 'verified',
// //       })
// //       .end((err, res) => {
// //         console.log(res.body)
// //         expect(res.body.status).to.equal(200);
// //         expect(res.body).to.have.property('status');
// //         expect(res.body).to.have.property('message');
// //         expect(res.body).to.have.property('data');
// //         expect(res.body).to.be.an('object');
// //       });
// //   });

//   it('should not verify user because email is invalid', () => {
//     chai.request(server)
//       .patch('/api/v2/users/clientxxx@gmail.com/verify')
//       .set('Authorization', token)
//       .send({
//         status: 'verified',
//       })
//       .end((err, res) => {
//         console.log(res.body)
//         expect(res.body.status).to.equal(404);
//         expect(res.body).to.have.property('status');
//         expect(res.body).to.have.property('message');
//         expect(res.body).to.be.an('object');
//       });
//   });

// //   it('should not verify user because email have already Verified', () => {
// //     chai.request(server)
// //       .patch('/api/v2/users/client@gmail.com/verify')
// //       .set('Authorization', token)
// //       .send({
// //         status: 'verified',
// //       })
// //       .end((err, res) => {
// //         console.log(res.body)
// //         expect(res.body.status).to.equal(400);
// //         expect(res.body).to.have.property('status');
// //         expect(res.body).to.have.property('message');
// //         expect(res.body).to.be.an('object');
// //       });
// //   });

// //   it('should not virify user because no token provided', () => {

// //     chai.request(server)
// //       .patch('/api/v2/users/client@gmail.com/verify')
// //       .set('Authorization', !token)
// //       .send({
// //         status: 'verified',
// //       })
// //       .end((err, res) => {
// //         expect(res.body.status).to.equal(401);
// //       });
// //   });

// //   it('should get all users', () => {
// //     chai.request(server)
// //       .get('/api/v2/auth/users')
// //       .set('Authorization', token)
// //       .end((err, res) => {
// //         console.log(res.body)
// //         expect(res.body.status).to.equal(200);
// //         expect(res.body).to.have.property('status');
// //         expect(res.body).to.have.property('data');
// //         expect(res.body).to.be.an('object');
// //       });
// //   });

// // //   it('should not view all users because no token provided', () => {
// // //     chai.request(server)
// // //       .get('/api/v2/auth/users')
// // //       .set('Authorization', !token)
// // //       .end((err, res) => {
// // //         expect(res.body.status).to.equal(401);
// // //         expect(res.body).to.have.property('status');;
// // //       });
// // //   });
// // });

// // describe('Isadmin equal false', () => {
// //   const notIsadmin = {
// //     id: 5,
// //     firstname: 'clients',
// //     lastname: 'client58s',
// //     email: 'clientzz@gmail.com',
// //     address:'kigali/Gasabo',
// //     isadmin: false,
// //     password: 'zxasqw58'
// //   }

// //   const token = jwt.sign(notIsadmin, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });
    
// //   it('should not view all users because user not an admin', () => {
// //     chai.request(server)
// //       .get('/api/v2/auth/users')
// //       .set('Authorization', token)
// //       .end((err, res) => {
// //         console.log(res.body)
// //         expect(res.body.status).to.equal(400);
// //         expect(res.body).to.have.property('status');
// //         expect(res.body).to.have.property('error');
// //         expect(res.body).to.be.an('object');
// //       });
// //   });

// //   it('should not verify because user not an admin', () => {
// //     chai.request(server)
// //       .patch('/api/v2/users/clients@gmail.com/verify')
// //       .set('Authorization', token)
// //       .send({
// //         status: 'verified',
// //       })
// //       .end((err, res) => {
// //         expect(res.body.status).to.equal(400);
// //         expect(res.body).to.have.property('status');
// //       });
// //   });
// // });
