const mongoose = require("mongoose");
const ideaSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    originalIdea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
      default: null,
    },
    revisionNumber: {
      type: Number,
      default: 1,
      min: 1,
    },
    previousRevision: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    folders: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }],
      default: [],
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
          _id: false,
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: ["Proposed", "Approved", "In revision", "Rejected"],
      default: "Proposed",
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Idea", ideaSchema);
