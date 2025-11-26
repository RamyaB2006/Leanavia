const express = require("express");
const {
  facultyRegister,
  facultyLogin,
  changeActivityStatus,
  addFeedback,
  getSingleFaculty,
  getAllFaculty,
} = require("../controllers/FacultyController");

const router = express.Router();

// Routes (all POST)
router.post("/register", facultyRegister);
router.post("/login", facultyLogin);
router.post("/change-status", changeActivityStatus);
router.post("/add-feedback", addFeedback);
router.post("/get-single", getSingleFaculty);
router.get("/get-all", getAllFaculty);

module.exports = router;
