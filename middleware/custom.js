const asyncHandler = require('express-async-handler');
const { isValidObjectId } = require('mongoose');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Comment = require('../models/comment');
const Post = require('../models/post');

exports.checkValidCommentId = asyncHandler(async (req, res, next) => {
  // ensure we've got a legit mongodb id
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    res.status(404).json({
      status: 404,
      message: `Comment not found (${commentId})`,
    });
  } else {
    // id looks legit, let's make sure we have it
    const postExists = await Comment.exists({ _id: commentId });
    if (!postExists) {
      res.status(404).json({
        status: 404,
        message: `Comment not found (${commentId})`,
      });
    } else {
      next();
    }
  }
});

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

exports.sanitizePostUpdate = [
  (req, res, next) => {
    if (req.body.published) {
      req.body.published = req.body.published.trim();
    }
    next();
  },

  body('text')
    .trim()
    .escape(),

  body('title')
    .trim()
    .escape(),
];

exports.validateNewPost = [
  body('published')
    .trim()
    .escape(),

  body('text')
    .trim()
    .escape()
    .notEmpty(),

  body('title')
    .trim()
    .escape()
    .notEmpty(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let message = 'Required fields are missing or empty: ';
      Object.keys(errors.mapped()).forEach((key, index, array) => {
        if (index === array.length - 1) {
          message += `${key}.`;
        } else {
          message += `${key}, `;
        }
      });
      res.status(400).json({
        status: 400,
        message,
      });
    } else {
      next();
    }
  },
];

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
