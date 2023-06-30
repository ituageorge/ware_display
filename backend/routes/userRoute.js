const express = require('express')
const router = express.Router();

const {registerUser, logout} = require('../controllers/usersController');
const {loginUser } = require('../controllers/usersController');

router.route('/login').post(loginUser);
router.route('/register').post(registerUser);
router.route('/logout').get(logout);


module.exports=router;