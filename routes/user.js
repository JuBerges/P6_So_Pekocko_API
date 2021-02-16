const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const ExpressBrute = require("express-brute"); //====>Prevent brute force attack
const store = new ExpressBrute.MemoryStore(); //===> Stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);

//====>||SIGN UP||<====\\
router.post("/signup", userCtrl.signup);

//====>||SIGN IN||<====\\
router.post(
    "/login",
    bruteforce.prevent, //====> error 429 if we hit this route too often
    userCtrl.login
);

module.exports = router;