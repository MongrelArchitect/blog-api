const asyncHandler = require('express-async-handler');
const { isValidObjectId } = require('mongoose');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');

exports.checkValidPostId = asyncHandler(async (req, res, next) => {
  // ensure we've got a legit mongodb id
  const { postId } = req.params;
  if (!isValidObjectId(postId)) {
    res.status(404).json({
      status: 404,
      message: `Post not found (${postId})`,
    });
  } else {
    // id looks legit, let's make sure we have it
    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      res.status(404).json({
        status: 404,
        message: `Post not found (${postId})`,
      });
    } else {
      next();
    }
  }
});

exports.verifyUser = (req, res, next) => {
  // check for auth header and verify user
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, authInfo) => {
      if (authInfo) {
        // add to request if jwt verified
        req.user = authInfo.user;
      }
    });
  }

  // check if verified user was added to the request
  if (req.user) {
    next();
  } else {
    res.status(403).json({
      status: 403,
      message: 'Forbidden - authorization required',
    });
  }
};
