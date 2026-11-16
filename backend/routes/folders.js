const express = require("express");
const router = express.Router();
const Folder = require("../models/Folder");
const Idea = require("../models/Idea");
router.get("/", async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.user._id }).sort({
      name: 1,
    });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/", async (req, res) => {
  try {
    const folder = await Folder.create({
      name: req.body.name,
      owner: req.user._id,
    });
    res.status(201).json(folder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { name: req.body.name },
      { new: true, runValidators: true },
    );
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    res.json(folder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const folder = await Folder.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    await Idea.updateMany(
      { owner: req.user._id, folders: folder._id },
      { $pull: { folders: folder._id } },
    );
    res.json({ message: "Folder deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
