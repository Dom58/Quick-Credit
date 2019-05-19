import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validate from '../helpers/userHelper';
import pool from '../app'
import queryTable from '../models/queries'

dotenv.config();

const theStatus = {
  badRequestStatus:400,
  succcessStatus:200,
  unAuthorizedStatus:401,
  notFoundStatus:404,
  badRequestMessage:`You dont have the right for this activity!`
}
const statusMessageFunction = (res, status, message) => res.status(status).json({status, message});
const userController = {
  async signup (req, res) {
    const { error } = validate.validateSignup(req.body);
    const arrErrors = [];
    const allValdatorFunct = () =>{
      for (let i = 0; i < error.details.length; i++) {
        arrErrors.push(error.details[i].message);
      }
    } 
    if (error) {
      `${allValdatorFunct ()}`;
      if (error) return res.status(theStatus.badRequestStatus).json({ status: theStatus.badRequestStatus, errors: arrErrors });
    } else {
      try{
        let findUser = await pool.query(queryTable.fetchOneUser,[req.body.email]);
        if (findUser.rows[0]) return res.status(409).json({ status: 409, error: 'Email already registered!' });
        const userData = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          address: req.body.address,
          status:'unverified',
          isadmin:'false',
          password: bcrypt.hashSync(req.body.password,10),
          created_on: new Date(),
        };
        const payload = jwt.sign(userData, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });

        let createUser = await pool.query(queryTable.insertUser, [userData.firstname,userData.lastname,userData.email,userData.address,userData.status,userData.isadmin,userData.password,userData.created_on]);
        return res.status(201).json({
          status:201,
          message:'User Created successfully',
          data: {
            token: payload,
            id: createUser.rows[0].id,
            firstName: createUser.rows[0].firstname,
            lastName: createUser.rows[0].lastname,
            email: createUser.rows[0].email,
          }
        });
      } catch (error) {
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
      }
    }
  },
  async signin (req, res){
    const { error } = validate.validateLogin(req.body);
    const arrErrors = [];
    const allValdatorFunct = () =>{
      for (let i = 0; i < error.details.length; i++) {
        arrErrors.push(error.details[i].message);
      }
    }
    if (error) {
      `${allValdatorFunct ()}`;
      if (error) return res.status(theStatus.badRequestStatus).json({ status: theStatus.badRequestStatus, errors: arrErrors });
    } else {
      try{
        const findUser = await pool.query(queryTable.fetchOneUser,[req.body.email])
        if (!findUser.rows[0]) return res.status(theStatus.unAuthorizedStatus).json({ status: theStatus.unAuthorizedStatus, error: 'Incorrect Email' });

        const comparePassword = bcrypt.compareSync(req.body.password, findUser.rows[0].password);
        if (!comparePassword) return res.status(theStatus.unAuthorizedStatus).json({ status: theStatus.unAuthorizedStatus, error: 'Incorrect Password' });  
        const userDetails = {
          id:findUser.rows[0].id,
          firstName: findUser.rows[0].firstname,
          lastName: findUser.rows[0].lastname,
          email: findUser.rows[0].email,
          status: findUser.rows[0].status,
          isAdmin: findUser.rows[0].isadmin,
        };
        const payload = jwt.sign(userDetails, `${process.env.SECRET_KEY}`, { expiresIn: '24h' });
        
        return res.status(200).json({
        status:200,
        message:'You are signed in!',
        data: {
          token: payload,
          id: findUser.rows[0].id,
          firstName: findUser.rows[0].firstname,
          lastName: findUser.rows[0].lastname,
          email: findUser.rows[0].email,
        }
      });

      } catch (error) {
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
      } 
    }
  },
  async verifyUser (req,res){
    const { error } = validate.validateApplication(req.body);
    const arrErrors = [];
    const allValdatorFunct = () =>{
      for (let i = 0; i < error.details.length; i++) {
        arrErrors.push(error.details[i].message);
      }
    }
    if (error) {
      `${allValdatorFunct ()}`;
      if (error) return res.status(theStatus.badRequestStatus).json({ status: theStatus.badRequestStatus, errors: arrErrors });
    } else {
      try{
        const { email } = req.params;
        const findUser = await pool.query(queryTable.fetchOneUser,[email])
        if (!findUser.rows[0]) return res.status(theStatus.notFoundStatus).json({ status: theStatus.notFoundStatus, message: 'Email not found!' });
        if (findUser.rows[0].status === 'verified') return res.status(theStatus.badRequestStatus).json({ status: theStatus.badRequestStatus, message: 'User account Already Up-to-date!' });
        const verifyUser ={
            status : req.body.status,
          }
          const updateUserQuery = await pool.query(queryTable.updateUser,[email, verifyUser.status])
          // updateUser
          return res.status(200).json({
            status:200,
            message:'User account updated',
            data: {
              email: updateUserQuery.rows[0].email,
              firstName: updateUserQuery.rows[0].firstname,
              lastName: updateUserQuery.rows[0].lastname,
              password: updateUserQuery.rows[0].password,
              address: updateUserQuery.rows[0].address,
              status: updateUserQuery.rows[0].status,
            }
          });
      } catch (error) {
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
      }
    } 
  },
  
};
export default userController;
