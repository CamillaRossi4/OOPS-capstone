const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
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
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, callback) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      return callback(null, true);
    }
    callback(new Error("Only JPG, PNG and WebP images are allowed."));
  },
});
const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "oops/ideas",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );
    stream.end(file.buffer);
  });
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
router.post("/:id/images", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Idea not found" });
    }
    const idea = await Idea.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    upload.array("images", 5)(req, res, async (error) => {
      if (error) {
        return res.status(400).json({ message: error.message });
      }
      if (!req.files || !req.files.length) {
        return res.status(400).json({ message: "Choose at least one image." });
      }
      if (idea.images.length + req.files.length > 10) {
        return res.status(400).json({
          message: "Each idea can contain up to 10 images.",
        });
      }
      const uploaded = [];
      try {
        for (const file of req.files) {
          const image = await uploadImage(file);
          uploaded.push(image);
        }
        const updated = await Idea.findOneAndUpdate(
          {
            _id: idea._id,
            owner: req.user._id,
            $expr: {
              $lte: [
                { $size: { $ifNull: ["$images", []] } },
                10 - uploaded.length,
              ],
            },
          },
          { $push: { images: { $each: uploaded } } },
          { new: true, runValidators: true },
        );
        if (!updated) {
          throw new Error(
            "The idea was deleted or has reached the image limit.",
          );
        }
        await updated.populate("project");
        await updated.populate("folders");
        res.json(updated);
      } catch (uploadError) {
        for (const image of uploaded) {
          try {
            await cloudinary.uploader.destroy(image.publicId);
          } catch (cleanupError) {
            console.error("Image cleanup error:", cleanupError.message);
          }
        }
        res.status(500).json({ message: uploadError.message });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/:id/images", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Idea not found" });
    }
    const idea = await Idea.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    const image = idea.images.find(
      (item) => item.publicId === req.body.publicId,
    );
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    const result = await cloudinary.uploader.destroy(image.publicId);
    if (result.result !== "ok" && result.result !== "not found") {
      return res.status(502).json({ message: "Could not remove the image." });
    }
    idea.images = idea.images.filter(
      (item) => item.publicId !== image.publicId,
    );
    await idea.save();
    await idea.populate("project");
    await idea.populate("folders");
    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      if (visited.has(String(current._id))) {
        return res.status(400).json({ message: "Invalid revision history." });
      }
      visited.add(String(current._id));
      revisions.push(current);
      current = await Idea.findOne({
        previousRevision: current._id,
        owner: req.user._id,
      });
    }
    for (const revision of revisions) {
      for (const image of revision.images || []) {
        const result = await cloudinary.uploader.destroy(image.publicId);
        if (result.result !== "ok" && result.result !== "not found") {
          return res
            .status(502)
            .json({ message: "Could not remove the idea images." });
        }
      }
    }
    await Idea.deleteMany({
      _id: { $in: revisions.map((revision) => revision._id) },
      owner: req.user._id,
    });
    res.json({ message: "Idea and revisions deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
