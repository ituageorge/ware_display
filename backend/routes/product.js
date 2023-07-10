const express = require('express');
const router = express.Router();

const { 
    getProducts,
     newProduct, 
     getSingleProduct,
      updateProduct, 
      deleteProduct, 
      createProductReview, 
      getProductReviews ,
      deleteProductReviews,
      deleteReviews
     } = require('../controllers/productController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/userAuth')

router.route('/products').get( isAuthenticatedUser, getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), newProduct);

router.route('/admin/product/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);


router.route('/review').put(isAuthenticatedUser, createProductReview ) 
router.route('/reviews').get(isAuthenticatedUser, getProductReviews) 
router.route('/reviews').delete(isAuthenticatedUser, deleteReviews)  


// router.route('/review/:id').delete(isAuthenticatedUser,authorizeRoles("admin"),
// deleteProductReviews );


module.exports = router;