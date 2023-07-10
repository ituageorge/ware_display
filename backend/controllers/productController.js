const Product = require('../models/product')

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')

// Create new product => /api/v1/product/new
exports.newProduct = catchAsyncErrors ( async (req, res, next) => {
    const apiFeatures = new APIFeatures(Product.find(), )

    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})

//Get all products => /api/v1/products
exports.getProducts = catchAsyncErrors (async (req, res, next) => {
    const resPerPage = 4;
    const productCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage)
    const products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: products.length,
        productCount,
        products
    })
})

//Get single product => /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors (async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product) {
    //   return res.status(404).json({
    //     success: false, 
    //     message: 'Product not found'
    //   })
    return next(new ErrorHandler('Product not found', 404))
    }

    res.status(200).json({
        success: true,
        product
    })
})

//Update Product => /api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors (async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler('Product not found', 404))

    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })
})

//delete a Product => /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors (async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler('Product not found', 404))
    }

  await Product.findByIdAndRemove(req.params.id)

    res.status(200).json({
        success: true,
        message: 'Product is deleted.'
    })
})

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


//   Get Product Reviews => /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
   const product = await Product.findById(req.query.id);

   res.status(200).json({
    success: true,
    reviews : product.reviews
   })


})

//    delete Reviews => /api/v1/reviews
exports.deleteReviews = catchAsyncErrors(async (req, res, next) => {

    const productId = req.query.productId;
  const reviewId = req.query.id;

    const product = await Product.findById(productId);
    

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }
    
    const updatedReviews = product.reviews.filter((review) => review._id.toString() !== reviewId.toString()); 

    const numberOfReviews = updatedReviews.length;

    // reviews = updatedReviews

    const ratings =
    updatedReviews.reduce((acc, item) => item.rating + acc, 0) /
    numberOfReviews;

    product.reviews = updatedReviews;
  product.ratings = ratings;
  product.numberOfReviews = numberOfReviews;

  await product.save({ validateBeforeSave: false });

    // await Product.findByIdAndUpdate(req.query.productId, {
    //     reviews,
    //     ratings,
    //     numberOfReviews
    // }, {
    //     new: true,
    //     runValidators: true,
    //     useFindAndModify: false
    // })
 
    res.status(200).json({
     success: true,
     message:'successfully deleted the Review'
    
    })
 
 
 })
 
  



  