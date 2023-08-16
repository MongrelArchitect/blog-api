const express = require('express');
const postsController = require('../controllers/postsController');
const commentController = require('../controllers/commentController');
const middleware = require('../middleware/custom');

const router = express.Router();

// for posts
router.delete(
  '/:id',
  middleware.verifyUser,
  middleware.checkValidPostId,
  postsController.deletePost,
);
router.get('/', postsController.getAllPosts);
router.get('/:id', middleware.checkValidPostId, postsController.getSinglePost);
router.post('/', middleware.verifyUser, postsController.postNewPost);
router.put(
  '/:id',
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

module.exports = router;
