import mongoose from 'mongoose';
import 'dotenv/config';

let password = process.env.password;

const connectToDatabase = async( ) =>{
    try {
        await mongoose.connect(`mongodb+srv://f22labs:${password}@cluster0.v9hmghu.mongodb.net/f22users`);
        console.log("Connected to Database")
    } catch (error) {
        console.log("Error occured in connecting to Database")
    }
} 

export default connectToDatabase;