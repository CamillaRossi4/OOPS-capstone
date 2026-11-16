const express = require("express");
const router = express.Router();
const Idea = require("../models/Idea");
const Project = require("../models/Project");

router.get("/", async (req, res) => {
  try {
    const keyword = String(req.query.q || req.query.tag || "").trim();
    const project = String(req.query.project || "").trim();
    const status = String(req.query.status || "").trim();
    const filter = { owner: req.user._id };
    if (keyword) {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const projects = await Project.find({
        owner: req.user._id,
        $or: [
          { title: { $regex: escaped, $options: "i" } },
          { client: { $regex: escaped, $options: "i" } },
        ],
      }).select("_id");
      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { description: { $regex: escaped, $options: "i" } },
        { tags: { $regex: escaped, $options: "i" } },
        { project: { $in: projects.map((item) => item._id) } },
      ];
    }
    if (project) filter.project = project;
    if (status) {
      if (
        !["Proposed", "Approved", "In revision", "Rejected"].includes(status)
      ) {
        return res.status(400).json({ message: "Invalid idea status." });
      }
      filter.status = status;
    }
    const ideas = await Idea.find(filter)
      .populate("project")
      .sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
