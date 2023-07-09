const express = require('express')
const router = express.Router();

const {newOrder, getSingleOrder, getAUserOrders, getAllOrders, updateOrder} = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/userAuth');

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').post(isAuthenticatedUser, getSingleOrder );
router.route('/orders/me').post(isAuthenticatedUser, getAUserOrders);

router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);
router.route('/admin/order/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder);

module.exports = router