const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema({
  feedback: {
    type: String,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
  },
},{
    timestamps:true
});

const Feedback = mongoose.model("Feedback" , feedbackSchema)
module.exports = Feedback