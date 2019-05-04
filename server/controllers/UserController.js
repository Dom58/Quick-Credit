import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validate from '../helpers/userHelper';
import db from '../models/UserDb';
import dotenv from 'dotenv';

dotenv.config();

const userController = {
    signup(req, res) {

    	const { error } = validate.validateSignup(req.body);
        if (error) return res.status(400).json({ status: 400, errors: error.message });

    	let emailExist = db.users.find(findEmail => findEmail.email === req.body.email);
        if (emailExist) return res.status(409).json({ status: 409, error: 'Email is already registed!' });

        //signup as an admin
        if (req.body.isAdmin ==='true') {
            const user = {
                id:db.users.length +1,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                status:"verified", 
                isAdmin:req.body.isAdmin,
                password: bcrypt.hashSync(req.body.password,10)
            };
            const token = jwt.sign(user, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });
            db.users.push(user);

	        return res.header('Authorization', token).status(201).json({
	          status: 201,
	          message: 'Admin successfully created!',
	          data: {
	            token:token,
	            id: user.id,
	            firstName: user.firstName,
	            lastName: user.lastName,
	            email: user.email,
	          },
	        });
        }

        //signup as a client
        else{
        	const user = {
                id:db.users.length +1,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                address: req.body.address,
                status:"unverified", 
                isAdmin:"false",
                password: bcrypt.hashSync(req.body.password,10)
            };
            const token = jwt.sign(user, `${process.env.SECRET_KEY}`, { expiresIn: '24h' });
            db.users.push(user);

	        return res.header('Authorization', token).status(201).json({
	          status: 201,
	          message: 'Successfully registed!',
	          data: {
	            token:token,
	            id: user.id,
	            firstName: user.firstName,
	            lastName: user.lastName,
	            email: user.email,
	          },
	        });
        }
    },


    allUsers(req, res){
        if (!db.users.length) return res.status(404).json({ status: 404, message: 'No user created!' });
        return res.status(200).json({ status: 200, data: db.users });
    },

    verifyUser(req, res){
        if(req.user.isAdmin ==='true'){
          const userEmail = db.users.find(findEmail => findEmail.email === req.params.email);
          
          if (!userEmail) return res.status(404).json({ status: 404, message: `Email not found!` });

          if (userEmail.status === "verified") return res.status(400).json({status:400,message: 'User account Already Up-to-date!'})
           
           userEmail.status = "verified";

            return res.status(200).json({ 
                status: 200, 
                message: 'User account Verified successfully!',
                data: {
                    email:userEmail.email,
                    firstName:userEmail.firstName,
                    lastName:userEmail.lastName,
                    password:userEmail.password,
                    address:userEmail.address,
                    status:userEmail.status
                },
            });
          }

      else return res.status(400).json({status:400, error:'You dont have a right to verify a user account!'});
      
    },

    signin(req, res) {
        const { error } = validate.validateLogin(req.body);
        if (error) return res.status(400).json({ status: 400, errors: error.message });

        const user = db.users.find(findEmail => findEmail.email === req.body.email);
        if (!user) return res.status(401).json({ status: 401, error: 'Incorrect Email' });

        const passwordCompare = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordCompare) return res.status(401).json({ status: 401, error: 'Incorrect Password' });

        const payload = {
            id:user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            status: user.status,
            isAdmin: user.isAdmin,
            email: user.email
        };

        // sign a json web token
        const token = jwt.sign(payload, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h' });

            return res.header('Authorization', token).status(200).json({
              status: 200,
              message: 'You are successfully log in into Quick Credit',
              data: {
                token: token,
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
                },
            });
    }
}
export default userController;
