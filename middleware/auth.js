const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateUser = (req, res, next) => {
  // check for auth header and verify user
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // Extract <token> from 'Bearer <token>' in auth header
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, authInfo) => {
      if (authInfo) {
        // add to request if jwt verified
        req.user = authInfo.user;
      }
    });
  }
  next();
};

exports.authenticateUser = authenticateUser;

exports.checkEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    // incorrect email
    res.status(403).json({
      status: 403,
      message: 'Invalid email or password',
    });
  } else {
    req.tryUser = user;
    next();
  }
});

exports.checkPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const { tryUser } = req;
  const passMatch = await bcrypt.compare(password, tryUser.password);
  if (!passMatch) {
    // incorrect password
    res.status(403).json({
      status: 403,
      message: 'Invalid email or password',
    });
  } else {
    next();
  }
});

exports.checkRequest = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // didn't receive email or password in request body
    res.status(400).json({
      status: 400,
      message: 'Bad request - needs email and password',
    });
  } else {
    next();
  }
};

exports.verifyUser = [
  // will add user to request if provided a valid token
  authenticateUser,

  // check if verified user was added to the request
  (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.status(403).json({
        status: 403,
        message: 'Forbidden - authorization required',
      });
    }
  },
];
