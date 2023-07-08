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

// Get single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors (async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if(!order){
        return next(new ErrorHandler("No product found with this id", 404))
    }
    res.status(200).json({
        success:true,
        order,
        message:"Product retrieved successfully"
    })
})

// Get logged in user order => /api/v1/orders/me
exports.getAUserOrders = catchAsyncErrors (async (req, res, next )=> {

    const orders = await Order.find({
        user: req.user.id
    })
    
    if (!orders && !orders [0] === undefined ){
        return next(new ErrorHandler (`User has not placed any orders yet`,
        404));
        };

    res.status(200).json({
        success:true,
        orders,
        message:"Product retrieved successfully"
    })
})

// Get all order => /api/v1/admin/orders/

exports.getAllOrders = catchAsyncErrors (async (req, res, next )=> {

    const orders = await Order.find()

    
    if (!orders && !orders [0] === undefined ){
        return next(new ErrorHandler (`User has not placed any orders yet`,
        404));
        };

        let totalAmount = 0
        orders.forEach(order => {
            totalAmount += order.totalPrice
        })

    res.status(200).json({
        success:true,
        count : orders.length ,
        totalAmount,
        orders,
        message:"Product retrieved successfully"
    })
})

