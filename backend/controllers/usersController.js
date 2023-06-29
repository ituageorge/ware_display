const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncErrors');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtTokens');

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