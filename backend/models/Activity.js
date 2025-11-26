const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    type: {
      type: String,
    },
    uploadProof: {
      type: String,
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student"
    }, 
    status:{
        type:String,
        default:"Pending"
    },
    feedbacks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feedback",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
