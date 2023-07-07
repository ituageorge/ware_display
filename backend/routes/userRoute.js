const express = require('express')
const router = express.Router();

const {registerUser,
     logout,
      forgotPassword,
       resetPassword,
        getUserDetails,
         changeUserPasswordWhileLoggedIn} = require('../controllers/usersController');
const {loginUser } = require('../controllers/usersController');

const {isAuthenticatedUser } = require('../middlewares/userAuth')

router.route('/login').post(loginUser);
router.route('/register').post(registerUser);

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)

router.route('/me').get( isAuthenticatedUser, getUserDetails);
router.route('/password/update').put(isAuthenticatedUser, changeUserPasswordWhileLoggedIn);


router.route('/logout').get(logout);


module.exports=router;