const express = require("express");
const crypto = require("crypto");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const nodemailer = require("nodemailer");
const User = require("../models/User");
const router = express.Router();
const googleCodes = new Map();
function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}
function checkPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
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
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
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
function userData(user) {
  return { id: user._id, name: user.name, email: user.email };
}
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      password.length < 8
    ) {
      return res.status(400).json({
        message:
          "Enter your name, email and a password of at least 8 characters.",
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashPassword(password),
    });
    res.status(201).json({ token: createToken(user), user: userData(user) });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Unable to create your account." });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res
        .status(400)
        .json({ message: "Enter your email and password." });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !checkPassword(password, user.password)) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect." });
    }
    res.json({ token: createToken(user), user: userData(user) });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Unable to log in." });
  }
});
router.post("/forgot-password", async (req, res) => {
  const message =
    "If this email is registered, a password reset link will arrive shortly.";
  try {
    const email = req.body?.email;
    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !user.password) return res.json({ message });
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !process.env.SMTP_FROM
    ) {
      console.error("Password reset email is not configured.");
      return res
        .status(503)
        .json({ message: "Password recovery is temporarily unavailable." });
    }
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();
    const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173")
      .split(",")[0]
      .trim()
      .replace(/\/$/, "");
    const resetLink = `${clientUrl}/reset-password?token=${encodeURIComponent(token)}`;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: "OOPS! — A fresh start",
      text: `Hello ${user.name || "there"},\n\nSomeone requested a password reset for your OOPS! account.\n\nSet a new password here:\n${resetLink}\n\nThis link expires in 30 minutes. If you did not request this, you can ignore this email.\n\nOOPS!`,
    });
    res.json({ message });
  } catch (error) {
    console.error("Forgot password error:", error);
    res
      .status(503)
      .json({ message: "Password recovery is temporarily unavailable." });
  }
});
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (
      typeof token !== "string" ||
      !/^[a-f0-9]{64}$/.test(token) ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: "Invalid reset link or password. Use at least 8 characters.",
      });
    }
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");
    if (!user) {
      return res
        .status(400)
        .json({ message: "This reset link is invalid or has expired." });
    }
    user.password = hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Unable to reset your password." });
  }
});
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          "http://localhost:3001/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleEmail = profile.emails?.[0]?.value?.trim().toLowerCase();
          const verified =
            profile._json?.email_verified === true ||
            profile._json?.email_verified === "true";
          if (!googleEmail || !verified) return done(null, false);
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            const existingUser = await User.findOne({ email: googleEmail });
            if (existingUser) return done(null, false);
            user = await User.create({
              name: profile.displayName || googleEmail.split("@")[0],
              email: googleEmail,
              googleId: profile.id,
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
}
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${(process.env.CLIENT_URL || "http://localhost:5173").split(",")[0].trim()}/login?google=error`,
  }),
  (req, res) => {
    const code = crypto.randomBytes(32).toString("hex");
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    googleCodes.set(codeHash, {
      userId: req.user._id.toString(),
      expires: Date.now() + 60000,
    });
    const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173")
      .split(",")[0]
      .trim();
    res.redirect(`${clientUrl}/login?google_code=${code}`);
  },
);
router.post("/google/exchange", async (req, res) => {
  try {
    const code = req.body?.code;
    if (typeof code !== "string") {
      return res.status(400).json({ message: "Invalid login code." });
    }
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    const entry = googleCodes.get(codeHash);
    googleCodes.delete(codeHash);
    if (!entry || entry.expires < Date.now()) {
      return res
        .status(401)
        .json({ message: "Google login code expired or invalid." });
    }
    const user = await User.findById(entry.userId);
    if (!user) {
      return res.status(401).json({ message: "Account not found." });
    }
    res.json({ token: createToken(user), user: userData(user) });
  } catch (error) {
    console.error("Google exchange error:", error);
    res.status(500).json({ message: "Unable to complete Google login." });
  }
});
module.exports = router;
