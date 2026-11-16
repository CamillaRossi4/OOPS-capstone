const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Idea = require("../models/Idea");
const Project = require("../models/Project");
const Folder = require("../models/Folder");

const checkFolders = async (folders, owner) => {
  if (!Array.isArray(folders)) return false;
  const ids = [...new Set(folders)];
  if (ids.some((id) => !mongoose.isValidObjectId(id))) return false;
  const count = await Folder.countDocuments({
    _id: { $in: ids },
    owner,
  });
  return count === ids.length;
};

router.get("/", async (req, res) => {
  try {
    const ideas = await Idea.find({ owner: req.user._id })
      .populate("project")
      .populate("folders")
      .sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id/revisions", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Idea not found" });
    }
    let current = await Idea.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!current) {
      return res.status(404).json({ message: "Idea not found" });
    }
    const visited = new Set();
    while (current.previousRevision) {
      if (visited.has(String(current._id))) {
        return res.status(400).json({ message: "Invalid revision history." });
      }
      visited.add(String(current._id));
      const previous = await Idea.findOne({
        _id: current.previousRevision,
        owner: req.user._id,
      });
      if (!previous) break;
      current = previous;
    }
    const revisions = [];
    visited.clear();
    while (current) {
      if (visited.has(String(current._id))) break;
      visited.add(String(current._id));
      revisions.push(current);
      current = await Idea.findOne({
        previousRevision: current._id,
        owner: req.user._id,
      });
    }
    res.json(revisions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/revisions", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Idea not found" });
    }
    const previous = await Idea.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!previous) {
      return res.status(404).json({ message: "Idea not found" });
    }
    const next = await Idea.exists({
      previousRevision: previous._id,
      owner: req.user._id,
    });
    if (next) {
      return res.status(400).json({
        message: "This idea already has a newer revision.",
      });
    }
    const title = req.body.title;
    const description = req.body.description;
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Enter a revision title." });
    }
    if (typeof description !== "string" || !description.trim()) {
      return res.status(400).json({ message: "Enter a revision description." });
    }
    const revision = await Idea.create({
      owner: req.user._id,
      title: title.trim(),
      description: description.trim(),
      project: previous.project,
      originalIdea: previous.originalIdea,
      revisionNumber: (previous.revisionNumber || 1) + 1,
      previousRevision: previous._id,
      tags: [...previous.tags],
      folders: [...previous.folders],
      status: "In revision",
    });
    await revision.populate("project");
    await revision.populate("folders");
    res.status(201).json(revision);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const idea = await Idea.findOne({
      _id: req.params.id,
      owner: req.user._id,
    })
      .populate("project")
      .populate("folders");
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    res.json(idea);
  } catch (error) {
    res.status(404).json({ message: "Idea not found" });
  }
});

router.post("/", async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.body.project,
      owner: req.user._id,
    });
    if (!project) {
      return res.status(400).json({
        message: "Choose one of your own projects.",
      });
    }
    const folders = req.body.folders === undefined ? [] : req.body.folders;
    if (!(await checkFolders(folders, req.user._id))) {
      return res.status(400).json({ message: "Choose only your own folders." });
    }
    let originalIdea = null;
    if (req.body.originalIdea) {
      if (!mongoose.isValidObjectId(req.body.originalIdea)) {
        return res.status(400).json({ message: "Invalid original idea." });
      }
      originalIdea = await Idea.findOne({
        _id: req.body.originalIdea,
        owner: req.user._id,
      });
      if (!originalIdea) {
        return res.status(400).json({ message: "Original idea not found." });
      }
    }
    const idea = await Idea.create({
      title: req.body.title,
      description: req.body.description,
      project: project._id,
      originalIdea: originalIdea ? originalIdea._id : null,
      tags: req.body.tags,
      folders: [...new Set(folders)],
      status: req.body.status,
      owner: req.user._id,
    });
    await idea.populate("project");
    await idea.populate("folders");
    res.status(201).json(idea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const idea = await Idea.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    if (req.body.project !== undefined) {
      const project = await Project.findOne({
        _id: req.body.project,
        owner: req.user._id,
      });
      if (!project) {
        return res.status(400).json({
          message: "Choose one of your own projects.",
        });
      }
      idea.project = project._id;
    }
    if (req.body.folders !== undefined) {
      if (!(await checkFolders(req.body.folders, req.user._id))) {
        return res.status(400).json({
          message: "Choose only your own folders.",
        });
      }
      idea.folders = [...new Set(req.body.folders)];
    }
    if (req.body.title !== undefined) idea.title = req.body.title;
    if (req.body.description !== undefined) {
      idea.description = req.body.description;
    }
    if (req.body.tags !== undefined) idea.tags = req.body.tags;
    if (req.body.status !== undefined) idea.status = req.body.status;
    await idea.save();
    await idea.populate("project");
    await idea.populate("folders");
    res.json(idea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const idea = await Idea.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    res.json({ message: "Idea deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
