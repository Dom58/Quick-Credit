import validate from '../helpers/loanHelper';
import pool from '../models/dbCon';
import queryTable from '../models/queries'

const loanStatus = {
  succcessStatus: 200,
  badRequestStatus: 400,
  unauthorizedStatus: 401,
  notFoundStatus: 404,
  conflictRequestStatus: 409,
  badRequestMessage:`Access Denied!`
}

const statusMessageFunction = (res, status, message) => res.status(status).json({status, message});

const loanController = {
  async applyLoan (req, res) {
    const { error } = validate.validateLoan(req.body);
    const arrErrors = [];
    const allValdatorFunct = () => {
      for (let i = 0; i < error.details.length; i++) {
        arrErrors.push(error.details[i].message);
      }
    };

    if (error) {
      `${allValdatorFunct()}`;
      if (error) return res.status(400).json({ status: 400, errors: arrErrors });
    } 
    
    else {
      const theTenor = parseInt(req.body.tenor);
      const theAmount = parseFloat(req.body.amount);
      const theInterest = parseFloat(req.body.amount) * 0.05;
      const thepaymentInstallment = parseFloat((theAmount + theInterest) / theTenor).toFixed(2);
      const theBalance = parseFloat(theAmount + theInterest).toFixed(2);
      const email = req.user.email;

      const haveApplyLoan = await pool.query(queryTable.fetchUserWithLoan,[email]);

      if (req.user.status === 'verified') {
        if (!haveApplyLoan.rows[0] || haveApplyLoan.rows[0].repaid === true) {
          const loan = {
            email: req.user.email,
            created_on: new Date(),
            status: 'pending',
            repaid: 'false',
            tenor: theTenor,
            amount: theAmount,
            paymentinstallment: thepaymentInstallment,
            balance: theBalance,
            interest: theInterest.toFixed(2),
          };

          const createLoan = await pool.query(queryTable.insertLoan, [req.user.email,loan.status,loan.repaid,loan.amount,loan.tenor,loan.paymentinstallment,loan.balance,loan.interest,loan.created_on]);

          return res.status(201).json({
            status: 201,
            message: 'Loan Applied Successfully!',
            data: {
              "loanid": createLoan.rows[0].id,
              "firstName": req.user.firstName,
              "lastName": req.user.lastName,
              "email": createLoan.rows[0].email,
              "tenor": createLoan.rows[0].tenor,
              "amount": createLoan.rows[0].amount,
              "paymentInstallement": createLoan.rows[0].paymentinstallment,
              "status": createLoan.rows[0].status,
              "balance": createLoan.rows[0].balance,
              "interest": createLoan.rows[0].interest,
            }
          });

        } 
        statusMessageFunction(res, 403, `You have unpaid Loan!` ) 
      } 
      else {
        statusMessageFunction(res, 403, 'You are not yet verified !' )
      } 
    }
  },

  async allLoans (req, res){
    if (req.user.isadmin === true) {
      try{
      const reqLoanStatus = req.query.status;
      const reqLoanRepaid = req.query.repaid;
      // Get all loans according to the loan status and loan repayment
      const reqLoans = await pool.query(queryTable.getRepaidLoans, [reqLoanStatus, reqLoanRepaid]);
      if (reqLoans.rows.length !== 0) {
        return res.status(200).json({
          status: loanStatus.succcessStatus,
          data: reqLoans.rows,
        });
      }
      const { rows } = await pool.query(queryTable.getAllLoans);
      if (reqLoanStatus == null && reqLoanRepaid == null && rows.length !==0) {
        return res.status(200).json({
          status:  loanStatus.succcessStatus,
          data: rows,
        });
      }
      return res.status(404).send({
        status: loanStatus.notFoundStatus,
        error: 'No loan Found !',       
      });
      }
      catch (error) {
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
      }
    } 
    else 
    {
      statusMessageFunction(res,loanStatus.unauthorizedStatus, `${loanStatus.badRequestMessage}` )
    }
  },

  async specificLoan (req, res){
    if (req.user.isadmin === true) {
      const { id } = req.params;
      const findLoan = await pool.query(queryTable.fetchOneLoan,[parseInt((id))]);
      if (!findLoan.rows[0]) {
        return res.status(404).json({ status: 404, error:  `Loan with id ## ${id} ## not Found! ` });
      }
      return res.status(200).send({
        status: 200,
        data: findLoan.rows[0],       
      });
    } 
    else 
    {
      statusMessageFunction(res, loanStatus.unauthorizedStatus, `${loanStatus.badRequestMessage}` )
    }
  },

  async approveLoan (req, res){
    if (req.user.isadmin === true) {
      const { error } = validate.validateApproveLoan(req.body);
      const arrErrors = [];

      const allValdatorFunct = () => {
        for (let i = 0; i < error.details.length; i++) {
          arrErrors.push(error.details[i].message);
        }
      };

      if (error) {
        `${allValdatorFunct()}`;
        if (error) return res.status(400).json({ status: 400, errors: arrErrors });
      } 
      
      else{
        try{
        const { id } = req.params;
        const findLoan = await pool.query(queryTable.fetchOneLoan,[parseInt(id)])

        if (!findLoan.rows[0]) {
          return res.status(404).json({ status: 404, error:  `Loan with id ${id} not Found! ` });
        }
        
        if (findLoan.rows[0].status === 'approved') return res.status(loanStatus.succcessStatus).json({ status: loanStatus.succcessStatus, error: `Loan Up-to-date!` });

        const aproveData ={
          status : req.body.status,
          id : id,
        }

        const loanUpdate = await pool.query(queryTable.updateLoan,[aproveData.id,aproveData.status])
        return res.status(200).send({
          status: 200,
        message: `Loan with id ${id} ${req.body.status}! `,
        data: {
          loanId: loanUpdate.rows[0].id,
          loanAmount: loanUpdate.rows[0].amount,
          tenor: loanUpdate.rows[0].tenor,
          status: loanUpdate.rows[0].status,
          monthlyInstallment: loanUpdate.rows[0].paymentInstallment,
          interest: loanUpdate.rows[0].interest,
        },
        });
      } 
      catch (error) {
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
      }
    }
    } 
    else {
      statusMessageFunction(res, loanStatus.unauthorizedStatus, `${loanStatus.badRequestMessage}` )
    }
  },

  async repayLoan (req, res){
    if (req.user.isadmin === true) {
      const { error } = validate.validateRepayment(req.body);

      if (error) return res.status(400).json({ status: 400,  error: error.details[0].message });

      const { id } = req.params;
      const findLoan = await pool.query(queryTable.fetchOneLoan,[id]);
      
      if (!findLoan.rows[0]) {
        return res.status(404).json({ status: 404, error:  `Loan with id ${id} not Found! ` });
      }

      const theAmount = parseFloat(req.body.amount);
      const theDiffrence = theAmount - findLoan.rows[0].balance; 

      const weOfferYou = () => {
        return theDiffrence;
      }

      const repayment = {
        created_on: new Date(),
        loanId: findLoan.rows[0].id,
        amount: theAmount,
        monthlypayment: findLoan.rows[0].paymentinstallment,
        balance: findLoan.rows[0].balance,
      };
      
      if (findLoan.rows[0].status ==='pending' || findLoan.rows[0].status ==='rejected')  
        return res.status(403).json({ status: 403, error: `Loan Application is Pending or rejected!` });
        
        if (findLoan.rows[0].balance === '0') {
          statusMessageFunction(res, 403, `You have paid all your loan!` )
          }
        else {
          if (repayment.amount >= parseFloat(findLoan.rows[0].balance) ) {

            const newBalance ={
              balance : '0',
              repaid : "true",
              }
            
            const newLoanUpdate = await pool.query(queryTable.updateLoanAfterHighRepayment, [findLoan.rows[0].id, newBalance.balance, newBalance.repaid]);

            const createRepayment = await pool.query(queryTable.insertRepayment, [findLoan.rows[0].id, findLoan.rows[0].balance, repayment.monthlypayment, newLoanUpdate.rows[0].balance, repayment.created_on]);

            return res.status(201).json({
              status:201,
              message:`Success, you repay over-amount of [ ${weOfferYou()} ]`,
              data:{
                id: createRepayment.rows[0].id,
                loanId: createRepayment.rows[0].loanid,
                CreatedOn: createRepayment.rows[0].created_on,
                amount: newLoanUpdate.rows[0].amount,
                monthlyInstallment: newLoanUpdate.rows[0].monthlypayment,
                paidAmount: createRepayment.rows[0].amount,
                balance: createRepayment.rows[0].balance,
              },
            });
          }

          else {
            findLoan.rows[0].balance = findLoan.rows[0].balance - theAmount;

            const newLoanUpdate = await pool.query(queryTable.updateLoanAfterLowRepayment, [findLoan.rows[0].id, findLoan.rows[0].balance]);

            const createRepayment = await pool.query(queryTable.insertRepayment, [findLoan.rows[0].id, repayment.amount, repayment.monthlypayment, newLoanUpdate.rows[0].balance, repayment.created_on]);

            return res.status(201).json({
              status:201,
              message:`Repayment Created Successfully!`,
              data:{
                id: createRepayment.rows[0].id,
                loanId: createRepayment.rows[0].loanid,
                CreatedOn: createRepayment.rows[0].created_on,
                amount: newLoanUpdate.rows[0].amount,
                monthlyInstallment: newLoanUpdate.rows[0].monthlypayment,
                paidAmount: createRepayment.rows[0].amount,
                balance: createRepayment.rows[0].balance,
              },
            });
          } 
        } 
    } 

    else {
      statusMessageFunction(res, loanStatus.unauthorizedStatus, `${loanStatus.badRequestMessage}` )
    }
  },

  async allRepaymentLoan (req, res){
    try{
      const {rows} = await pool.query(queryTable.getAllRepayments)
      if (!rows.length) {
      return res.status(404).send({
        status: 404,
        error: 'No loan repayment created !',       
      });
      }
      return res.status(200).send({
        status: 200,
        data: rows,       
      });
    }
    catch (error) {
      res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
  },

  async specificLoanRepayment (req, res){
    if (req.user.isadmin === true) {
      try{
      const { id } = req.params;
      const findLoanRepayment = await pool.query(queryTable.fetchOneRepayment,[id]);
      if (!findLoanRepayment.rows[0]) {
        return res.status(404).json({ status: 404, error:  `Loan Repayment with id ${id} not Found! ` });
      }

      return res.status(200).send({
        status: 200,
        data: findLoanRepayment.rows[0],       
      });
    }
    catch (error) {
      res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
    }
    else {
      statusMessageFunction(res, loanStatus.unauthorizedStatus, `${loanStatus.badRequestMessage}` )
    }
  }
};
export default loanController;

