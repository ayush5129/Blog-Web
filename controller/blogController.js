const mongoose = require ("mongoose");
const blogModel = require('../models/blogModel');
const userModel = require('../models/userModel');

// GET ALL BLOGS
exports.getAllBlogsController = async (req, res) => {
    try {
        const blogs = await blogModel.find({}).populate('user');
        if (!blogs) {
            return res.status(200).send({
                success: false,
                message: "No BLogs found"
            });
        }
        return res.status(200).send({
            success: true,
            BlogCount: blogs.length,
            message: "All Blogs lists",
            blogs,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error getting all the blogs',
            error,
        });
    }
};

// Create blog
exports.createBlogController = async (req, res) => {
    try {
        const {title, description, image,user} = req.body;
        // validation
        if(!title || !description || !image || !user){
            return res.status(400).send({
                success: false,
                message: "Please provide All fields",
            })
        }
        const existingUser = await userModel.findById(user);
        if(!existingUser){
            return res.status(400).send({
                success: false,
                message: "Invalid User Id",
            });
        }

        const newBlog = new blogModel({title,description,image,user });
        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save({session});
        existingUser.blogs.push(newBlog);
        await existingUser.save({session});
        await session.commitTransaction();
        await newBlog.save();
        return res.status(201).send({
            success: true,
            message:"BLog Created",
            newBlog,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ 
            success: false,
            message: 'Error while creating the blog',
            error,
        })
    }
}
// Update blog
exports.updateBlogController = async (req,res) => {
    try {
        const {id} = req.params;
        const {title, description, image} = req.body;
        const blog = await blogModel.findByIdAndUpdate(
            id,
            {...req.body},
            {new:true}
        );
        return res.status(200).send({
            success:true,
            message:'Blog Updated Successfully',
            blog,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error while updating the blog',
            error,
        })
    }
 }

// Single BLog 
exports.getSingleBlogController = async(req,res) => {
    try {
        const {id} = req.params;
        const blog = await blogModel.findById(id);
        if(!blog){
            return res.status(404).send({
                success:false,
                message:'No such blog found by this id'
            });
        }
        return res.status(200).send({
            success:true,
            message:'Fetch single blog',
            blog,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error while getting single blog',
            error,
        });
    }
 }

// Delete Blog
exports.deleteBlogController = async(req,res) => {
    try {
        const blog = await blogModel.findByIdAndDelete(req.params.id).populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save(); 
        return res.status(200).send({
            success: true,
            message: "Deleted successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error while deleteing  blog',
            error,
        })
    }
 }

 // Get user Blog
 exports.getUserBlogsController = async(req,res) =>{
         try {
            const userBlog = await userModel.findById(req.params.id).populate("blogs");
            if(! userBlog){
                return res.status(404).send({
                    success:false,
                    message:"blogs not found with this id",
                });
            }
            return res.status(200).send({
                success:true,
                message:"user blogs",
                userBlog,
            });
         } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: 'Error in user blog',
                error, 
            });
         }
 };