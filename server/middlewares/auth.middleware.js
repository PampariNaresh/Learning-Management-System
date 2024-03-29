import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken"

const isLoggedIn = async function (req, res, next) {
    const { token } = req.cookies;
    if (!token) {
        return next(new AppError("Unauthenticated please login", 401));
    }
    const tokenDetails = await jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenDetails) {
        return next(new AppError("Unauthorized, please login to continue", 401));
    }
    req.user = tokenDetails;
    next();
}

const authorizedRoles = (...roles) => (req, res, next) => {
    const currentRole = req.user.role;
    if (!roles.includes(currentRole)) {
        return next(new AppError(" You Do not have permission to access this route", 401));
    }
    next();
}

const authorizedSubscriber = async (req, res, next) => {
    const subscriptionStatus = req.user.subscription.status;
    const currentRole = req.user.role;
    if (currentRole !== "ADMIN" && subscriptionStatus !== 'active') {
        return next(new AppError("Please Subscribe to access this Course", 403));
    }
    next();
}
export {
    isLoggedIn,
    authorizedRoles, authorizedSubscriber
}