const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

exports.postLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // didn't receive email or password in request body
    res.status(400).json({
      status: 400,
      message: 'Bad request - needs email and password',
    });
  } else {
    const sean = await User.findOne({ email });
    if (!sean) {
      // incorrect email
      res.status(404).json({
        status: 404,
        message: 'User not found',
      });
    } else {
      // correct email, check password
      try {
        const passMatch = await bcrypt.compare(password, sean.password);
        if (!passMatch) {
          // incorrect password
          res.status(403).json({
            status: 403,
            message: 'Incorrect password',
          });
        } else {
          // correct password
          jwt.sign(
            { sean },
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
              if (err) {
                // jwt error
                next(err);
              } else {
                res.json({
                  message: `Welcome, ${sean.name}!`,
                  token,
                });
              }
            },
          );
        }
      } catch (err) {
        // bcrypt error
        next(err);
      }
    }
  }
});
