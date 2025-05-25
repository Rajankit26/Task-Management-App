import User from "../models/User.js";
import { verifyJWT } from "../utils/jwt.js";

// Middlewars to protect routes
export const protect = async(req, res, next) => {
    try {
        let token = req.headers.authorization;

        if(token && token.startsWith("Bearer")){
            // Extracts token 
            token = token.split(" ")[1];
            const payload = verifyJWT(token)
            req.user = await User.findById(payload._id).select("-password");
            next()
        }
        else{
            res.status(401).json({
                success : false,
                message : "Unauthorized acess, no token"
            })
        }
    } catch (error) {
        res.status(401).json({
            success : false,
            message : "Token failed",
            error : error.message
        })
    }
}

// Middleware for Admin-only access
export const adimOnly = async(req, res, next) =>{
    if(req.user && req.user.role === "admin"){
        next();
    }
    else{
        res.status(403).json({
            sucess : false,
            message : "Access denied! Admin only"
        })
    }
}