const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

//====>||SIGN UP||<====\\
router.post("/signup", userCtrl.signup);

//====>||SIGN IN||<====\\
router.post("/login", userCtrl.login);

module.exports = router;
