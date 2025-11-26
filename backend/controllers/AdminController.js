const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const ActivityType = require("../models/AcitivityType");

// Delete Student Account
const deleteStudentAccount = async (req, res) => {
  try {
    const { studentId } = req.body;

    const student = await Student.findByIdAndDelete(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error });
  }
};

// Delete Faculty Account
const deleteFacultyAccount = async (req, res) => {
  try {
    const { facultyId } = req.body;

    const faculty = await Faculty.findByIdAndDelete(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json({ message: "Faculty account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting faculty", error });
  }
};

// Add Activity Type
const addActivityType = async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await ActivityType.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Activity type already exists" });
    }

    const type = new ActivityType({ name });
    await type.save();

    res.status(201).json({ message: "Activity type added successfully", type });
  } catch (error) {
    res.status(500).json({ message: "Error adding activity type", error });
  }
};

// Edit Activity Type
const editActivityType = async (req, res) => {
  try {
    const { typeId, newName } = req.body;

    const type = await ActivityType.findById(typeId);
    if (!type) {
      return res.status(404).json({ message: "Activity type not found" });
    }

    type.name = newName;
    await type.save();

    res
      .status(200)
      .json({ message: "Activity type updated successfully", type });
  } catch (error) {
    res.status(500).json({ message: "Error editing activity type", error });
  }
};

// Get All Activity Types
const getActivityTypes = async (req, res) => {
  try {
    const types = await ActivityType.find();
    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activity types", error });
  }
};

// Delete Activity Type
const deleteActivityType = async (req, res) => {
  try {
    const { typeId } = req.body;

    const type = await ActivityType.findByIdAndDelete(typeId);
    if (!type) {
      return res.status(404).json({ message: "Activity type not found" });
    }

    res.status(200).json({ message: "Activity type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting activity type", error });
  }
};

module.exports = {
  deleteStudentAccount,
  deleteFacultyAccount,
  addActivityType,
  editActivityType,
  getActivityTypes,
  deleteActivityType,
};
