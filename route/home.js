
const express = require('express');
const router = express.Router();
const homeController=require('../controller/home');

router.get('/',homeController.getSignIn)
router.post('/logincheck',homeController.getSignInCheck)
router.get('/signup',homeController.getSignUp)
router.post('/signup',homeController.getSignUpSubmitForm)
router.get('/index',homeController.getProfile)
//router.post('/savemessage',homeController.saveMessageTwo);
router.get('/fetchmessage',homeController.getMessages);
router.get('/demo',homeController.getDemo);
router.get('/loadcontacts',homeController.getContacts)
router.post('/creategroup',homeController.getCreateGroup)
router.get('/groupinfo',homeController.getGroupInfo)
router.get('/loadchat',homeController.getGroupChat);
router.get('/loadgroupcontacts',homeController.getGroupContacts);
router.post('/adminaction',homeController.getAdminAction);
router.post('/updategroupname',homeController.updateGroupName);
router.get('/loadcontactsexcluded',homeController.getExcludedContacts)
router.post('/updategroupmemberdetails',homeController.getUpdateGroupMember)
router.post('/removeuser',homeController.getRemoveUser)
router.get('/getstatus',homeController.getStatus);


module.exports=router;