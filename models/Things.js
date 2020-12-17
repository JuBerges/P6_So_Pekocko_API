const { ObjectID } = require("bson");
const mongoose = require("mongoose");

const thingSchema = mongoose.Schema({
  id: { type: ObjectID, required: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: false },
  dislikes: { type: Number, required: false },
  usersLiked: { type: [Number], required: false },
  usersDisliked: { type: [Number], required: false },
});

module.exports = mongoose.model("Thing", thingSchema);
