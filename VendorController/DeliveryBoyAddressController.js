const User = require("../vendorModel/UserModel");
const deliveryBoyAddress = require("../vendorModel/deliveryAddressModel");
const cloudinary = require("../eCommerceUtils/cloudinary");

exports.deliveryBoyAddress = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "deliveryBoy") {
      return res.status(403).json({
        error: "Unauthorized: Only delivery boys can create delivery addresses",
      });
    }

    const existingDeliveryBoyAddress = await deliveryBoyAddress.findOne({
      deliveryId: req.user._id,
    });

    if (existingDeliveryBoyAddress) {
      return res
        .status(400)
        .json({ error: "Delivery boy already has an address" });
    }

    const newDeliveryBoyAddress = await deliveryBoyAddress.create({
      deliveryId: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $set: { deliveryBoyAddress: newDeliveryBoyAddress._id },
    });

    res.status(201).json({
      message: "Delivery boy address created successfully",
      newDeliveryBoyAddress,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDeliveryBoyAddresses = async (req, res) => {
  try {
    const deliveryBoyAddresses = await deliveryBoyAddress.find();

    res.status(200).json({ deliveryBoyAddresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDeliveryBoyAddress = async (req, res) => {

  const { fullName, email, contactNumber, vehicleType, vehicleNumber } = req.body;
  
  if (!fullName) {
    return res.status(400).json({ error: "Full Name is Required" });
  }

  if (!contactNumber && !/^\+?[0-9]{1,3}-?[0-9]{6,12}$/.test(contactNumber)) {
    return res.status(400).json({ error: "Invalid contact number format" });
  }

  if (!email && !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!vehicleType) {
    return res.status(400).json({ error: "vehicleType is Required" });
  }

  if (!vehicleNumber) {
    return res.status(400).json({ error: "vehicleNumber is Required" });
  }

  try {
    const folder = "images";
    let avatarUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder,
      });
      avatarUrl = result.secure_url;
    }

    const updateDeliveryBoyAddress = await deliveryBoyAddress.findOne({
      deliveryId: req.user._id,
    });

    if (!updateDeliveryBoyAddress) {
      return res.status(404).json({ error: "Delivery Boy Address not found" });
    }

    updateDeliveryBoyAddress.fullName = fullName;
    updateDeliveryBoyAddress.avatar =
      avatarUrl || updateDeliveryBoyAddress.avatar;
    updateDeliveryBoyAddress.email = email;
    updateDeliveryBoyAddress.contactNumber = contactNumber;
    updateDeliveryBoyAddress.vehicleType = vehicleType;
    updateDeliveryBoyAddress.vehicleNumber = vehicleNumber;

    await updateDeliveryBoyAddress.save();

    res.status(200).json({
      message: "Delivery Address updated successfully",
      updateDeliveryBoyAddress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
