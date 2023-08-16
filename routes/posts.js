const express = require('express');
const postsController = require('../controllers/postsController');
const commentController = require('../controllers/commentController');
const middleware = require('../middleware/custom');

const router = express.Router();

// for posts
router.delete(
  '/:postId',
  middleware.verifyUser,
  middleware.checkValidPostId,
  postsController.deletePost,
);
router.get('/', postsController.getAllPosts);
router.get(
  '/:postId',
  middleware.checkValidPostId,
  postsController.getSinglePost,
);
router.post(
  '/',
  middleware.verifyUser,
  middleware.validatePostContent,
  postsController.postNewPost,
);
router.put(
  '/:postId',
  middleware.verifyUser,
  middleware.checkValidPostId,
  postsController.updatePost,
);

// for comments (nested within posts)
router.delete(
  '/:postId/comments/:commentId',
  middleware.verifyUser,
  middleware.checkValidPostId,
  middleware.checkValidCommentId,
  commentController.deleteComment,
);
router.get(
  '/:postId/comments/',
  middleware.checkValidPostId,
  commentController.getPostComments,
);
router.get(
  '/:postId/comments/:commentId/',
  middleware.checkValidPostId,
  middleware.checkValidCommentId,
  commentController.getSingleComment,
);
router.post(
  '/:postId/comments/',
  middleware.checkValidPostId,
  commentController.postNewComment,
);
router.put(
  '/:postId/comments/:commentId',
  middleware.verifyUser,
  middleware.checkValidPostId,
  middleware.checkValidCommentId,
  commentController.updateComment,
);

module.exports = router;
