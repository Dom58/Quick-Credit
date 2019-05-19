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
  
};
export default userController;
