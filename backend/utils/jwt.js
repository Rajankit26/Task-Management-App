import JWT from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config()

export const generateToken = (payload) => {
    return JWT.sign({payload}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

export const verifyJWT = (token) => {
    try {
        return JWT.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        console.error(`Invalid token : ${error}`)
        return null;    
    }
}