const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const Idea = require("../models/Idea");
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      owner: req.user._id,
    })
      .populate("idea")
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findOne({
      _id: req.params.id,
      owner: req.user._id,
    }).populate("idea");
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.json(feedback);
  } catch (error) {
    res.status(404).json({ message: "Feedback not found" });
  }
});
router.post("/", async (req, res) => {
  try {
    const idea = await Idea.findOne({
      _id: req.body.idea,
      owner: req.user._id,
    });
    if (!idea) {
      return res.status(400).json({ message: "Choose one of your own ideas." });
    }
    const feedback = await Feedback.create({
      idea: req.body.idea,
      comment: req.body.comment,
      category: req.body.category,
      owner: req.user._id,
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    if (req.body.idea) {
      const idea = await Idea.findOne({
        _id: req.body.idea,
        owner: req.user._id,
      });
      if (!idea) {
        return res
          .status(400)
          .json({ message: "Choose one of your own ideas." });
      }
    }
    const feedback = await Feedback.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      {
        ...(req.body.idea !== undefined && { idea: req.body.idea }),
        ...(req.body.comment !== undefined && { comment: req.body.comment }),
        ...(req.body.category !== undefined && { category: req.body.category }),
      },
      { new: true, runValidators: true },
    );
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.json({ message: "Feedback deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
