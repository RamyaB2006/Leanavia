const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    portfolios: [
      {
        type: String,

      },
    ],
    portfolioDetails: {
      phone: String,
      college: String,
      department: String,
      year: Number,
      gpa: Number,
      summary: String,
      linkedin: String,
      github: String,
      skills: [String],
      interests: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
