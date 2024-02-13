import AppError from "../utils/appError.js"
import User from "../models/user.model.js"
import { razorpay } from '../server.js';

export const getRazorpayApiKey = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: "Razorpay API Key",
            key: RAZORPAY_KEY_ID
        })

    } catch (e) {
        return next(new AppError(e.message, 500));
    }


}
export const buySubscription = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);
        if (!user) {
            return next(new AppError("Unauthorized Please login", 500));
        }
        if (user.role === 'ADMIN') {
            return next(new AppError("Admin cannot purchase a subscription", 500));
        }

        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID,
            customer_notify: 1
        });
        //Update user Model with subscription
        user.subscription.id = subscription.id;
        user.subscription.staus = subscription.status;

        await user.save();
        res.status({
            sucess: true,
            message: "Subscribed Successfully",
        })


    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}
export const verifySubscription = async (req, res, next) => {
    try {

        const { id } = req.user;


    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}
export const cancelSubscription = async (req, res, next) => {
    try {

    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}
export const getAllPayments = async (req, res, next) => {
    try {

    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}