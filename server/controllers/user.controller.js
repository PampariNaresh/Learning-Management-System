import fs from 'fs/promises';

import cloudinary from 'cloudinary';

import AppError from '../utils/appError.js';
import User from '../models/user.model.js';
import sendEmail from '../utils/sendEmail.js'
import crypto from "crypto"

const cookieOptions = {
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
};


const register = async (req, res, next) => {
    // Destructuring the necessary data from req object
    const { fullName, email, password } = req.body;

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
            public_id: "Dummy",
            secure_url: "Dummy"
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
            console.log(req.file);
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms', // Save files in a folder named lms
                width: 250,
                height: 250,
                gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
                crop: 'fill',
            });
            console.log(result);
            if (!result || !result.secure_url) {
                console.log('Failed to upload image to Cloudinary');
                throw new Error('Failed to upload image to Cloudinary');
            }
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
                new AppError(error || 'File not uploaded, please try again', 500)
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



const login = async (req, res, next) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Email and Password are required', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!(user && (await user.comparePassword(password)))) {
        return next(
            new AppError('Email or Password do not match or user does not exist', 401)
        );
    }

    const token = await user.generateJWTToken();

    user.password = undefined;


    res.cookie('token', token, cookieOptions);


    res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        user
    });
};

const logout = (_req, res, _next) => {

    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "User logged out Successfully",

    });


}
const getProfile = async (req, res, _next) => {
    // Finding the user using the id from modified req object
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        message: 'User details',
        user,
    });
};

const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new AppError("Email is required", 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError("Email is not registered", 400));
    }

    const resetToken = await user.generatePasswordToken();
    await user.save();

    // We here need to send an email to the user with the token
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const subject = 'Reset Password';
    const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;

    try {
        await sendEmail(email, subject, message);
        console.log(resetPasswordUrl);

        // If email sent successfully send the success response
        res.status(200).json({
            success: true,
            message: `Reset password token has been sent to ${email} successfully`,
        });
    } catch (error) {
        // If some error happened we need to clear the forgotPassword* fields in our DB
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        await user.save();

        return next(
            new AppError(
                error.message || 'Something went wrong, please try again.',
                500
            )
        );
    }
};



const resetPassword = async (req, res, next) => {

    const { resetToken } = req.params;

    // Extracting password from req.body object
    const { password } = req.body;

    // We are again hashing the resetToken using sha256 since we have stored our resetToken in DB using the same algorithm
    const forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Check if password is not there then send response saying password is required
    if (!password) {
        return next(new AppError('Password is required', 400));
    }

    console.log(forgotPasswordToken);

    // Checking if token matches in DB and if it is still valid(Not expired)
    const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry: { $gt: Date.now() }, // $gt will help us check for greater than value, with this we can check if token is valid or expired
    });

    // If not found or expired send the response
    if (!user) {
        return next(
            new AppError('Token is invalid or expired, please try again', 400)
        );
    }

    // Update the password if token is valid and not expired
    user.password = password;

    // making forgotPassword* valus undefined in the DB
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

    // Saving the updated user values
    await user.save();

    // Sending the response when everything goes good
    res.status(200).json({
        success: true,
        message: 'Password changed successfully',
    });
};

const changePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;
    if (!oldPassword || !newPassword) {
        return next(new AppError("All fiedlds are mandatory", 400));
    }
    const user = await User.findById(id).select('+password');
    if (!user) {
        return next(new AppError("User does not exist", 400));
    }
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
        return next(new AppError("Invalid old Password", 400));
    }
    user.password = newPassword;
    await user.save();
    user.password = undefined;
    res.status(200).json({
        success: true,
        message: "Password changed successfully",
    })

};


const updateUser = async (req, res, next) => {

    const { fullName } = req.body;
    const { id } = req.params;
    console.log(id);
    const user = await User.findById(id);
    if (!user) {
        return next(new ArrError("User does not exit", 400));

    }
    if (fullName) {
        user.fullName = fullName;
    }
    if (req.file) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
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
    await user.save();
    res.status(200).json({
        success: true,
        message: "User details updated successfully",
        user
    })


}
export {
    register, login, logout, getProfile, resetPassword,
    forgotPassword, changePassword, updateUser
}




