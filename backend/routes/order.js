const express = require('express')
const router = express.Router();

const {newOrder, getSingleOrder, getAUserOrders, getAllOrders} = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/userAuth');

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').post(isAuthenticatedUser, getSingleOrder );
router.route('/orders/me').post(isAuthenticatedUser, getAUserOrders);

router.route('/admin/orders').post(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);

module.exports = router