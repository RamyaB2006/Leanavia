const express = require("express");
const {
  deleteStudentAccount,
  deleteFacultyAccount,
  addActivityType,
  editActivityType,
  getActivityTypes,
  deleteActivityType,
} = require("../controllers/AdminController");

const router = express.Router();

// Routes (all POST as requested)
router.post("/delete-student", deleteStudentAccount);
router.post("/delete-faculty", deleteFacultyAccount);
router.post("/add-activity-type", addActivityType);
router.post("/edit-activity-type", editActivityType);
router.get("/get-activity-types", getActivityTypes);
router.post("/delete-activity-type", deleteActivityType);

module.exports = router;
