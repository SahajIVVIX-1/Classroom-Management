const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  className: String,
});

module.exports = mongoose.model("Clasroom", classroomSchema);
