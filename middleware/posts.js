const asyncHandler = require('express-async-handler');
const { isValidObjectId } = require('mongoose');
const { body, validationResult } = require('express-validator');
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

exports.sanitizePostUpdate = [
  (req, res, next) => {
    if (req.body.published) {
      req.body.published = req.body.published.trim();
    }
    next();
  },

  // no need to check if empty - won't be included in PATCH if so
  body('text')
    .trim()
    .escape(),

  // no need to check if empty - won't be included in PATCH if so
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
