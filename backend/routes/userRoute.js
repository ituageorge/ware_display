const express = require('express')
const router = express.Router();

const {registerUser} = require('../controllers/usersController');
const {loginUser } = require('../controllers/usersController');

router.route('/login').post(loginUser);
router.route('/register').post(registerUser);

module.exports=router;