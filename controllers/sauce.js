const Sauce = require("../models/Sauce");
const fs = require("fs");
/*        
========>|====================================|<========
========>|----------CREATE NEW SAUCE----------|<========
========>|====================================|<========
*/
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    });
    sauce
        .save()
        .then(() =>
            res.status(201).json({ message: "Votre sauce a bien été enregistrée !" })
        )
        .catch((error) => res.status(400).json({ error }));
};
/*        
========>|====================================|<========
========>|------------MODIFY SAUCE------------|<========
========>|====================================|<========
*/
exports.modifySauce = (req, res) => {
    let sauceObject = {};
    req.file ? //====> Delete old image if a new image is added
        (Sauce.findOne({
                _id: req.params.id,
            }).then((sauce) => {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlinkSync(`images/${filename}`);
            }),
            (sauceObject = {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
            })) : //====> If the update does not contain new image
        (sauceObject = {
            ...req.body,
        });
    Sauce.updateOne({
            _id: req.params.id,
        }, {
            ...sauceObject,
            _id: req.params.id,
        })
        .then(() =>
            res.status(200).json({
                message: "Sauce modifiée !",
            })
        )
        .catch((error) =>
            res.status(400).json({
                error,
            })
        );
};
/*        
========>|====================================|<========
========>|------------DELETE SAUCE------------|<========
========>|====================================|<========
*/
exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};
/*        
========>|====================================|<========
========>|-----------GET ONE SAUCE------------|<========
========>|====================================|<========
*/
exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};
/*        
========>|====================================|<========
========>|-----------GET ALL SAUCES-----------|<========
========>|====================================|<========
*/
exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};
/*        
========>|====================================|<========
========>|-------LIKE OR DISLIKE SAUCE--------|<========
========>|====================================|<========
*/
exports.likingSauce = (req, res) => {
    switch (req.body.like) {
        case 0: //====> Remove like or dislike
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    //===> Check if user hasn't already liked the sauce
                    if (sauce.usersLiked.find((user) => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                                $inc: { likes: -1 },
                                $pull: { usersLiked: req.body.userId },
                                _id: req.params.id,
                            })
                            .then(() => {
                                res
                                    .status(201)
                                    .json({ message: "Votre avis a bien été pris en compte !" });
                            })
                            .catch((error) => {
                                res.status(400).json({ error: error });
                            });
                    }
                    //====> check if user hasn't already disliked the sauce
                    if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                                $inc: { dislikes: -1 },
                                $pull: { usersDisliked: req.body.userId },
                                _id: req.params.id,
                            })
                            .then(() => {
                                res
                                    .status(201)
                                    .json({ message: "Votre avis a bien été pris en compte !" });
                            })
                            .catch((error) => {
                                res.status(400).json({ error: error });
                            });
                    }
                })
                .catch((error) => {
                    res.status(404).json({ error: error });
                });
            break;
        case 1: //====> If user like the sauce
            Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { likes: 1 },
                    $push: { usersLiked: req.body.userId },
                    _id: req.params.id,
                })
                .then(() => {
                    res
                        .status(201)
                        .json({ message: "Votre avis a bien été pris en compte !" });
                })
                .catch((error) => {
                    res.status(400).json({ error: error });
                });
            break;

        case -1: //====> If user dislike the sauce
            Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { dislikes: 1 },
                    $push: { usersDisliked: req.body.userId },
                    _id: req.params.id,
                })
                .then(() => {
                    res
                        .status(201)
                        .json({ message: "Votre avis a bien été pris en compte !" });
                })
                .catch((error) => {
                    res.status(400).json({ error: error });
                });
            break;
        default:
            console.error("Erreur, retentez plus tard");
    }
};