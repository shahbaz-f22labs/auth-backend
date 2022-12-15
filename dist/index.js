import express from "express";
import cors from 'cors';
import connectToDatabase from "./Database/index.js";
import { route } from "./route/user.js";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(route);
let port = process.env.PORT || 8080;
connectToDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at ${port}`);
    });
});
