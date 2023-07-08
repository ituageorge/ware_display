const express = require('express')
const router = express.Router();

const {registerUser,
     logout,
      forgotPassword,
       resetPassword,
        getUserDetails,
         changeUserPasswordWhileLoggedIn,
         updateUserProfile,
         adminGetsUserDetails,
         allUsers} = require('../controllers/usersController');
const {loginUser } = require('../controllers/usersController');

const {isAuthenticatedUser, authorizeRoles } = require('../middlewares/userAuth')

router.route('/login').post(loginUser);
router.route('/register').post(registerUser);

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)

router.route('/me').get( isAuthenticatedUser, getUserDetails);
router.route('/password/update').put(isAuthenticatedUser, changeUserPasswordWhileLoggedIn);
router.route('/me/update').put(isAuthenticatedUser, updateUserProfile);


router.route('/logout').get(logout);

router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), allUsers)
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles('admin'), adminGetsUserDetails)

// adminGetsUserDetails is similar to get getUserDetails
module.exports=router;