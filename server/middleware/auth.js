import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

const authenticated = (req, res, next) => {

	try {
	    const header = req.headers.authorization;
	    if (!header || header === '') return res.status(403).json({ status: 403, error: 'FORBIDDEN' });

	    const token = jwt.verify(header, `${process.env.SECRET_KEY_CODE}`, { expiresIn: '24h'});
	    req.user = token;
	    next();
	} 
	catch {
	    return res.status(401).json({ status: 401, error: 'UNAUTHORIZED!' });
	}
};

export default authenticated;
