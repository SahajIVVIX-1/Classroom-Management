const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  subname: String,
  assingmentName: String,
  dueDate: Date,
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clasroom" },
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
module.exports = Assignment;
