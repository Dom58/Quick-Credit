import validate from '../helpers/loanHelper';
import dbLoan from '../models/LoanDB';
import dbLoanRepayment from '../models/LoanRepaymentDB';

const loanController = {
  applyLoan(req, res) {
    const { error } = validate.validateLoan(req.body);
    const arrErrors = [];
    const allValdatorFunct = () => {
      for (let i = 0; i < error.details.length; i++) {
        arrErrors.push(error.details[i].message);
      }
    };
    if (error) {
      // eslint-disable-next-line no-unused-expressions
      `${allValdatorFunct()}`;
      if (error) return res.status(400).json({ status: 400, errors: arrErrors });
    } else {
      const theTenor = parseInt(req.body.tenor);
      const theAmount = parseFloat(req.body.amount);
      const theInterest = parseFloat(req.body.amount) * 0.05;
      const thepaymentInstallment = parseFloat((theAmount + theInterest) / theTenor).toFixed(2);
      const theBalance = parseFloat(theAmount + theInterest).toFixed(2);

      const haveApplyLoan = dbLoan.loans.find(findEmail => findEmail.email === req.user.email);

      if (req.user.status === 'verified') {
        if (!haveApplyLoan || haveApplyLoan.repaid === 'true') {
          const loan = {
            loanId: dbLoan.loans.length + 1,
            email: req.user.email,
            CreatedOn: new Date(),
            status: 'pending',
            repaid: 'false',
            tenor: theTenor,
            amount: theAmount,
            paymentInstallment: thepaymentInstallment,
            balance: theBalance,
            interest: theInterest,
          };

          dbLoan.loans.push(loan);

          return res.status(201).json({
            status: 201,
            message: 'Loan Applied Successfully, Good Luck!',
            data: {
              loanId: loan.loanId,
              CreatedOn: new Date(),
              firstName: req.user.firstName,
              lastName: req.user.lastName,
              email: req.user.email,
              tenor: loan.tenor,
              amount: loan.amount,
              paymentInstallment: loan.paymentInstallment,
              status: 'pending',
              balance: loan.balance,
              interest: (loan.interest).toFixed(2),
            },
          });
        }
        return res.status(400).json({
          status: 400,
          message: `Ooops!! You have unpaid Loan of ## ${haveApplyLoan.balance} ##, Please repay this loan!`,
        });
      } return res.status(400).json({ status: 400, message: 'Sorry! Your are not yet verified, Please contact Admin !' });
    }
  },
  allLoans(req, res) {
    if (req.user.isAdmin === 'true') {
      const statusLoansQuery = req.query.status;
      const repaidLoansQuery = req.query.repaid;
      const loansFilteringQuery = dbLoan.loans.filter(result => result.status === statusLoansQuery && result.repaid === repaidLoansQuery);
      if (loansFilteringQuery.length !== 0) {
        res.status(200).send({
          status: 200,
          data: loansFilteringQuery,
        });
      } else if (statusLoansQuery == null && repaidLoansQuery == null && dbLoan.loans.length !== 0) {
        res.status(200).send({
          status: 200,
          data: dbLoan.loans,
        });
      }
      else {
        res.status(404).json({ status: 404, message: 'No Loan Found!' });
      }
    }
    else {
      res.status(400).json({ status: 400, message: 'Sorry! You dont have a right to view loan Application history. Any question contact Admin!' });
    }
  },
  specificLoan(req, res) {
    if (req.user.isAdmin === 'true') {
      const theId = parseInt(req.params.id);
      const loan = dbLoan.loans.find(findLoan => findLoan.loanId === theId);
      if (!loan) return res.status(404).json({ status: 404, error: `Loan with ID ## ${theId} ## not found!` });

      return res.status(200).json({
        status: 200,
        data: {
          id: loan.loanId,
          user: loan.email,
          CreatedOn: loan.CreatedOn,
          status: loan.status,
          repaid: loan.repaid,
          tenor: loan.tenor,
          amount: loan.amount,
          paymentInstallment: loan.paymentInstallment,
          balance: loan.balance,
          interest: loan.interest,
        },
      });
    }

    return res.status(400).json({ status: 400, message: 'Oops! You dont have a right to view specific loan Application history!' });
  },
  approveLoan(req, res) {
    if (req.user.isAdmin === 'true') {
      const { error } = validate.validateApproveLoan(req.body);
      const arrErrors = [];
      const allValdatorFunct = () => {
        for (let i = 0; i < error.details.length; i++) {
          arrErrors.push(error.details[i].message);
        }
      };
      if (error) {
      // eslint-disable-next-line no-unused-expressions
        `${allValdatorFunct()}`;
        if (error) return res.status(400).json({ status: 400, errors: arrErrors });
      } else {
        const loan = dbLoan.loans.find(findLoan => findLoan.loanId === parseInt(req.params.id));
        if (!loan) return res.status(404).json({ status: 404, error: `Loan with ID ## ${req.params.id} ## not found!` });

        if (loan.status === 'approved') return res.status(400).json({ status: 400, message: 'Loan Application Already Up-to-date(Approved)!' });

        loan.status = req.body.status;

        return res.status(200).json({
          status: 200,
          data: {
            loanId: loan.loanId,
            loanAmount: loan.amount,
            tenor: loan.tenor,
            status: loan.status,
            monthlyInstallment: loan.paymentInstallment,
            interest: loan.interest,
          },
        });
      }

      return res.status(400).json({ status: 400, message: 'Oops! You dont have a right to Approve/Reject loan Application!' });
    }
  },
  // loan Repayment
  repayLoan(req, res) {
    if (req.user.isAdmin ==='true') {
      const { error } = validate.validateRepayment(req.body);
      if (error) return res.status(400).json({ status: 400,  error: error.details[0].message });

      const loan = dbLoan.loans.find(findLoan => findLoan.loanId === parseInt(req.params.id));
      if (!loan) return res.status(404).json({ status: 404, error: `Loan with ID ## ${req.params.id} ## not found!` });

      let theAmount = parseFloat(req.body.amount);
      const theDiffrence = theAmount - loan.balance; 
      const weOfferYou = () => {
        return theDiffrence;
      }

      const repayment = {
        id: dbLoanRepayment.repayments.length +1,
        CreatedOn: new Date(),
        loanId: loan.loanId,
        amount: theAmount,
        OfferAmount: loan.balance - theAmount,
      };
      //check loan status if is approved
      if (loan.status ==='pending' || loan.status ==='rejected') 
      { 
        return res.status(400).json({ status: 400 ,message: `Oops Nothing to repay! Your Loan Application on [ ${loan.CreatedOn} ] for [ ${loan.amount} ] still Pending or rejected!` });
      }      
      if (loan.balance === 0) {
        return res.status(400).json({status:400 ,message:`Oops Nothing to repay, You have paid your loan!`});
      }

      else {
        if (repayment.amount >= loan.balance ) {
          loan.balance = 0;
          loan.repaid = "true";
          dbLoanRepayment.repayments.push(repayment);
          return res.status(201).json({
            status:201,
            message:`Repayment Created Successfully and You repay over-Amount! We of offer you [ ${weOfferYou()} ]`,
            data:{
              id:repayment.id,
              loanId:loan.loanId,
              CreatedOn:new Date(),
              amount:loan.amount,
              monthlyInstallment:loan.paymentInstallment,
              paidAmount:repayment.amount,
              balance:loan.balance,
            },
          });
        }
        else {
          loan.balance = loan.balance - theAmount;

          dbLoanRepayment.repayments.push(repayment);

          return res.status(201).json({
            status:201,
            message:'Repayment Created Successfully!',
            data:{
              id:repayment.id,
              loanId:loan.loanId,
              CreatedOn:new Date(),
              amount:loan.amount,
              monthlyInstallment:loan.paymentInstallment,
              paidAmount:repayment.amount,
              balance:loan.balance,
            },
          });
        }
      }
    }
    else {
      return res.status(400).json({ status: 400, message: 'Oops! You dont have a right to repay a loan, call Admin!' });
    }
  },
  allRepaymentLoan(req, res) {
    if (!dbLoanRepayment.repayments.length) return res.status(404).json({ status: 404, message: 'No Repayment Created Yet!' });
    return res.status(200).json({ status: 200, data: dbLoanRepayment.repayments });
  },
};
export default loanController;
