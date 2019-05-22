import joi from 'joi';

exports.validateSignup = (user) => {
  const schema = joi.object().keys({
    firstname: joi.string().min(3).max(40).required().label('First Name').empty(/\s+/).trim(),
    lastname: joi.string().min(3).max(40).required()
      .label('Last Name').empty(/\s+/).trim(),
    email: joi.string().email({ minDomainAtoms: 2 }).required().label('Email'),
    address: joi.string().label('User Adress'),
    isadmin: joi.boolean().label('Admin'),
    password: joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).label('Password').empty(/\s+/).trim().error((error) => "Password is required and strong ( * mix characters and numbers) and at least 6 characters long"),
  });
  return joi.validate(user, schema, { abortEarly: false });
};

exports.validateLogin = (user) => {
  const login = {
    email: joi.string().email().required().label('Email'),
    password: joi.string().required().label("Password").empty(/\s+/).trim(),
  };
  return joi.validate(user, login, { abortEarly: false });
};

exports.validateApplication = (user) => {
  const schema = joi.object().keys({
    status: joi.string().valid('verified', 'unverified').required().label('Verification '),
  });
  return joi.validate(user, schema, { abortEarly: false });
};

