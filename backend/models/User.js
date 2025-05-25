import mongoose from "mongoose";

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

export default mongoose.model("User", UserSchema)