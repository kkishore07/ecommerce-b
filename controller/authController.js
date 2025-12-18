const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password, role, adminCode } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    let resolvedRole = "user";
    if (role === "admin") {
      const secret = process.env.ADMIN_REG_CODE || "let-me-in";
      if (!adminCode || adminCode !== secret) {
        return res
          .status(403)
          .json({ message: "Invalid admin registration code" });
      }
      resolvedRole = "admin";
    }

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role: resolvedRole,
    });
    console.log(`[REGISTER] User saved with _id: ${user._id}`);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("[REGISTER] Error:", err.message);
    res.status(400).json({ message: "Bad request", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const secretKey = process.env.JWT_SECRET || "defaultSecretKey";
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      secretKey,
      { expiresIn: process.env.EXPIRES_IN || "1h" }
    );
    res.status(200).json({
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    res.status(400).json({ message: "Bad request", error: err.message });
  }
};

module.exports = { register, login };
