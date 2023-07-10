// exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
//     const { rating, comment, productId } = req.body;
    
//     // Check if the user is authenticated
//     if (!req.user) {
//       return next(new ErrorHandler("User not authenticated", 401));
//     }
  
//     const review = {
//       user: req.user._id,
//       name: req.user.name,
//       rating: Number(rating),
//       comment,
//     };
  
//     const product = await Product.findById(productId);
  
//     if (!product) {
//       return next(new ErrorHandler("Product not found", 404));
//     }
  
//     const isReviewed = product.reviews.find(
//       (r) => r.user.toString() === req.user._id.toString()
//     );
  
//     if (isReviewed) {
//       product.reviews.forEach((review) => {
//         if (review.user.toString() === req.user._id.toString()) {
//           review.comment = comment;
//           review.rating = rating;
//         }
//       });
//     } else {
//       product.reviews.push(review);
//       product.numberOfReviews = product.reviews.length;
//     }
  
//     product.ratings =
//       product.reviews.reduce((acc, item) => item.rating + acc, 0) /
//       product.reviews.length;
  
//     await product.save({ validateBeforeSave: false });
  
//     res.status(200).json({
//       success: true,
//       product,
//       message: "Successfully reviewed the product",
//     });
//   });
  

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    // Check if the user is authenticated
    if (!req.user) {
      return next(new ErrorHandler("User not authenticated", 401));
    }
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    const isReviewed = product.reviews.find(
      (r) => r.user && r.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review.user && review.user.toString() === req.user._id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      product.reviews.push(review);
      product.numberOfReviews = product.reviews.length;
    }
  
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
      product,
      message: "Successfully reviewed the product",
    });
  });
  