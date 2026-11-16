const express = require("express");
const crypto = require("crypto");
const User = require("../models/User");
const router = express.Router();

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}

function checkPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const actual = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return (
    actual.length === expected.length &&
    crypto.timingSafeEqual(actual, expected)
  );
}

function createToken(user) {
  const header = Buffer.from(
    JSON.stringify({
      alg: "HS256",
      typ: "JWT",
    }),
  ).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      id: user._id.toString(),
      exp: Math.floor(Date.now() / 1000) + 604800,
    }),
  ).toString("base64url");
  const content = `${header}.${payload}`;
  const signature = crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(content)
    .digest("base64url");
  return `${content}.${signature}`;
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({
        message:
          "Enter your name, email and a password of at least 8 characters.",
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashPassword(password),
    });
    res.status(201).json({
      token: createToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Unable to create your account.",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Enter your email and password.",
      });
    }
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });
    if (!user || !checkPassword(password, user.password)) {
      return res.status(401).json({
        message: "Email or password is incorrect.",
      });
    }
    res.json({
      token: createToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Unable to log in.",
    });
  }
});

module.exports = router;
