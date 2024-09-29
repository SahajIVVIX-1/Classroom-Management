const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clasroom" },
  AttendType: Boolean,
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  date: Date,
});

module.exports = mongoose.model("Attendance", attendanceSchema);
