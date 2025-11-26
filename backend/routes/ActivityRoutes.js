const express = require("express");
const {
  addActivity,
  removeActivity,
  getAllActivities,
  getSingleActivity,
} = require("../controllers/ActivityController");

const router = express.Router();

// Routes (all POST)
router.post("/add", addActivity);
router.post("/remove", removeActivity);
router.get("/get-all", getAllActivities);
router.post("/get-single", getSingleActivity);

module.exports = router;
