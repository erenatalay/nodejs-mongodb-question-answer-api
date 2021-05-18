const express = require("express");
const {getAccesToRoute,getAdminAccess} = require("../middlewares/auth/auth")
const {checkUserExist} = require("../middlewares/database/databaseErrorHelpers")
const {blockUser,deleteUser} = require("../controllers/admin");
const router = express.Router();

router.use([getAccesToRoute,getAdminAccess]);
router.get("/block/:id",checkUserExist,blockUser)
router.delete("/user/:id",checkUserExist,deleteUser)

module.exports = router