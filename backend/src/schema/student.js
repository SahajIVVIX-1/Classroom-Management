const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clasroom" },
});

module.exports = mongoose.model("Student", studentSchema);
