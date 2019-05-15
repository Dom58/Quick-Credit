import joi from 'joi';

exports.validateSignup = (user) => {
  const schema = joi.object().keys({
    // eslint-disable-next-line newline-per-chained-call
    firstName: joi.string().min(3).max(40).required().label('First Name').empty(/\s+/).trim(),
    lastName: joi.string().min(3).max(40).required()
      .label('Last Name').empty(/\s+/).trim(),
    email: joi.string().email({ minDomainAtoms: 2 }).required().label('Email'),
    address: joi.string().label('User Adress'),
    isAdmin: joi.boolean().label('Admin'),
    password: joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).label('Password').empty(/\s+/).trim(),
  });
  return joi.validate(user, schema, { abortEarly: false });
};

exports.validateLogin = (user) => {
  const login = {
    email: joi.string().email().required().label('Email'),
    password: joi.string().required().label("Password is Required").empty(/\s+/).trim(),
  };
  return joi.validate(user, login, { abortEarly: false });
};
