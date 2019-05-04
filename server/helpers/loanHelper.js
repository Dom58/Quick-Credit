import joi from 'joi';

exports.validateLoan = (loan) => {
  const schema = joi.object().keys( {
    amount: joi.number().required(),
    tenor: joi.number().min(1).max(12).required(),
  });
  return joi.validate(loan, schema, {abortEarly: false});
};