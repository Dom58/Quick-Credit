import joi from 'joi';

exports.validateLoan = (loan) => {
  const schema = joi.object().keys( {
    amount: joi.number().required(),
    tenor: joi.number().max(12).required(),
  });
  return joi.validate(loan, schema, {abortEarly: false});
};