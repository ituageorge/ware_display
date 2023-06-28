const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncErrors');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

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

    const token = newUser.getJwtToken();

    res.status(201).json({
        success: true,
        token
    })
})

