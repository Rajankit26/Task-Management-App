import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    profileImageUrl : {
        type : String,
        default : null
    },
    roles : {
        type : String,
        enum : ["admin", "member"],
        default : "member"
    }
}, {timestamps : true})

UserSchema.pre("save", async function(next){
    if(!this.isModified("password"))return next()
    this.password = await bcrypt.hash(this.password,8)
    next()
})


export default mongoose.model("User", UserSchema)