const express = require('express');
const postsController = require('../controllers/postsController');
const commentController = require('../controllers/commentController');
const middleware = require('../middleware/custom');

const router = express.Router();

// for posts

// delete a single post
router.delete(
  '/:postId',
  middleware.verifyUser,
  middleware.checkValidPostId,
  postsController.deletePost,
);

// get all posts
router.get('/', postsController.getAllPosts);

// get a single post
router.get(
  '/:postId',
  middleware.checkValidPostId,
  postsController.getSinglePost,
);

// update a single post
router.patch(
  '/:postId',
  middleware.verifyUser,
  middleware.checkValidPostId,
  middleware.sanitizePostUpdate,
  postsController.updatePost,
);

// create a new post
router.post(
  '/',
  middleware.verifyUser,
  middleware.validateNewPost,
  postsController.postNewPost,
);

// for comments (nested within posts)

// delete a single comment
router.delete(
  '/:postId/comments/:commentId',
  middleware.verifyUser,
  middleware.checkValidPostId,
  middleware.checkValidCommentId,
  commentController.deleteComment,
);

// get all comments for a particular post
router.get(
  '/:postId/comments/',
  middleware.checkValidPostId,
  commentController.getPostComments,
);

// get a single comment for a particular post
router.get(
  '/:postId/comments/:commentId/',
  middleware.checkValidPostId,
  middleware.checkValidCommentId,
  commentController.getSingleComment,
);

// update a single comment for a particular post
router.patch(
  '/:postId/comments/:commentId',
  middleware.verifyUser,
  middleware.checkValidPostId,
  middleware.checkValidCommentId,
  middleware.sanitizeCommentUpdate,
  commentController.updateComment,
);

// create a new comment for a particular post
router.post(
  '/:postId/comments/',
  middleware.checkValidPostId,
  middleware.validateNewComment,
  commentController.postNewComment,
);

module.exports = router;
