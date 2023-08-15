const express = require('express');
const postsController = require('../controllers/postsController');
const commentController = require('../controllers/commentController');

const router = express.Router();

// for posts
router.delete('/:id', postsController.verifyUser, postsController.deletePost);
router.get('/', postsController.getAllPosts);
router.get('/:id', postsController.getSinglePost);
router.post('/', postsController.verifyUser, postsController.postNewPost);
router.put('/:id', postsController.verifyUser, postsController.updatePost);

// for comments (nested within posts)
router.post('/:postId/comments/', commentController.postNewComment);

module.exports = router;
