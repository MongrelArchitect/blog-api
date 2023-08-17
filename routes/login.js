const express = require('express');
const loginController = require('../controllers/loginController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  authMiddleware.checkRequest,
  authMiddleware.checkEmail,
  authMiddleware.checkPassword,
  loginController.login,
);

module.exports = router;
