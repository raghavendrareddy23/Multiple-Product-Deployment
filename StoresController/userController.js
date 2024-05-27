const User = require("../storesModel/storeUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!req.body.username) {
      return res
        .status(400)
        .json({ success: false, message: "User name is required" });
    }
    if (!req.body.email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    if (!req.body.password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "email already exists" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special symbol",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!req.body.username) {
      return res
        .status(400)
        .json({ success: false, message: "User name is required" });
    }

    if (!req.body.password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let role = "user";
    if (user.role === "admin") {
      role = "admin";
    }

    if (role === "admin") {
      await adminLogin(req, res, user, password);
    } else {
      await userLogin(req, res, user, password);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userLogin = async (req, res, user, password) => {
  try {
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: "user" },
      process.env.JWT_SECRET
    );

    res
      .status(200)
      .json({ userId: user._id, token, username: user.username, role: "user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminLogin = async (req, res, user, password) => {
  try {
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: "admin" },
      process.env.JWT_SECRET
    );

    res.status(200).json({ token, username: user.username, role: "admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching Users",
    });
  }
};
