const mongoose = require("mongoose");

const deliveryBoySchema = new mongoose.Schema(
  {
    deliveryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    contactNumber: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dhddb83n7/image/upload/v1715601300/images/ae4tks50dz6uluhl0ljf.png",
    },
    vehicleType: {
      type: String,
      default: "",
    },
    vehicleNumber: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalOrdersDelivered: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("DeliveryBoy", deliveryBoySchema);
