const express = require('express');
const postsController = require('../controllers/postsController');

const router = express.Router();

router.get('/', postsController.getAllPosts);
router.get('/:id', postsController.getSinglePost);
router.post('/', postsController.postNewPost);
router.put('/:id', postsController.updatePost);

module.exports = router;
