const Sauce = require("../models/Sauce");

module.exports = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      req.body.oldPic = sauce.imageUrl.split("/images/")[1];
      next();
    })
    .catch((error) => res.status(500).json({ message: error }));
};
