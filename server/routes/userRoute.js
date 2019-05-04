import express from 'express';
import userController from '../controllers/UserController';


const route = express.Router();

route.post('/api/v1/signup', userController.signup);

export default route;