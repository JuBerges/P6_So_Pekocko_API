const express = require("express");
const router = express.Router();

const saucesCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//====>||CREATE||<====\\
router.post("/", auth, multer, saucesCtrl.createSauce);

//====>||LIKE OR DISLIKE|<====\\
router.post("/:id/like", auth, saucesCtrl.likingSauce);

//====>||UPDATE||<====\\
router.put("/:id", auth, multer, saucesCtrl.modifySauce);

//====>||DELETE||<====\\
router.delete("/:id", auth, saucesCtrl.deleteSauce);

//====>||GET ONE||<====\\
router.get("/:id", auth, saucesCtrl.getOneSauce);

//====>||GET ALL||<====\\
router.get("/", auth, saucesCtrl.getAllSauces);

module.exports = router;
