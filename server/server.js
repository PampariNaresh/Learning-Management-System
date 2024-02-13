import app from "./app.js";
import connectDB from "./config/dbConnection.js";
import { config } from "dotenv";
const PORT = process.env.PORT || 5000;
config()

import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});


app.listen(PORT, async () => {
    await connectDB();
    console.log(`App is Running at http://localhost:${PORT}`);
})

