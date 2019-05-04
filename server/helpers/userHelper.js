import joi from 'joi';

exports.validateUser = (user) => {
  const schema = joi.object().keys( {
    firstName: joi.string().min(3).max(40).required(),
    lastName: joi.string().min(3).max(40).required(),
    email: joi.string().email({ minDomainAtoms: 2 }).required(),
    address: joi.string(),
    isAdmin: joi.boolean(),
    password: joi.string().regex(/^[a-zA-Z0-9]{6,30}$/),
  });
  return joi.validate(user, schema, {abortEarly: false});
};