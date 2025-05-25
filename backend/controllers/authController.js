import User from "../models/User.js"
import {generateToken} from "../utils/jwt.js"
import {comparePassword} from "../utils/comparePassword.js"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
dotenv.config()

/*************************
@desc Register a new user
@route POST /api/v1/auth/register
@access Public
*************************/

export const registerUser = async(req, res) => {
    try {
        const {name, email, password, profileImageUrl, adminInviteToken} = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });

        if(userExists){
            return res.status(400).json({
                success : false,
                message : "User already exists!"
            })
        }

        // Determine user role : Admin if correctt token is provided , otherwise Member
        let role = "Member";

        if(adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN){
            role = "Admin";
        }

        const user = await User.create({
            name,
            email,
            password,
            profileImageUrl,
            role
        })
         // Remove password before sending response
        user.password = undefined

        // Return user data with JWT
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            profileImageUrl : user.profileImageUrl,
            role : user.role,
            token : generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({
            sucess : false,
            message : "Server error!",
            error : error.message
        })
    }
}
/*************************
@desc Logiin User
@route POST /api/v1/auth/lognin
@access Public
*************************/

export const loginUser = async(req, res) => {
    try {
        const {email, password} =req.body;
        
        const user = await User.findOne({ email })
        if(!user){
            return res.status(401).json({
                sucess : false,
                message : "Invalid email or password"
            })
        }

        const passwordMatched = await comparePassword(password, user.password)
        if(!passwordMatched){
            return res.status(401).json({
                message : "Inavlid email or password"
            })
        }

        // Return user data with JWT
        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            role : user.role,
            profileImageUrl : user.profileImageUrl,
            token : generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({
            message : "Server error!",
            error : error.message
        })
    }
}

/*************************
@desc Get user profile
@route GET /api/v1/auth/profile
@access Private (Requires JWT)
*************************/

export const getUserProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        }
        res.status(201).json({
            success : true,
            user
        })
    } catch (error) {
        res.status(500).json({
            message : "Server Error",
            error : error.message
        })
    }
}

/*************************
@desc Update user profile
@route PUT /api/v1/auth/profile
@access Private (Requires JWT)
*************************/

export const updateUserProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user._id)

        if(!user){
            return res.status(404).json({
                message :"User not found"
            })
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password){
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(req.body.password, salt)
        }
        const updatedUser = await User.save();

        res.status(201).json({
            _id : updatedUser._id,
            name : updatedUser.name,
            email : updatedUser.email,
            role : updatedUser.role,
            token : generateToken(updatedUser._id)
        })
    } catch (error) {
        res.status(501).json({
            message : "Server error",
            error : error.message
        })
    }
}


