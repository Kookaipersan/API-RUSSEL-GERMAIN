// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

router.get("/", auth, dashboardController.showDashboard);

module.exports = router;
