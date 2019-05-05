import express from 'express';
import loanController from '../controllers/LoanController';
import auth from '../middleware/auth';


const route = express.Router();

route.post('/api/v1/loans',auth, loanController.applyLoan);
route.get('/api/v1/loans',auth, loanController.allLoans);
route.get('/api/v1/loans/:id',auth, loanController.specificLoan);
route.patch('/api/v1/loans/:id',auth, loanController.approveLoan);

export default route;