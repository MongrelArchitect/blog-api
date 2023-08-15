const express = require('express');
const postsController = require('../controllers/postsController');

const router = express.Router();

router.get('/', postsController.getAllPosts);
router.get('/:id', postsController.getSinglePost);
router.post('/', postsController.verifyUser, postsController.postNewPost);

module.exports = router;
