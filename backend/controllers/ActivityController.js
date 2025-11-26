const Activity = require("../models/Activity");
const Student = require("../models/Student");

// Add Activity by a specific student
const addActivity = async (req, res) => {
  try {
    const { studentId, title, type, uploadProof } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const activity = new Activity({
      title,
      type,
      uploadProof,
      uploadedBy: studentId,
    });

    await activity.save();

    // push activity id to student.activities
    student.activities.push(activity._id);
    await student.save();

    res.status(201).json({ message: "Activity added successfully", activity });
  } catch (error) {
    res.status(500).json({ message: "Error adding activity", error });
  }
};

// Remove Activity
const removeActivity = async (req, res) => {
  try {
    const { activityId, studentId } = req.body;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // remove from student.activities
    await Student.findByIdAndUpdate(studentId, {
      $pull: { activities: activityId },
    });

    // remove activity itself
    await Activity.findByIdAndDelete(activityId);

    res.status(200).json({ message: "Activity removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing activity", error });
  }
};

// Get All Activities
const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("uploadedBy", "name email")
      .populate("feedbacks");

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activities", error });
  }
};

// Get Single Activity
const getSingleActivity = async (req, res) => {
  try {
    const { activityId } = req.body;

    const activity = await Activity.findById(activityId)
      .populate("uploadedBy", "name email")
      .populate("feedbacks");

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activity", error });
  }
};

module.exports = {
  addActivity,
  removeActivity,
  getAllActivities,
  getSingleActivity,
};
