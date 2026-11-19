const crypto = require("crypto");
const User = require("../models/User");
module.exports = async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    const parts = token.split(".");
    if (parts.length !== 3) {
      return res.status(401).json({ message: "Please log in to continue." });
    }
    const content = `${parts[0]}.${parts[1]}`;
    const expected = crypto
      .createHmac("sha256", process.env.JWT_SECRET)
      .update(content)
      .digest();
    const actual = Buffer.from(parts[2], "base64url");
    if (
      expected.length !== actual.length ||
      !crypto.timingSafeEqual(expected, actual)
    ) {
      return res.status(401).json({ message: "Invalid session." });
    }
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    if (
      typeof payload.exp !== "number" ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return res.status(401).json({ message: "Session expired." });
    }
    const user = await User.findById(payload.id).select("_id name email");
    if (!user) {
      return res.status(401).json({ message: "Account not found." });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unable to verify your session." });
  }
};
