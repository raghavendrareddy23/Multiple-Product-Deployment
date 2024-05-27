const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../vendorModel/UserModel");

exports.signup = async (req, res) => {
  const { email, password } = req.body;

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
  try {
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
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRole = async (req, res) => {
  const { email, role, password } = req.body;

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can create new roles" });
  }

  if (!["admin", "vendor", "deliveryBoy"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "email already exists" });
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

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: `${role} created successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let role = "user";
    if (["admin", "vendor", "deliveryBoy"].includes(user.role)) {
      role = user.role;
    }

    switch (role) {
      case "admin":
        await adminLogin(req, res, user, password);
        break;
      case "vendor":
        await vendorLogin(req, res, user, password);
        break;
      case "deliveryBoy":
        await deliveryBoyLogin(req, res, user, password);
        break;
      default:
        await userLogin(req, res, user, password);
        break;
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
      .json({ userId: user._id, token, Email: user.email, role: "user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminLogin = async (req, res, user, password) => {
  try {
    if (!user.password) {
      return res
        .status(500)
        .json({ message: "User password is missing in the database" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: "admin" },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      userId: user._id,
      token,
      email: user.email,
      role: "admin",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const vendorLogin = async (req, res, user, password) => {
  try {
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: "vendor" },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      userId: user._id,
      token,
      Email: user.email,
      role: "vendor",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deliveryBoyLogin = async (req, res, user, password) => {
  try {
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: "deliveryBoy" },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      userId: user._id,
      token,
      Email: user.email,
      role: "deliveryBoy",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });

    const activeAdmins = await User.find({ role: "admin", status: "active" });

    const inactiveAdmins = await User.find({
      role: "admin",
      status: "inactive",
    });

    res.status(200).json({ admins, activeAdmins, inactiveAdmins });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor" })
      .select(
        "-deliveryBoyAddress -userAddress -password -resetPasswordToken -resetPasswordExpires -__v"
      )
      .populate({
        path: "vendorAddress",
        select: "-__v",
      });

    const activeVendor = await User.find({ role: "vendor", status: "active" })
      .select(
        "-deliveryBoyAddress -userAddress -password -resetPasswordToken -resetPasswordExpires -__v"
      )
      .populate({
        path: "vendorAddress",
        select: "-__v",
      });

    const inactiveVendor = await User.find({
      role: "vendor",
      status: "inactive",
    })
      .select(
        "-deliveryBoyAddress -userAddress -password -resetPasswordToken -resetPasswordExpires -__v"
      )
      .populate({
        path: "vendorAddress",
        select: "-__v",
      });

    res.status(200).json({ vendors, activeVendor, inactiveVendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDeliveries = async (req, res) => {
  try {
    const deliveryBoy = await User.find({ role: "deliveryBoy" })
      .select(
        "-vendorAddress -userAddress -password -resetPasswordToken -resetPasswordExpires -__v"
      )
      .populate({
        path: "deliveryBoyAddress",
        select: "-__v",
      });

    const activeDeliveryBoy = await User.find({
      role: "deliveryBoy",
      status: "active",
    })
      .select(
        "-vendorAddress -userAddress -password -resetPasswordToken -resetPasswordExpires -__v"
      )
      .populate({
        path: "deliveryBoyAddress",
        select: "-__v",
      });

    const inactiveDeliveryBoy = await User.find({
      role: "deliveryBoy",
      status: "inactive",
    })
      .select(
        "-vendorAddress -userAddress -password -resetPasswordToken -resetPasswordExpires -__v"
      )
      .populate({
        path: "deliveryBoyAddress",
        select: "-__v",
      });

    res
      .status(200)
      .json({ deliveryBoy, activeDeliveryBoy, inactiveDeliveryBoy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select(
        "-vendorAddress -deliveryBoyAddress -password -resetPasswordToken -resetPasswordExpires -__v"
      )
      .populate({
        path: "userAddress",
        select: "-__v",
      });

    const activeUsers = await User.find({ role: "user", status: "active" })
      .select(
        "-vendorAddress -deliveryBoyAddress -password -resetPasswordToken -resetPasswordExpires -__v"
      )
      .populate({
        path: "userAddress",
        select: "-__v",
      });

    const inactiveUsers = await User.find({ role: "user", status: "inactive" })
      .select(
        "-vendorAddress -deliveryBoyAddress -password -resetPasswordToken -resetPasswordExpires -__v"
      )
      .populate({
        path: "userAddress",
        select: "-__v",
      });

    res.status(200).json({ users, activeUsers, inactiveUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
