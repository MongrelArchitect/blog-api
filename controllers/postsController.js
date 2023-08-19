const asyncHandler = require('express-async-handler');
const Post = require('../models/post');

exports.deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const deletedPost = await Post.findByIdAndDelete(postId);
  if (!deletedPost) {
    // no post with this id in database
    res.status(404).json({
      status: 404,
      message: `Post not found (${postId})`,
    });
  } else {
    // deleted successfully
    res.json({
      status: 200,
      message: `Post deleted (${postId})`,
    });
  }
});

exports.getAllPosts = asyncHandler(async (req, res) => {
  const filter = {};
  if (!req.user) {
    filter.published = true;
  }
  const allPosts = await Post.find(filter)
    .populate('author', 'name -_id')
    .sort({ timestamp: -1 });
  if (!allPosts.length) {
    res.status(404).json({
      status: 404,
      message: 'Posts not found',
    });
  } else {
    // simplify the 'author' for each post to be just the name
    const simpleAuthors = [];
    allPosts.forEach((post) => {
      simpleAuthors.push({ ...post._doc, author: post._doc.author.name });
    });
    res.json({ status: 200, posts: simpleAuthors });
  }
});

exports.getSinglePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  let post = await Post.findById(postId, '-__v').populate(
    'author',
    'name -_id',
  );
  // simplify 'author' value
  post = { ...post._doc, author: post.author.name, comments: post.comments };
  res.json(post);
});

exports.postNewPost = asyncHandler(async (req, res, next) => {
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
});

exports.updatePost = asyncHandler(async (req, res) => {
  const { published, text, title } = req.body;
  const newPostInfo = {
    lastEdited: Date.now(),
  };
  // using PATCH for this, so only update fields included in the req
  if (published !== undefined) {
    newPostInfo.published = !!published;
  }
  if (text) {
    newPostInfo.text = text;
  }
  if (title) {
    newPostInfo.title = title;
  }

  const { postId } = req.params;
  const updated = await Post.findByIdAndUpdate(postId, newPostInfo, {
    new: true,
  }).populate('author', '-_id');
  if (updated) {
    res.status(200).json({
      status: 200,
      message: 'Updated successfully',
      post: { ...updated._doc, author: updated.author.name, uri: updated.uri },
    });
  } else {
    // just in case something screwed up with mongoose updating doc
    res.status(404).json({
      status: 404,
      message: `Post not found (${postId})`,
    });
  }
});
