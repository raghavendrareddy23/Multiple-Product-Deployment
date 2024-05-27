const User = require("../vendorModel/UserModel");
const vendorAddress = require("../vendorModel/vendorAddressModel");
const cloudinary = require("../eCommerceUtils/cloudinary");

exports.vendorAddress = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "vendor") {
      return res.status(403).json({
        error: "Unauthorized: Only vendors can create vendor addresses",
      });
    }

    const existingVendorAddress = await vendorAddress.findOne({
      vendorId: req.user._id,
    });

    if (existingVendorAddress) {
      return res.status(400).json({ error: "Vendor already has an address" });
    }

    const newVendorAddress = await vendorAddress.create({
      vendorId: req.user._id,
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { vendorAddress: newVendorAddress._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Vendor address created successfully",
      newVendorAddress,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllVendorAddresses = async (req, res) => {
  try {
    const vendorAddresses = await vendorAddress.find();

    res.status(200).json({ vendorAddresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateVendorAddress = async (req, res) => {
  if (!req.user || req.user.role !== "vendor") {
    return res.status(403).json({
      error: "Unauthorized: Only vendors can Update vendor addresses",
    });
  }

  const {
    vendorFullName,
    storeName,
    street,
    city,
    state,
    country,
    postalCode,
    contactNumber,
    email,
    website,
    location,
  } = req.body;

  const { coordinates } = location;

  if (!vendorFullName) {
    return res.status(400).json({ error: "Vendor full name must required" });
  }

  if (!storeName) {
    return res.status(400).json({ error: "Store name must required" });
  }

  // Validate street
  if (!street) {
    return res.status(400).json({ error: "Street must be required" });
  }

  if (!city) {
    return res.status(400).json({ error: "City must be required" });
  }

  if (!state) {
    return res.status(400).json({ error: "State must be required" });
  }

  if (!country) {
    return res.status(400).json({ error: "Country must be required" });
  }

  if (!postalCode || postalCode.length !== 6) {
    return res.status(400).json({
      error: "Postal code must be required and it should be 6 digits",
    });
  }

  if (!contactNumber && !/^\+?[0-9]{1,3}-?[0-9]{6,12}$/.test(contactNumber)) {
    return res.status(400).json({ error: "Invalid contact number format" });
  }

  if (!email && !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (
    !website &&
    !/(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ;,./?%&=]*)?/.test(website)
  ) {
    return res.status(400).json({ error: "Invalid website format" });
  }

  if (location) {
    if (!location.type || !location.coordinates) {
      return res
        .status(400)
        .json({ error: "Location must contain both type and coordinates" });
    }

    if (
      typeof location.type !== "string" ||
      !["Point"].includes(location.type)
    ) {
      return res.status(400).json({ error: "Invalid location type" });
    }

    if (
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({ error: "Invalid location coordinates" });
    }
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

    const updateVendorAddress = await vendorAddress.findOne({
      vendorId: req.user._id,
    });

    if (!updateVendorAddress) {
      return res.status(404).json({ error: "Vendor address not found" });
    }

    updateVendorAddress.vendorFullName = vendorFullName;
    updateVendorAddress.storeName = storeName;
    updateVendorAddress.avatar = avatarUrl || updateVendorAddress.avatar;
    updateVendorAddress.street = street;
    updateVendorAddress.city = city;
    updateVendorAddress.state = state;
    updateVendorAddress.country = country;
    updateVendorAddress.postalCode = postalCode;
    updateVendorAddress.contactNumber = contactNumber;
    updateVendorAddress.email = email;
    updateVendorAddress.website = website;
    updateVendorAddress.location = {
      type: "Point",
      coordinates: coordinates,
    };

    await updateVendorAddress.save();

    res.status(200).json({
      message: "Vendor address updated successfully",
      updateVendorAddress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
