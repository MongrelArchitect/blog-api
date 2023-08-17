const asyncHandler = require('express-async-handler');
const { isValidObjectId } = require('mongoose');
const validator = require('validator');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/comment');

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

exports.sanitizeCommentUpdate = [
  // controller checks for an empty string to replace author with
  // 'Anonymous' so we can't use express-validator here
  (req, res, next) => {
    if (req.body.author) {
      req.body.author = req.body.author.trim();
      req.body.author = validator.escape(req.body.author);
    }
    next();
  },

  // no need to check if empty - won't be included in PATCH if so
  body('text')
    .trim()
    .escape(),
];

exports.validateNewComment = [
  // no need to check empty - will be replaced with 'Anonymous' if so
  body('author')
    .trim()
    .escape(),

  body('text')
    .trim()
    .escape()
    .notEmpty(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 400,
        message: 'Required fields are missing or empty: text.',
      });
    } else {
      next();
    }
  },
];
