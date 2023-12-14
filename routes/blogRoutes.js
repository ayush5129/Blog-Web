const express = require('express');
const { getAllBlogsController, createBlogController, updateBlogController, getSingleBlogController, deleteBlogController, getUserBlogsController } = require('../controller/blogController');

// router object
const router = express.Router();

// routes

// GET || all Blogs
router.get('/all-blog',getAllBlogsController);

// POST || create blog
router.post('/create-blog',createBlogController);

// PUT || update blog
router.put('/update-blog/:id',updateBlogController);

// GET || single blog details
router.get('/single-blog/:id',getSingleBlogController);

// DELETE || delete blog
router.delete('/delete-blog/:id',deleteBlogController);

// GET || userb blog
router.get('/userblog/:id', getUserBlogsController);

module.exports = router;