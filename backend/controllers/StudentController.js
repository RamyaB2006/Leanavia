const Student = require("../models/Student");

// Student Register
const studentRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if already exists
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Student already registered" });
    }

    const student = new Student({ name, email, password });
    await student.save();

    res
      .status(201)
      .json({ message: "Student registered successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Error registering student", error });
  }
};

// Student Login
const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email, password });
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", student });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Add Portfolio
const addPortfolios = async (req, res) => {
  try {
    const { studentId, portfolio } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.portfolios.push(portfolio);
    await student.save();

    res.status(200).json({ message: "Portfolio added successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Error adding portfolio", error });
  }
};

// Save Portfolio Details
const savePortfolioDetails = async (req, res) => {
  try {
    const { studentId, portfolioDetails } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.portfolioDetails = portfolioDetails;
    await student.save();

    res.status(200).json({
      message: "Portfolio details saved successfully",
      portfolioDetails: student.portfolioDetails
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving portfolio details", error });
  }
};

// Get Single Student
const getSingleStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    const student = await Student.findById(studentId)
      .populate("activities")
      .populate({
        path: "activities",
        populate: { path: "feedbacks" },
      });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student", error });
  }
};

// Get All Students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("activities")
      .populate({
        path: "activities",
        populate: { path: "feedbacks" },
      });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
};

module.exports = {
  studentRegister,
  studentLogin,
  addPortfolios,
  savePortfolioDetails,
  getSingleStudent,
  getAllStudents,
};
