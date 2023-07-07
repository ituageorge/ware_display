const express = require('express')
const router = express.Router();

const {registerUser, logout, forgotPassword, resetPassword} = require('../controllers/usersController');
const {loginUser } = require('../controllers/usersController');

router.route('/login').post(loginUser);
router.route('/register').post(registerUser);

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)

router.route('/logout').get(logout);


module.exports=router;