import express from 'express';
import loanController from '../controllers/LoanController';
import auth from '../middleware/auth';

const route = express.Router();

route.post('/api/v2/loans', auth, loanController.applyLoan);
route.get('/api/v2/loans', auth, loanController.allLoans);
route.get('/api/v2/loans/:id', auth, loanController.specificLoan);
route.patch('/api/v2/loans/:id', auth, loanController.approveLoan);
route.post('/api/v2/loans/:id/repayment', auth, loanController.repayLoan);
// route.get('/api/v2/loans/:id/repayments', auth, loanController.specificLoanRepayment);
route.get('/api/v2/repayments/loans', auth, loanController.allRepaymentLoan);
export default route;