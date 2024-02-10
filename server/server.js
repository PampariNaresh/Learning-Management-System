import app from "./app.js";
const PORT = process.env.PORT || 5000;
import { config } from "dotenv";
config()
import connectDB from "./config/dbConnection.js";

import { v2 } from 'cloudinary';
v2.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        api_key: process.env.CLOUDINARY_API_KEY,
    }
)

app.listen(PORT, async () => {
    await connectDB();
    console.log(`App is Running at http://localhost:${PORT}`);
})