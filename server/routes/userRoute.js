import express from 'express';
import userController from '../controllers/UserController';
import auth from '../middleware/auth';

const route = express.Router();

route.post('/api/v2/auth/signup', userController.signup);
route.get('/api/v2/auth/users',auth, userController.allUsers);
route.post('/api/v2/auth/signin', userController.signin);
route.patch('/api/v2/users/:email/verify',auth, userController.verifyUser);

export default route;