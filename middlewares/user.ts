import { userModel } from "../Database/user.js";
import validator from "email-validator";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();



const CheckValidUser = async(req,res,next) => {
    const {name,email,password} = req.body.userinfo
    console.log({name,email,password} )
    let isUSer = await userModel.findOne({email})
    if(isUSer){
        return res.status(400).send({
            error:"User Exists"
        })
    }
    next()
}

const checkValidName =  async(req,res,next) => {
    const {name,email,password} = req.body.userinfo
    if(!name){
        return res.status(400).send({
            error:"Name not provided"
        })
    }
    if(name.length < 4){
        return res.status(400).send({
            error:"Please enter valid name"
        })
    }
    next();
}

const validateEmail =  async(req,res,next) => {
    const {name,email,password} = req.body.userinfo
    if(!email){
        return res.status(400).send({
            error:"Email not provided"
        })
    }
    
    let emailFlag = validator.validate(email)
    if(!emailFlag){
        return res.status(400).send({
            error:"Please enter valid email"
        })
    }
    next();
}

const validatePassword = async(req,res,next) => {
    const {name,email,password} = req.body.userinfo
    let re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if(!password){
        return res.status(400).send({
            error:"Password not provided"
        })
    }
   let result = re.test(password);
    console.log(result)
    if(result === false){
        return res.status(400).send({
            error:"Please Enter Valid password"
        })
    }
    next();
}

const getToken = async(req,res,next) => {
    const {email,password} = req.body.userinfo
    console.log(req.body.userinfo)

    try {
        let isUser = await userModel.findOne({email})
        // console.log(isUser,'isUser')

        if(isUser){
        let isMatched = await bcrypt.compare(password, isUser.password)
        console.log(isMatched)
             if(isMatched === false){
                return res.status(404).send({
                    error:"Either email or Password does not match"
                })
             }
            //   console.log(process.env.SIGN)
             let token = await jwt.sign({
                name:isUser.name,
                email:email,
                password:isUser.password
             },process.env.SIGN,{ expiresIn: '30m' })
             
             return res.cookie('jwt',token, { httpOnly: true, secure: true, maxAge: 3600000 }).status(201).send({
                message:"Signed in Successfully",
                token:token,
                user:isUser
             })


        }else{
            return res.status(404).send({
                error:"User not found"
            })
        }
    } catch (error) {
        console.log(error)
    }
    next();
}


const updatPassword = async(req,res,next) =>{
    let {password} = req.body.userinfo
    const {token} = req.headers

    console.log({password})
    try {
        let isUser = jwt.verify(JSON.parse(token),process.env.SIGN)
        // console.log(token)
        console.log(isUser)
        if(isUser === false){
            return res.status(404).send({
                error:"User not found"
            })
        }

        if(isUser){
        password = await bcrypt.hash(password, 12)
         let user = await userModel.updateOne({email:isUser.email},{$set : {password:password}})
         console.log(user)
         return res.status(200).send({
            message:"Password successfully updated"
         })
        }
    } catch (error) {
        res.status(400).send({
            error:"Token Expired"
        })
        console.log(error)
    }
    next();
}

const loggedinUser = async(req,res,next) =>{
    try {
        const {token} = req.headers
        if(!token){
            return res.status(400).send({
                error : "Token not provided"
            })
        }else{
            let isUser = jwt.verify(token,process.env.SIGN)
            if(isUser){
                return res.status(200).send({
                    message : isUser
                })
            }else{
                return res.status(404).send({
                    error : "User not found"
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
    next();
}
export {CheckValidUser,checkValidName,validateEmail,validatePassword,getToken,updatPassword,loggedinUser}