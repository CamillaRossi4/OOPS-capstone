require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./routes/auth");
const authenticate = require("./middleware/authenticate");
const projectsRoutes = require("./routes/projects");
const ideasRoutes = require("./routes/ideas");
const foldersRoutes = require("./routes/folders");
const feedbackRoutes = require("./routes/feedback");
const breakpointRoutes = require("./routes/breakpoint");
const rediscoverRoutes = require("./routes/rediscover");
const app = express();
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
  : [];
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        /^http:\/\/localhost:517\d$/.test(origin) ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }
      callback(new Error("Origin not allowed by CORS"));
    },
  }),
);
app.use(express.json());
app.use(passport.initialize());
app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("OOPS! API is running.");
});
app.use(authenticate);
app.use("/projects", projectsRoutes);
app.use("/ideas", ideasRoutes);
app.use("/folders", foldersRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/breakpoint", breakpointRoutes);
app.use("/rediscover", rediscoverRoutes);
const PORT = process.env.PORT || 3001;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });
