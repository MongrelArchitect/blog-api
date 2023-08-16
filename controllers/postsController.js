const asyncHandler = require('express-async-handler');
const Post = require('../models/post');

exports.deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedPost = await Post.findByIdAndDelete(id);
  if (!deletedPost) {
    // no post with this id in database
    res.status(404).json({
      status: 404,
      message: `Post not found (${id})`,
    });
  } else {
    // deleted successfully
    res.json({
      status: 200,
      message: `Post deleted (${id})`,
    });
  }
});

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
  const post = await Post.findById(id).populate('author', 'name -_id');
  if (!post) {
    res.status(404).json({
      status: 404,
      messasge: `Post not found (${id})`,
    });
  } else {
    res.json(post);
  }
});

exports.postNewPost = [
  asyncHandler(async (req, res, next) => {
    try {
      const post = new Post({
        author: req.user._id,
        published: !!req.body.published,
        text: req.body.text,
        timestamp: Date.now(),
        title: req.body.title,
      });
      await post.save();
      res.set('Location', post.uri);
      res.status(201).json({
        status: 201,
        message: 'Post created successfully',
        uri: post.uri,
      });
    } catch (err) {
      next(err);
    }
  }),
];

exports.updatePost = [
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const postToUpdate = await Post.findById(id);
    if (!postToUpdate) {
      res.status(404).json({
        status: 404,
        messasge: `Post not found (${id})`,
      });
    } else {
      const newPostInfo = {
        author: req.user._id,
        lastEdited: Date.now(),
        published: req.body.published
          ? !!req.body.published
          : postToUpdate.published,
        text: req.body.text || postToUpdate.text,
        timestamp: postToUpdate.timestamp,
        title: req.body.title || postToUpdate.title,
      };
      const updated = await Post.findByIdAndUpdate(id, newPostInfo, {
        new: true,
      });
      if (updated) {
        res.status(200).json({
          status: 200,
          message: 'Updated successfully',
          post: { ...updated._doc, uri: updated.uri },
        });
      }
    }
  }),
];
