const express = require("express");
const router = express.Router();

const saucesCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const getOldPic = require("../middleware/deleteOldPic");
const checkForm = require("../middleware/checkIfFormValid");

router.post("/", auth, multer, saucesCtrl.createSauce);

router.put("/:id", auth, multer, saucesCtrl.modifySauce);

router.delete("/:id", auth, saucesCtrl.deleteSauce);

router.get("/:id", auth, saucesCtrl.getOneSauce);

router.get("/", auth, saucesCtrl.getAllSauces);

module.exports = router;
