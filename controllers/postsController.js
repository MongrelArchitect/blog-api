const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');

exports.getPosts = (req, res) => {
  res.json({ message: 'GET all posts' });
};

exports.postNewPost = [
  // authenticate user & add to request
  (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, authInfo) => {
        if (authInfo) {
          req.user = authInfo.user;
        }
      });
    }
    next();
  },

  (req, res, next) => {
    // we only have a user if jwt is verified
    if (req.user) {
      next();
    } else {
      res.status(403).json({
        status: 403,
        message: 'Forbidden - authorization required',
      });
    }
  },

  asyncHandler(async (req, res, next) => {
    try {
      const post = new Post({
        author: req.user._id,
        published: req.body.published !== '',
        text: req.body.text,
        timestamp: Date.now(),
        title: req.body.title,
      });
      await post.save();
      res.set(
        'Location',
        `${req.protocol}://${req.hostname}${
          req.hostname === 'localhost' ? `:${process.env.PORT || 3000}` : null
        }/posts/${post._id}`,
      );
      res.status(201).json({
        status: 201,
        message: 'Post created successfully',
        uri: `${req.protocol}://${req.hostname}${
          req.hostname === 'localhost' ? `:${process.env.PORT || 3000}` : null
        }/posts/${post._id}`,
      });
    } catch (err) {
      next(err);
    }
  }),
];