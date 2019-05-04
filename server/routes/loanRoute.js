import express from 'express';
import loanController from '../controllers/LoanController';
import auth from '../middleware/auth';


const route = express.Router();

route.post('/api/v1/loans',auth, loanController.applyLoan);
route.get('/api/v1/loans',auth, loanController.allLoans);

export default route;