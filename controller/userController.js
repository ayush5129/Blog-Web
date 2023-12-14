const userModel = require('../models/userModel');
const bcrypt = require("bcrypt");
// create user register user
exports.registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body
        //validation
        if (!username || !email || !password) {
            return res.status(400).send({
                success: false,
                message: "Please provide username and password"
            });
        }
        // existing user
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(401).send({
                success: false,
                message: "usr allready exists"
            });
        }
        // hash the password
        const hashedPassword = await bcrypt.hash(password,10);
        // save new user
        const user = new userModel({ username, email, password:hashedPassword })
        await user.save();
        return res.status(201).send({
            success: true,
            message: 'new user created',
            user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error in register callback",
            success: false,
            error
        })
    }
};

// get all user
exports.getAllUser = async (req, res) => {
    try {
           const users = await userModel.find({});
           return res.status(200).send({
            userCount:users.length,
            success:true,
            message:"all user data",
            users,
           });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error in getting users",
            error
        });
    }
};
// login
exports.loginController = async(req,res) => {
    try {
        const {email,password} = req.body;
        // validation
    if(!email || !password){
        return res.status(401).send({
            success:false,
            message:'please provide both email and password'
        });
    }
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(200).send({
            success:false,
            message:'email not register',
        });
    }
    // password check
    const isMatchedPassword = await bcrypt.compare(password,user.password);
    if(!isMatchedPassword){
        return res.status(401).send({
            success:false,
            message:"invalid username or password"
        })
    }
    return res.status(200).send({
        success:true,
        message:'login succesfully',
        user
    });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"error in login callback",
            error
        })
    }
 };