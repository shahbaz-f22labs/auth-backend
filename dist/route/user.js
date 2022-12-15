var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { userModel } from "../Database/user.js";
import bodyParser from "body-parser";
const route = express.Router();
import { CheckValidUser, checkValidName, validateEmail, validatePassword, getToken, updatPassword, loggedinUser } from '../middlewares/user.js';
route.post('/user/register', bodyParser.json(), checkValidName, validateEmail, validatePassword, CheckValidUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body.userinfo;
    try {
        let user = yield new userModel({ name, email, password });
        console.log(user);
        yield user.save();
        return res.status(201).send({
            message: "User created"
        });
    }
    catch (error) {
        console.log(error);
    }
}));
route.post('/user/signin', bodyParser.json(), validateEmail, validatePassword, getToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
route.put('/user/update', bodyParser.json(), validatePassword, updatPassword, (req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
route.post('/user/detail', bodyParser.json(), loggedinUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
export { route };
