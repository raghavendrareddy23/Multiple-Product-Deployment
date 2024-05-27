const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: String,
    password: { type: String},
    role: {
      type: String,
      enum: ["user", "admin", "vendor", "deliveryBoy"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    userAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAddress",
      default: null,
    },
    vendorAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorAddress",
      default: null,
    },
    deliveryBoyAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryBoy",
      default: null,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  {
    timestamps: true,
    versionKey: false, 
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.resetPasswordToken; 
        delete ret.resetPasswordExpires; 
        return ret;
      }
    }
  }
);

module.exports = mongoose.model("VendorUser", userSchema);
