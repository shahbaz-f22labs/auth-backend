import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema ({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:String
    },
    password:{
        type:String,
        required:true
    }
})


userSchema.pre('save', async function (next) {
    // this.isModified('password'))
    // @ts-ignore
    this.password = await bcryptjs.hash(this.password, 12)
    next()
})

const userModel =  mongoose.model("Users",userSchema)

export {userModel};