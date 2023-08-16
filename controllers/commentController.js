const asyncHandler = require('express-async-handler');
const Comment = require('../models/comment');

exports.deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const deletedComment = await Comment.findByIdAndDelete(commentId);
  if (!deletedComment) {
    // no post with this id in database
    res.status(404).json({
      status: 404,
      message: `Comment not found (${commentId})`,
    });
  } else {
    // deleted successfully
    res.json({
      status: 200,
      message: `Comment deleted (${commentId})`,
    });
  }
});

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

exports.updateComment = asyncHandler(async (req, res) => {
  const { commentId, postId } = req.params;
  const commentToUpdate = await Comment.findById(commentId);
  const newCommentInfo = {
    author: req.body.author ? req.body.author : commentToUpdate.author,
    lastEdited: Date.now(),
    post: postId,
    text: req.body.text ? req.body.text : commentToUpdate.text,
    timestamp: commentToUpdate.timeStamp,
  };
  const updated = await Comment.findByIdAndUpdate(commentId, newCommentInfo, {
    new: true,
  });
  if (updated) {
    res.status(200).json({
      status: 200,
      message: 'Updated successfully',
      comment: { ...updated._doc, uri: updated.uri },
    });
  } else {
    res.status(404).json({
      status: 404,
      message: `Comment not found (${commentId})`,
    });
  }
});
