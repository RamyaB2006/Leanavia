const Faculty = require("../models/Faculty");
const Activity = require("../models/Activity");
const Student = require("../models/Student");
const Feedback = require("../models/FeedBack");

// Faculty Register
const facultyRegister = async (req, res) => {
  try {
    const { name, email } = req.body;

    const existing = await Faculty.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Faculty already registered" });
    }

    const faculty = new Faculty({ name, email });
    await faculty.save();

    res
      .status(201)
      .json({ message: "Faculty registered successfully", faculty });
  } catch (error) {
    res.status(500).json({ message: "Error registering faculty", error });
  }
};

// Faculty Login
const facultyLogin = async (req, res) => {
  try {
    const { email } = req.body;

    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json({ message: "Login successful", faculty });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Change status of an activity
const changeActivityStatus = async (req, res) => {
  try {
    const { activityId, status } = req.body;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    activity.status = status;
    await activity.save();

    res.status(200).json({ message: "Activity status updated", activity });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};

// Add feedback to activity of student
const addFeedback = async (req, res) => {
  try {
    const { facultyId, studentId, activityId, feedbackText } = req.body;

    const faculty = await Faculty.findById(facultyId);
    const student = await Student.findById(studentId);
    const activity = await Activity.findById(activityId);

    if (!faculty || !student || !activity) {
      return res
        .status(404)
        .json({ message: "Faculty, Student or Activity not found" });
    }

    const feedback = new Feedback({
      feedback: feedbackText,
      faculty: facultyId,
      student: studentId,
      activity: activityId,
    });

    await feedback.save();

    // push feedback ref to faculty + activity
    faculty.feedbacks.push(feedback._id);
    await faculty.save();

    activity.feedbacks.push(feedback._id);
    await activity.save();

    res.status(201).json({ message: "Feedback added successfully", feedback });
  } catch (error) {
    res.status(500).json({ message: "Error adding feedback", error });
  }
};

// Get single faculty
const getSingleFaculty = async (req, res) => {
  try {
    const { facultyId } = req.body;

    const faculty = await Faculty.findById(facultyId).populate("feedbacks");
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty", error });
  }
};

// Get all faculty
const getAllFaculty = async (req, res) => {
  try {
    const faculties = await Faculty.find().populate("feedbacks");
    res.status(200).json(faculties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculties", error });
  }
};

module.exports = {
  facultyRegister,
  facultyLogin,
  changeActivityStatus,
  addFeedback,
  getSingleFaculty,
  getAllFaculty,
};
