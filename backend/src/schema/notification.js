// models/User.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  announce: { type: String },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clasroom" },
});

const notification = mongoose.model("notification", notificationSchema);
module.exports = notification;
