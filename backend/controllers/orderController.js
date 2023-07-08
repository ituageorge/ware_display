const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Order = require("../models/order");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");


// Create a new order => /api/v1/order/new

exports.newOrder = catchAsyncErrors( async (req, res , next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        totalPrice,
        paymentMethod,
        paidAt,
        isPaid
     } = req.body;

     const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        totalPrice,
        paymentMethod,
        paidAt: Date.now(),
        isPaid,
        user : req.user._id
     })

     res.status(200).json({
        success: true,
        order
     })

})