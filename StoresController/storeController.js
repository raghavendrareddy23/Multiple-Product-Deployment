const Store = require("../storesModel/store");

const createStore = async (req, res) => {
  try {
    const { storeName, email, address, pincode, location } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only admins have access",
      });
    }

    const reversedCoordinates = [
      location.coordinates[1],
      location.coordinates[0],
    ];

    const newStore = new Store({
      storeName,
      email,
      address,
      pincode,
      location: {
        type: location.type,
        coordinates: reversedCoordinates,
      },
    });

    await newStore.save();

    res
      .status(201)
      .json({ message: "Store created successfully", store: newStore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getStores = async (req, res) => {
  try {
    const userCoordinates = req.query.coordinates || req.body.coordinates;
    if (!userCoordinates) {
      return res.status(400).json({ success: false, message: "Coordinates are required" });
    }
    const [latitude, longitude] = userCoordinates.split(",");
    const userLatitude = parseFloat(latitude);
    const userLongitude = parseFloat(longitude);

    const stores = await Store.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [userLongitude, userLatitude],
          },
          $maxDistance: 5000,
        },
      },
    });

    const storesWithDistance = stores.map(store => {
      const distance = getDistance(userLatitude, userLongitude, store.location.coordinates[1], store.location.coordinates[0]);
      return {
        _id: store._id,
        storeName: store.storeName,
        email: store.email,
        address: store.address,
        pincode: store.pincode,
        location: store.location,
        distance: distance.toFixed(2) 
      };
    });

    res.json({ success: true, data: storesWithDistance });
  } catch (error) {
    console.error("Error searching stores:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

function getDistance(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c; 
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}



module.exports = {
  createStore,
  getStores,
};
