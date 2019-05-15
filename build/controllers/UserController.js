"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _userHelper = _interopRequireDefault(require("../helpers/userHelper"));

var _UserDB = _interopRequireDefault(require("../models/UserDB"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var userController = {
  signup: function signup(req, res) {
    var _validate$validateSig = _userHelper["default"].validateSignup(req.body),
        error = _validate$validateSig.error;

    var arrErrors = [];

    var allValdatorFunct = function allValdatorFunct() {
      for (var i = 0; i < error.details.length; i++) {
        arrErrors.push(error.details[i].message);
      }
    };

    if (error) {
      // eslint-disable-next-line no-unused-expressions
      "".concat(allValdatorFunct());
      if (error) return res.status(400).json({
        status: 400,
        errors: arrErrors
      });
    } else {
      var emailExist = _UserDB["default"].users.find(function (findEmail) {
        return findEmail.email === req.body.email;
      });

      if (emailExist) return res.status(409).json({
        status: 409,
        error: 'Email is already registed!'
      });

      if (req.body.isAdmin === 'true') {
        var _user = {
          id: _UserDB["default"].users.length + 1,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          status: 'verified',
          isAdmin: req.body.isAdmin,
          password: _bcrypt["default"].hashSync(req.body.password, 10)
        };

        var _token = _jsonwebtoken["default"].sign(_user, "".concat(process.env.SECRET_KEY_CODE), {
          expiresIn: '24h'
        });

        _UserDB["default"].users.push(_user);

        return res.header('Authorization', _token).status(201).json({
          status: 201,
          message: 'Admin successfully created!',
          data: {
            token: _token,
            id: _user.id,
            firstName: _user.firstName,
            lastName: _user.lastName,
            email: _user.email
          }
        });
      }
    } // signup as a client


    var user = {
      id: _UserDB["default"].users.length + 1,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      address: req.body.address,
      status: 'unverified',
      isAdmin: 'false',
      password: _bcrypt["default"].hashSync(req.body.password, 10)
    };

    var token = _jsonwebtoken["default"].sign(user, "".concat(process.env.SECRET_KEY), {
      expiresIn: '24h'
    });

    _UserDB["default"].users.push(user);

    return res.header('Authorization', token).status(201).json({
      status: 201,
      message: 'Successfully registed!',
      data: {
        token: token,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  },
  allUsers: function allUsers(req, res) {
    if (req.user.isAdmin === 'true') {
      if (!_UserDB["default"].users.length) return res.status(404).json({
        status: 404,
        message: 'No user created!'
      });
      return res.status(200).json({
        status: 200,
        data: _UserDB["default"].users
      });
    }

    return res.status(400).json({
      status: 400,
      error: 'You dont have a right to view this activity!'
    });
  },
  verifyUser: function verifyUser(req, res) {
    if (req.user.isAdmin === 'true') {
      var userEmail = _UserDB["default"].users.find(function (findEmail) {
        return findEmail.email === req.params.email;
      });

      if (!userEmail) return res.status(404).json({
        status: 404,
        message: 'Email not found!'
      });
      if (userEmail.status === 'verified') return res.status(400).json({
        status: 400,
        message: 'User account Already Up-to-date!'
      });
      userEmail.status = 'verified';
      return res.status(200).json({
        status: 200,
        message: 'User account Verified successfully!',
        data: {
          email: userEmail.email,
          firstName: userEmail.firstName,
          lastName: userEmail.lastName,
          password: userEmail.password,
          address: userEmail.address,
          status: userEmail.status
        }
      });
    }

    return res.status(400).json({
      status: 400,
      error: 'You dont have a right to verify a user account!'
    });
  },
  signin: function signin(req, res) {
    var _validate$validateLog = _userHelper["default"].validateLogin(req.body),
        error = _validate$validateLog.error;

    var arrErrors = [];

    var allValdatorFunct = function allValdatorFunct() {
      for (var i = 0; i < error.details.length; i++) {
        arrErrors.push(error.details[i].message);
      }
    };

    if (error) {
      // eslint-disable-next-line no-unused-expressions
      "".concat(allValdatorFunct());
      if (error) return res.status(400).json({
        status: 400,
        errors: arrErrors
      });
    } else {
      var user = _UserDB["default"].users.find(function (findEmail) {
        return findEmail.email === req.body.email;
      });

      if (!user) return res.status(401).json({
        status: 401,
        error: 'Incorrect Email'
      });

      var passwordCompare = _bcrypt["default"].compareSync(req.body.password, user.password);

      if (!passwordCompare) return res.status(401).json({
        status: 401,
        error: 'Incorrect Password'
      });
      var payload = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        isAdmin: user.isAdmin,
        email: user.email
      }; // sign a json web token

      var token = _jsonwebtoken["default"].sign(payload, "".concat(process.env.SECRET_KEY_CODE), {
        expiresIn: '24h'
      });

      return res.header('Authorization', token).status(200).json({
        status: 200,
        message: 'You are successfully log in into Quick Credit',
        data: {
          token: token,
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    }
  }
};
var _default = userController;
exports["default"] = _default;