const express = require('express');
const postsController = require('../controllers/postsController');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');
const commentMiddleware = require('../middleware/comments');
const postMiddleware = require('../middleware/posts');

const router = express.Router();

// for posts

// delete a single post
router.delete(
  '/:postId',
  authMiddleware.verifyUser,
  postMiddleware.checkValidPostId,
  postsController.deletePost,
);

// get all posts
router.get('/', postsController.getAllPosts);

// get a single post
router.get(
  '/:postId',
  postMiddleware.checkValidPostId,
  postsController.getSinglePost,
);

// update a single post
router.patch(
  '/:postId',
  authMiddleware.verifyUser,
  postMiddleware.checkValidPostId,
  postMiddleware.sanitizePostUpdate,
  postsController.updatePost,
);

// create a new post
router.post(
  '/',
  authMiddleware.verifyUser,
  postMiddleware.validateNewPost,
  postsController.postNewPost,
);

// for comments (nested within posts)

// delete a single comment
router.delete(
  '/:postId/comments/:commentId',
  authMiddleware.verifyUser,
  postMiddleware.checkValidPostId,
  commentMiddleware.checkValidCommentId,
  commentController.deleteComment,
);

// get all comments for a particular post
router.get(
  '/:postId/comments/',
  postMiddleware.checkValidPostId,
  commentController.getPostComments,
);

// get a single comment for a particular post
router.get(
  '/:postId/comments/:commentId/',
  postMiddleware.checkValidPostId,
  commentMiddleware.checkValidCommentId,
  commentController.getSingleComment,
);

// update a single comment for a particular post
router.patch(
  '/:postId/comments/:commentId',
  authMiddleware.verifyUser,
  postMiddleware.checkValidPostId,
  commentMiddleware.checkValidCommentId,
  commentMiddleware.sanitizeCommentUpdate,
  commentController.updateComment,
);

// create a new comment for a particular post
router.post(
  '/:postId/comments/',
  postMiddleware.checkValidPostId,
  commentMiddleware.validateNewComment,
  commentController.postNewComment,
);

module.exports = router;
