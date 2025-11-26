const express = require("express");
const {
  studentRegister,
  studentLogin,
  addPortfolios,
  savePortfolioDetails,
  getSingleStudent,
  getAllStudents,
} = require("../controllers/StudentController");

const router = express.Router();

// Routes (all POST as requested)
router.post("/register", studentRegister);
router.post("/login", studentLogin);
router.post("/add-portfolio", addPortfolios);
router.post("/save-portfolio-details", savePortfolioDetails);
router.post("/get-student", getSingleStudent);
router.get("/get-all-students", getAllStudents);

module.exports = router;
