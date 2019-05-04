import express from 'express';
import userController from '../controllers/UserController';
import auth from '../middleware/auth'


const route = express.Router();

route.post('/api/v1/signup', userController.signup);
route.get('/api/v1/users',auth, userController.allUsers);
route.post('/api/v1/signin', userController.signin);

export default route;