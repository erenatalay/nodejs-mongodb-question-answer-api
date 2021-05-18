const express = require("express");
const questions = require("./question");
const auth = require("./auth");
const users = require("./user");
const admin = require("./admin");
//API
const router = express.Router();


router.use("/questions",questions);
router.use("/auth",auth);
router.use("/users",users);
router.use("/admin",admin)

module.exports = router;