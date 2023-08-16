const asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const Comment = require('../models/comment');

exports.postNewComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const postExists = await Post.exists({ _id: postId });
  if (!postExists) {
    res.status(404).json({
      status: 404,
      message: `Post not found (${postId})`,
    });
  } else {
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
  }
});
