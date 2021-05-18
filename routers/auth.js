const express = require('express');
const {register,getUser,login,logout,imageUpload,forgotPassword,resetPassword,registerUser,editDetails} = require("../controllers/auth");
const {getAccesToRoute} = require("../middlewares/auth/auth");
const profileImageUpload = require("../middlewares/libraries/profileImageUpload");
const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/profile",getAccesToRoute,getUser);
router.get("/logout",getAccesToRoute,logout);
router.post("/forgotpassword",forgotPassword);
router.post("/upload",[getAccesToRoute,profileImageUpload.single("profile_image")],imageUpload);
router.put("/resetPassword",resetPassword);
router.put("/registerUser",registerUser);
router.put("/edit",getAccesToRoute,editDetails);

module.exports = router;