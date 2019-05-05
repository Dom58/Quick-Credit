import jwt from 'jsonwebtoken';
import validate from '../helpers/loanHelper';
import dbLoan from '../models/LoanDb';


const loanController = {
	applyLoan(req, res) {
		const { error } = validate.validateLoan(req.body);
        if (error) return res.status(400).json({ status: 400, errors: error.message });

        let theTenor = parseInt(req.body.tenor);
        let theAmount = parseFloat(req.body.amount);
        let theInterest = parseFloat(req.body.amount)*0.05;
        let thepaymentInstallment= parseFloat((theAmount+theInterest)/theTenor).toFixed(2);
        let theBalance = parseFloat(theAmount+theInterest).toFixed(2);
   		
   		const haveApplyLoan = dbLoan.loans.find(findEmail => findEmail.email === req.user.email);

        if(req.user.status ==='verified' ){

        	if (!haveApplyLoan || haveApplyLoan.repaid ==='true') {

	        	const loan = {
	        		loanId:dbLoan.loans.length +1,
	        		email:req.user.email,
	        		CreatedOn:new Date(),
		        	status:"pending",
		        	repaid:'false',
	        		tenor:theTenor,
	        		amount:theAmount,
	        		paymentInstallment:thepaymentInstallment,
	        		balance:theBalance,
	        		interest:theInterest,
	        	};


	        	dbLoan.loans.push(loan);

	        	return res.status(201).json({
	        		status:201,
	        		message:'Loan Applied Successfully, Good Luck!',
	        		data:{
	        			loanId:loan.loanId,
	        			CreatedOn:new Date(),
	        			firstName:req.user.firstName,
	        			lastName:req.user.lastName,
	        			email:req.user.email,
	        			tenor:loan.tenor,
		        		amount:loan.amount,
		        		paymentInstallment:loan.paymentInstallment,
		        		status:"pending",
		        		balance:loan.balance,
		        		interest:(loan.interest).toFixed(2),
	        		}
	        	});
        
        	}

	        else{
	        	return res.status(400).json({
	        		status:400,
	        		message:'Ooops!! You have unpaid Loan, Please repay you loan!'});
	    	}

        }

        else{
        	return res.status(400).json({status:400, message:'Sorry! Your are not yet verified, Please contact Admin !'})
        }
	},

	allLoans(req,res){
		if (req.user.isAdmin ==='true') {
			if (!dbLoan.loans.length) return res.status(404).json({ status: 404, message: 'No Loan Application Created Yet!' });
        	return res.status(200).json({ status: 200, data: dbLoan.loans });
		}

		else return res.status(400).json({status:400, message:'Sorry! You dont have a right to view loan Application history. Any question contact Admin!'});  
    },


    specificLoan(req, res){

    	if (req.user.isAdmin ==='true') {

    	const loan = dbLoan.loans.find(findLoan => findLoan.loanId === parseInt(req.params.id));
	        if (!loan) return res.status(404).json({ status: 404, error: `ID ## ${req.params.id} ## not found!` });

	        return res.status(200).json({
	        	status: 200, 
	                data: {
	                    id:loan.loanId,
	                    user:loan.email,
	                    CreatedOn:loan.CreatedOn,
	                    status:loan.status,
	                    repaid:loan.repaid,
	                    tenor:loan.tenor,
	                    amount:loan.amount,
	                    paymentInstallment:loan.paymentInstallment,
	                    balance:loan.balance,
	                    interest:loan.interest,
	                },
	        });
    	}

    	else return res.status(400).json({status:400, message:'Oops! You dont have a right to view specific loan Application history'});   
    },

    approveLoan(req, res){

    	if (req.user.isAdmin ==='true') {

    	const { error } = validate.validateApproveLoan(req.body);
        if (error) return res.status(400).json({ status: 400, errors: error.message });

    	const loan = dbLoan.loans.find(findLoan => findLoan.loanId === parseInt(req.params.id));
	        if (!loan) return res.status(404).json({ status: 404, error: `ID ## ${req.params.id} ## not found!` });

	        if (loan.status === "approved") return res.status(400).json({status:400,message: 'Loan Application Already Up-to-date(Approved)!'})
	        
	        loan.status = req.body.status;

	        return res.status(200).json({
	        	status: 200, 
	                data: {
	                    loanId:loan.loanId,
	                    loanAmount:loan.amount,
	                    tenor:loan.tenor,
	                    status:loan.status,
	                    monthlyInstallment:loan.paymentInstallment,
	                    interest:loan.interest,
	                },
	        });
    	}

    	else return res.status(400).json({status:400, message:'Oops! You dont have a right to Approve/Reject loan Application!'});   
    },

}

export default loanController;