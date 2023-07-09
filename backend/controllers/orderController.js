const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
// const order = require("../models/order");
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

// Get all orders - Admin => /api/v1/admin/orders/

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

// Update/Process order - ADMIN => /api/v1/admin/order/:id

exports.updateOrder = catchAsyncErrors (async (req, res, next )=> {

    const order = await Order.findById(req.params.id)
 
    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
      }

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('You have already delivered this order', 400))
    }

    order.orderItems.forEach(async item => {
        console.log('itemProduct', item.product)
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.orderStatus,
    order.deliveredAt = Date.now()

    await order.save()
       

    res.status(200).json({
        success: true,
        message:'successfully updated'
    })
})

// async function updateStock(id, quantity ) {
//     // get the product from db using id
//     const product = await Product.findById(id);
//     product.stock = product.stock - quantity;

//     product.save()

// }


async function updateStock(id, quantity) {
    // Get the product from the database using id
    const product = await Product.findById(id);
  
    if (!product) {
      throw new ErrorHandler('Product not found', 404);
    }
  
    product.stock = product.stock - quantity;
  
    await product.save({ validateBeforeSave: false});
  }
  

  // Delete order => /api/v1/admin/order/:id

exports.deleteOrder = catchAsyncErrors (async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("No product found with this id", 404))
    }

    // await order.remove()
    await order.deleteOne()

    res.status(200).json({
        success:true,
        message:"Product removed successfully"
    })
})
