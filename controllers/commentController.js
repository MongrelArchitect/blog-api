const asyncHandler = require('express-async-handler');
const Comment = require('../models/comment');

exports.getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId }).sort({
    timestamp: 1,
  });
  if (!comments) {
    res.status(404).json({
      status: 404,
      message: `Comments not found for post ${postId}`,
    });
  } else {
    res.json(comments);
  }
});

exports.getSingleComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  res.json(comment);
});

exports.postNewComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  if (req.body.author) {
    req.body.author = req.body.author.trim();
  }
  const comment = new Comment({
    author: !req.body.author ? 'Anonymous' : req.body.author,
    post: postId,
    text: req.body.text,
    timestamp: Date.now(),
  });
  await comment.save();
  res.set('Location', comment.uri);
  res.status(201).json({
    status: 201,
    message: 'Comment created successfully',
    uri: comment.uri,
  });
});
