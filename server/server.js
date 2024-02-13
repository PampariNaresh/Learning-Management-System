import app from "./app.js";
import connectDB from "./config/dbConnection.js";
import { config } from "dotenv";
const PORT = process.env.PORT || 5000;
config()

import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: 'djd60wdga',
    api_key: '187113154332457',
    api_secret: 'UZeAexNmv4FmonB7r3tOPicsPHE',
    secure: true,
});


app.listen(PORT, async () => {
    await connectDB();
    console.log(`App is Running at http://localhost:${PORT}`);
})

