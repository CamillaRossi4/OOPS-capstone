const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Project = require("../models/Project");
const Idea = require("../models/Idea");
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
const uploadImage = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "oops/projects", resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(file.buffer);
  });
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(404).json({ message: "Project not found" });
  }
});
router.post("/:id/images", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Project not found" });
    }
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    upload.array("images", 5)(req, res, async (error) => {
      if (error) return res.status(400).json({ message: error.message });
      if (!req.files?.length) {
        return res.status(400).json({ message: "Choose at least one image." });
      }
      if (project.images.length + req.files.length > 10) {
        return res.status(400).json({
          message: "Each project can contain up to 10 images.",
        });
      }
      const uploaded = [];
      try {
        for (const file of req.files) {
          uploaded.push(await uploadImage(file));
        }
        const updated = await Project.findOneAndUpdate(
          {
            _id: project._id,
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
            "The project was deleted or has reached the image limit.",
          );
        }
        if (!updated.cover) {
          updated.cover = updated.images[0]?.url || "";
          await updated.save();
        }
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
      return res.status(404).json({ message: "Project not found" });
    }
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    const image = project.images.find(
      (item) => item.publicId === req.body.publicId,
    );
    if (!image) return res.status(404).json({ message: "Image not found" });
    const result = await cloudinary.uploader.destroy(image.publicId);
    if (result.result !== "ok" && result.result !== "not found") {
      return res.status(502).json({ message: "Could not remove the image." });
    }
    project.images = project.images.filter(
      (item) => item.publicId !== image.publicId,
    );
    if (project.cover === image.url) {
      project.cover = project.images[0]?.url || "";
    }
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/", async (req, res) => {
  try {
    const { title, client, description, category } = req.body;
    const project = await Project.create({
      title,
      client,
      description,
      category,
      owner: req.user._id,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const allowed = ["title", "client", "description", "category", "status"];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowed.includes(key)),
    );
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updates,
      { new: true, runValidators: true },
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    const hasIdeas = await Idea.exists({
      project: project._id,
      owner: req.user._id,
    });
    if (hasIdeas) {
      return res.status(400).json({
        message: "Delete the project's ideas before deleting the project.",
      });
    }
    for (const image of project.images) {
      const result = await cloudinary.uploader.destroy(image.publicId);
      if (result.result !== "ok" && result.result !== "not found") {
        return res.status(502).json({
          message: "Could not remove the project images.",
        });
      }
    }
    await Project.deleteOne({ _id: project._id, owner: req.user._id });
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
