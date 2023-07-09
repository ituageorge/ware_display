// Update/Process order - ADMIN => /api/v1/admin/order/:id

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const orderId = req.params.id;
  
    const order = await Order.findById(orderId);
  
    if (!order) {
      return next(new ErrorHandler('Order not found', 404));
    }
  
    if (order.orderStatus === 'Delivered') {
      return next(new ErrorHandler('You have already delivered this order', 400));
    }
  
    try {
      for (const item of order.orderItems) {
        await updateStock(item.product, item.quantity);
      }
  
      order.orderStatus = req.body.orderStatus;
      order.deliveredAt = Date.now();
  
      await order.save();
  
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
  
  async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);
  
    if (!product) {
      throw new ErrorHandler('Product not found', 404);
    }
  
    product.stock -= quantity
  
    await product.save();
  }
  