const { default: AppError } = require("../utils/appError");
const User = require("../models/user.model")

const register = async (req, res, next) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return next(new AppError("All fields are Required", 400));
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
        return next(new AppError("Email already exists", 400));
    }
    const user = await User.create({
        fullName, email, password, avatar: {
            public_id: email,
            secure_url: ''
        }
    });
    if (!user) {
        return next(new AppError("User registration failed try again ", 400))
    }
    //TODO:upload user picture
    await user.save();
    //TODO:get JWT token in cookie
    user.password = undefined;
    res.status(200).json({
        success: true,
        message: "User registerd Successfully",
        user
    })

}
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

}
const logout = (req, res) => {

}
const getProfile = (req, res) => {

}

module.exports = {
    register, login, logout, getProfile
}