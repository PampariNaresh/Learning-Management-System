import app from "./app.js";
import connectDB from "./config/dbConnection.js";
import { config } from "dotenv";
import Razorpay from "razorpay"
import cloudinary from 'cloudinary';
const PORT = process.env.PORT || 5000;
config()



cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
})
app.listen(PORT, async () => {
    await connectDB();
    console.log(`App is Running at http://localhost:${PORT}`);
})
export default app;
