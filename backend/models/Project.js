const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    status: { type: String, default: "In progress" },
    cover: { type: String, default: "" },
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
  },
  { timestamps: true },
);
module.exports = mongoose.model("Project", projectSchema);
