const User = require("../vendorModel/UserModel");
const userAddress = require("../vendorModel/UserAddressModel");
const cloudinary = require("../eCommerceUtils/cloudinary");

exports.userAddress = async (req, res) => {
  try {
    let userId = req.params.userId;

    if (!userId && req.user) {
      userId = req.user._id;
    }

    if (!req.user || req.user.role !== "user") {
      return res.status(403).json({
        error: "Unauthorized: Only users can create user addresses",
      });
    }

    const existingAddress = await userAddress.findOne({ userId });

    if (existingAddress) {
      return res.status(400).json({ error: "User already has an address" });
    }

    const newUserAddress = await userAddress.create({ userId });

    await User.findByIdAndUpdate(userId, { userAddress: newUserAddress._id });

    res
      .status(201)
      .json({ message: "User address created successfully", newUserAddress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUserAddresses = async (req, res) => {
  try {
    const userAddresses = await userAddress.find();

    res.status(200).json({ userAddresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserAddress = async (req, res) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({
      error: "Unauthorized: Only users can Update user addresses",
    });
  }

  const { fullName, age, gender, street, city, state, country, postalCode } =
    req.body;

  if (!fullName) {
    return res.status(400).json({ error: "Full Name is Required" });
  }

  if (!age && (isNaN(age) || age < 0 || age > 150)) {
    return res.status(400).json({ error: "Invalid age value" });
  }

  if (!gender && !["male", "female", "other"].includes(gender)) {
    return res.status(400).json({ error: "Invalid gender value" });
  }

  if (!street) {
    return res.status(400).json({ error: "Street must be Required" });
  }

  if (!city) {
    return res.status(400).json({ error: "City must be Required" });
  }

  if (!state) {
    return res.status(400).json({ error: "State must be Required" });
  }

  if (!country) {
    return res.status(400).json({ error: "Country must be Required" });
  }

  if (!postalCode || postalCode.length !== 6) {
    return res.status(400).json({
      error: "Postal code must be required and it should be 6 digits",
    });
  }
  try {
    let avatarUrl = "";
    if (req.file) {
      const folder = "images";
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder,
      });
      avatarUrl = result.secure_url;
    }

    const updateUserAddress = await userAddress.findOne({
      userId: req.user._id,
    });

    if (!updateUserAddress) {
      return res.status(404).json({ error: "User address not found" });
    }

    updateUserAddress.fullName = fullName;
    updateUserAddress.avatar = avatarUrl || updateUserAddress.avatar;
    updateUserAddress.age = age;
    updateUserAddress.gender = gender;
    updateUserAddress.street = street;
    updateUserAddress.city = city;
    updateUserAddress.state = state;
    updateUserAddress.country = country;
    updateUserAddress.postalCode = postalCode;

    await updateUserAddress.save();

    res.status(200).json({
      message: "User address updated successfully",
      updateUserAddress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
