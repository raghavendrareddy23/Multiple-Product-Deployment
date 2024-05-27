const mongoose = require('mongoose');

const vendorAddressSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendorFullName: {
    type: String,
    default: ""
  },
  storeName: {
    type: String,
    default: ""
  },
  avatar: {
    type: String,
    default: "https://res.cloudinary.com/dhddb83n7/image/upload/v1715601300/images/ae4tks50dz6uluhl0ljf.png"
  },
  street: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  state: {
    type: String,
    default: ""
  },
  country: {
    type: String,
    default: ""
  },
  postalCode: {
    type: String,
    default: ""
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  contactNumber: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  },
  website: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},
{
    timestamps : true,
    versionKey: false
}
);

vendorAddressSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('VendorAddress', vendorAddressSchema);
