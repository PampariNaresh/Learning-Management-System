import AppError from "../utils/appError.js";
import User from "../models/user.model.js"
import emailvalidator from 'email-validator';
import { v2 as cloudinary } from 'cloudinary'
const cookieOptions = {
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 60 * 1000,
    httpOnly: true,
}

// const register = async (req, res, next) => {
//     const { fullName, email, password } = req.body;
//     if (!fullName || !email || !password) {
//         return next(new AppError("All fields are Required", 400));
//     }
//     const userExist = await User.findOne({ email });
//     if (userExist) {
//         return next(new AppError("Email already exists", 400));
//     }
//     if (!emailvalidator.validate(email)) {
//         return next(new AppError('Please fill the valid Email', 400));
//     }
//     const user = await User.create({
//         fullName, email, password, avatar: {
//             public_id: email,
//             secure_url: "https://res.cloudinary.com/djd60wdga/image/upload/v1707572495/cld-sample-2.jpg",
//         }
//     });
//     if (!user) {
//         return next(new AppError("User registration failed try again ", 400))
//     }
//     //TODO:upload user picture
//     console.log(JSON.stringify(req.file));

//     if (req.file) {
//         try {
//             const result = await cloudinary.v2.uploader(req.file.path
//                 , {
//                     folder: 'lms',
//                     width: 250,
//                     height: 250, gravity: 'faces', crop: 'fill'
//                 })
//             if (result) {
//                 user.avatar.public_id = result.public_id;
//                 user.avatar.secure_url = result.secure_url;
//                 //after upload remove from local server
//                 //fs.rm(`uploads/${req.file.filename}`);
//             }


//         } catch (e) {
//             return next(new AppError("File not uploaded Please Try Again", 400))

//         }
//     }
//     await user.save();
//     //TODO:get JWT token in cookie
//     user.password = undefined;
//     res.status(200).json({
//         success: true,
//         message: "User registerd Successfully",
//         user
//     })

// }
const register = async (req, res, next) => {
    const { fullName, email, password, avatar } = req.body;

    // Check if the data is there or not, if not throw error message
    if (!fullName || !email || !password) {
        return next(new AppError('All fields are required', 400));
    }

    // Check if the user exists with the provided email
    const userExists = await User.findOne({ email });

    // If user exists send the reponse
    if (userExists) {
        return next(new AppError('Email already exists', 409));
    }

    // Create new user with the given necessary data and save to DB
    const user = await User.create({
        fullName,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url:
                'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
        },
    });

    // If user not created send message response
    if (!user) {
        return next(
            new AppError('User registration failed, please try again later', 400)
        );
    }

    // Run only if user sends a file
    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms', // Save files in a folder named lms
                width: 250,
                height: 250,
                gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
                crop: 'fill',
            });

            // If success
            if (result) {
                // Set the public_id and secure_url in DB
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;

                // After successful upload remove the file from local storage
                fs.rm(`uploads/${req.file.filename}`);
            }
        } catch (error) {
            return next(
                new AppError(error || 'File not uploaded, please try again', 400)
            );
        }
    }

    // Save the user object
    await user.save();

    // Generating a JWT token
    const token = await user.generateJWTToken();

    // Setting the password to undefined so it does not get sent in the response
    user.password = undefined;

    // Setting the token in the cookie with name token along with cookieOptions
    res.cookie('token', token, cookieOptions);

    // If all good send the response to the frontend
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user,
    });
};


const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError("All fields are Required", 400));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || user.comparePassword(password)) { // TODO:Implement Compare Password
        return next(new AppError("Email or password do not match", 400));
    }
    const token = await user.generateJWTTOken();
    user.password = undefined;
    res.cookie('token', token, cookieOptions);
    res.status(200).json({
        success: true,
        message: "User registered successfully".
            user
    });



}
const logout = (req, res) => {

    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true,
    });
    res.status(200).json({
        success: tru,
        message: "User logged out Successfully",
    });

}
const getProfile = (req, res) => {

    const user = User.findById(req.user.id);
    res.status(200).json({
        success: true,
        message: 'User Details',
        user
    })

}

export {
    register, login, logout, getProfile
}