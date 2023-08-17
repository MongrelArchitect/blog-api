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
  const { author, text } = req.body;

  const newCommentInfo = {
    lastEdited: Date.now(),
  };
  // using PATCH for this, so only update fields included in the req
  if (author !== undefined) {
    newCommentInfo.author = author || 'Anonymous';
  }
  if (text) {
    newCommentInfo.text = text;
  }

  const { commentId } = req.params;
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
    // just in case something screwed up with mongoose updating doc
    res.status(404).json({
      status: 404,
      message: `Comment not found (${commentId})`,
    });
  }
});
