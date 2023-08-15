const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { isValidObjectId } = require('mongoose');
const Post = require('../models/post');

exports.getAllPosts = asyncHandler(async (req, res) => {
  const allPosts = await Post.find({})
    .populate('author', 'name -_id')
    .sort({ timestamp: -1 });
  if (!allPosts.length) {
    res.status(404).json({
      status: 404,
      message: 'Posts not found',
    });
  } else {
    res.json({ status: 200, posts: allPosts });
  }
});

exports.getSinglePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    res.status(400).json({
      status: 400,
      message: `Bad request - invalid post ID (${id})`,
    });
  } else {
    const post = await Post.findById(id).populate('author', 'name -_id');
    if (!post) {
      res.status(404).json({
        status: 404,
        messasge: `Post not found (${id})`,
      });
    } else {
      res.json(post);
    }
  }
});

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
