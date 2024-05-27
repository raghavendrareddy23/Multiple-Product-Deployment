const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;


Store.collection.createIndex({ location: '2dsphere' }, function(err, result) {
    if (err) {
      console.error('Error creating index:', err);
    } else {
      console.log('2dsphere index created successfully:', result);
    }
  });