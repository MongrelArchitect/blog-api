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
router.post('/', middleware.verifyUser, postsController.postNewPost);
router.put(
  '/:postId',
  middleware.verifyUser,
  middleware.checkValidPostId,
  postsController.updatePost,
);

// for comments (nested within posts)
router.post(
  '/:postId/comments/',
  middleware.checkValidPostId,
  commentController.postNewComment,
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

module.exports = router;
