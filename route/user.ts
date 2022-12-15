import express from "express";
import { userModel } from "../Database/user.js";
import bodyParser from "body-parser";
const route = express.Router();
import {CheckValidUser,checkValidName,validateEmail,validatePassword,getToken,updatPassword,loggedinUser} from '../middlewares/user.js'


route.post('/user/register',bodyParser.json(),checkValidName,validateEmail,validatePassword,CheckValidUser,async(req,res)=>{

    const {name,email,password} = req.body.userinfo

    try {
        let user = await new userModel({name,email,password} )
        console.log(user)

        await user.save();

        return res.status(201).send({
            message:"User created"
        })
    } catch (error) {
        console.log(error)
    }
})


route.post('/user/signin',bodyParser.json(),validateEmail,validatePassword,getToken,async(req,res)=>{})

route.put('/user/update',bodyParser.json(),validatePassword,updatPassword,async(req,res)=>{})
route.post('/user/detail',bodyParser.json(),loggedinUser,async(req,res)=>{})



export {route};