const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler')
// const catchAsyncError = require('../middlewares/catchAsyncErrors');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtTokens');
const sendEmail = require('../utils/sendEmail')

const crypto = require('crypto')

//Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const {name, email, password } = req.body;
    const newUser = await User.create({
        name,
        email,
        password,
        // avatar: {
        //     public_id:'',
        //     url:''
        // }
})

    sendToken(newUser, 200, res )
})

//Login user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body;

    //check if email and password is entered by user
    if(!email || !password){
        return next(new ErrorHandler('Please provide an Email & Password!', 400))
    }

    //Finding the user in database
    let foundUser = await User.findOne({email}).select('+password');

    if(!foundUser) {
    return next(new ErrorHandler('Invalid Email or Password'))
    }

    //checks if password is correct or not
    const isPasswordMatched = await foundUser.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Credentials", 401));
    }

    // const token = foundUser.getJwtToken();
   sendToken(foundUser, 200, res)
})

// Forget Password  => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email})

    if(!user) {
        return next(new ErrorHandler('User not found with email', 404));
    }

    // get reset token
    const resetToken = user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false})

    // create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you not requested this email, then ignore it.`

    try {

        await sendEmail({
            email: user.email,
            subject:'Password Reset Link for ware display!',
            message,
        })

        res.status(200).json({
            success :true,
            message: `Email sent to: ${user.email}`
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false});
        return next(new ErrorHandler(error.message, 500))
    }
        // console.log(`Forgot Password Request for ${req.query}`)
        // const resetPassUrl=`http://localhost:${process.env.PORT}/reset-password/${
        //     crypto
        //     .createHash('sha256')
        //     .update((Math.random() * Math.pow(36, 8)).toString
        //     )
        //     .digest('hex')}?email=${encodeURIComponent(

})

// Reset New Password  => /api/v1/password/reset:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    //Hash URL TOKEN
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now()}
        });
        if (!user){
            return next(new ErrorHandler("Invalid token or expired link",400));
    }

    if(req.body.password !== req.body.comparePassword){
        return next(new ErrorHandler("Passwords do not match!",400));
    }

    //set up new password
    user.password = req.body.password;
    user.resetPasswordToken= undefined;
    user.resetPasswordExpire=undefined ;

    await user.save();

    sendToken(user, 200, res)
})


// logout user => /api/v1/logout
    exports.logout = catchAsyncErrors(async (req, res, next) => {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })

        res.status(200).json({
            success: true,
            message: 'Logged out'
        })

    })