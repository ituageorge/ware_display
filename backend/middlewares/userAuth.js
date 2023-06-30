const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const User = require("../models/user");

// check if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies
    
    if(!token) {
        return next(new ErrorHandler('Login first to access this resource'))
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret" // secret key for signing the JWT tokens
    );
    
    req.user = await User.findById(decoded.id);
    next();
})

// handling users roles and permissions
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(
            new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403))
        }
        next();
    }
}