
const express = require('express');
const router = express.Router();
const homeController=require('../controller/home');

router.get('/',homeController.getSignIn)
router.post('/logincheck',homeController.getSignInCheck)
router.get('/signup',homeController.getSignUp)
router.post('/signup',homeController.getSignUpSubmitForm)
router.get('/index',homeController.getProfile)

module.exports=router;