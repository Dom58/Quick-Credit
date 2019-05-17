import joi from 'joi';

exports.validateLoan = (loan) => {
  const schema = joi.object().keys({
    amount: joi.number().min(1000).required().label('Loan Amount'),
    tenor: joi.number().min(1).max(12).required()
      .label('Tenor'),
  });
  return joi.validate(loan, schema, { abortEarly: false });
};
exports.validateApproveLoan = (loan) => {
  const schema = joi.object().keys({
    status: joi.string().valid('approved', 'rejected').required().label('Loan Status'),
  });
  return joi.validate(loan, schema, { abortEarly: false });
};
exports.validateRepayment = (repayment) => {
  const schema = joi.object().keys({
    amount: joi.number().min(50).required(),
  });
  return joi.validate(repayment, schema);
};
