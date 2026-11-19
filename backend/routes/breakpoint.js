const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      owner: req.user._id,
    });
    const categories = {};
    feedbacks.forEach((feedback) => {
      categories[feedback.category] = (categories[feedback.category] || 0) + 1;
    });
    const results = Object.entries(categories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
    res.json({
      totalFeedbacks: feedbacks.length,
      results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
