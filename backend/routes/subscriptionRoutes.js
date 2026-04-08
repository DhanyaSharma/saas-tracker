const express = require("express");
const router = express.Router();
const { getMonthlyCost } = require("../controllers/subscriptionController");
const { getUpcomingRenewals } = require("../controllers/subscriptionController");
const { getCategoryBreakdown } = require("../controllers/subscriptionController");
const {
  addSubscription,
  getSubscriptions,
  deleteSubscription,
} = require("../controllers/subscriptionController");

// Routes
router.post("/add", addSubscription);
router.get("/all", getSubscriptions);
router.delete("/:id", deleteSubscription);
router.get("/total", getMonthlyCost);
router.get("/upcoming", getUpcomingRenewals);
router.get("/category-breakdown", getCategoryBreakdown);
module.exports = router;