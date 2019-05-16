import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validate from '../helpers/userHelper';
import db from '../models/UserDB';

dotenv.config();

const theStatus = {
  badRequestStatus:400,
  succcessStatus:200,
  unAuthorizedStatus:401,
  notFoundStatus:404,
  badRequestMessage:`You dont have the right for this activity!`
}
const userController = {
  signup(req, res) {
    const { error } = validate.validateSignup(req.body);
    const arrErrors = [];
    const allValdatorFunct = () =>{
      for (let i = 0; i < error.details.length; i++) {
        arrErrors.push(error.details[i].message);
      }
    }
    
    if (error) {
      // eslint-disable-next-line no-unused-expressions
      `${allValdatorFunct ()}`;
      if (error) return res.status(theStatus.badRequestStatus).json({ status: theStatus.badRequestStatus, errors: arrErrors });
    } else {
      const emailExist = db.users.find(findEmail => findEmail.email === req.body.email);
      if (emailExist) return res.status(409).json({ status: 409, error: 'Email is already registed!' });
      if (req.body.isAdmin === 'true') {
        const user = {
          id: db.users.length + 1,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          status: 'verified',
          isAdmin: req.body.isAdmin,
          password: bcrypt.hashSync(req.body.password, 10),
        };
        const token = jwt.sign(user, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });
        db.users.push(user);
        return res.header('Authorization', token).status(201).json({
          status: 201,
          message: 'Admin successfully created!',
          data: {
            token: token,
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
        });
      }
    }
    const user = {
      id: db.users.length + 1,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      address: req.body.address,
      status: 'unverified',
      isAdmin: 'false',
      password: bcrypt.hashSync(req.body.password, 10),
    };
    const token = jwt.sign(user, `${process.env.SECRET_KEY}`, { expiresIn: '24h' });
    db.users.push(user);
    return res.header('Authorization', token).status(201).json({
      status: 201,
      message: 'Successfully registed!',
      data: {
        token: token,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  },
  allUsers(req, res) {
    if(req.user.isAdmin === 'true') {
      if (!db.users.length) return res.status(theStatus.notFoundStatus).json({ status: theStatus.notFoundStatus, message: 'No user created!' });
      return res.status(200).json({ status: 200, data: db.users });
    }
    return res.status(theStatus.badRequestStatus).json({ status: theStatus.badRequestStatus, error: theStatus.badRequestMessage });
  },
  verifyUser(req, res) {
    if (req.user.isAdmin === 'true') {
      const userEmail = db.users.find(findEmail => findEmail.email === req.params.email);
      if (!userEmail) return res.status(theStatus.notFoundStatus).json({ status: theStatus.notFoundStatus, message: 'Email not found!' });
      if (userEmail.status === 'verified') return res.status(theStatus.badRequestStatus).json({ status: theStatus.badRequestStatus, message: 'User account Already Up-to-date!' });
      userEmail.status = 'verified';
      return res.status(200).json({
        status: 200,
        message: 'User account Verified successfully!',
        data: {
          email: userEmail.email,
          firstName: userEmail.firstName,
          lastName: userEmail.lastName,
          password: userEmail.password,
          address: userEmail.address,
          status: userEmail.status,
        },
      });
    }
    return res.status(theStatus.badRequestStatus).json({ status: theStatus.badRequestStatus, error: theStatus.badRequestMessage });
  },
  signin(req, res) {
    const { error } = validate.validateLogin(req.body);
    const arrErrors = [];
    const allValdatorFunct = () =>{
      for (let i = 0; i < error.details.length; i++) {
        arrErrors.push(error.details[i].message);
      }
    }
    if (error) {
      // eslint-disable-next-line no-unused-expressions
      `${allValdatorFunct ()}`;
      if (error) return res.status(theStatus.badRequestStatus).json({ status: theStatus.badRequestStatus, errors: arrErrors });
    } else {
      const user = db.users.find(findEmail => findEmail.email === req.body.email);
      if (!user) return res.status(theStatus.unAuthorizedStatus).json({ status: theStatus.unAuthorizedStatus, error: 'Incorrect Email' });
      const passwordCompare = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordCompare) return res.status(theStatus.unAuthorizedStatus).json({ status: theStatus.unAuthorizedStatus, error: 'Incorrect Password' });
      const payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        isAdmin: user.isAdmin,
        email: user.email,
      };
      const token = jwt.sign(payload, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });
      return res.header('Authorization', token).status(200).json({
        status: 200,
        message: 'You are successfully log in into Quick Credit',
        data: {
          token: token,
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    }
  },
};
export default userController;
