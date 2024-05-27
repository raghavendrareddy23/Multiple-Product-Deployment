const express = require("express");
//eCommerece Routes
const userRoutes = require("./Ecommerce_Routes/userRoutes");
const categoryRoutes = require("./Ecommerce_Routes/categoryRoutes");
const subCategoryRoutes = require("./Ecommerce_Routes/subCategoryRoutes");
const productRoutes = require("./Ecommerce_Routes/productRoutes");
const cartRoutes = require("./Ecommerce_Routes/cartRoutes");
const wishListRoutes = require("./Ecommerce_Routes/wishListRoutes");
const addressRoutes = require("./Ecommerce_Routes/addressRoutes");
const orderRoutes = require("./Ecommerce_Routes/orderRoutes");
const orderController = require("./eCommerceControllers/orderController");
const couponRoutes = require("./Ecommerce_Routes/couponRoutes");
const dotenv = require("dotenv");
const socketRoutes = require("./Ecommerce_Routes/socketRoutes");
//Store Routes
const userStoresRoutes = require("./Stores_Routes/userRoutes");
const storeRoutes = require("./Stores_Routes/storeRoutes");
//vendor Routes
const UserVendorRoutes = require("./Vendor_Routes/UserRoutes");
const UserAddressRoutes = require("./Vendor_Routes/UserAddressRoutes");
const VendorAddressRoutes = require("./Vendor_Routes/VendorAddressRoutes");
const DeliveryBoyAddressRoutes = require("./Vendor_Routes/DeliveryBoyAddressRoutes");
const PasswordRoutes = require("./Vendor_Routes/PasswordRoutes");

const setupRoutes = (app) => {
  //Ecommerce Routes
  app.use("/eCommerce/user", userRoutes);
  app.use("/eCommerce/category", categoryRoutes);
  app.use("/eCommerce/subcategory", subCategoryRoutes);
  app.use("/eCommerce/product", productRoutes);
  app.use("/eCommerce/cart", cartRoutes);
  app.use("/eCommerce/wishlist", wishListRoutes);
  app.use("/eCommerce/address", addressRoutes);
  app.use("/eCommerce/orders", orderRoutes);
  app.use("/eCommerce/coupon", couponRoutes);
  app.post("/orders/webhook/stripe", orderController.webhook);
  app.use("/eCommerce/notifications", socketRoutes);

  //Stores routes
  app.use("/Stores/user", userStoresRoutes);
  app.use("/Stores/stores", storeRoutes);

  //vendor routes
  app.use("/Vendor/user", UserVendorRoutes);
  app.use("/Vendor/userDetails", UserAddressRoutes);
  app.use("/Vendor/vendorDetails", VendorAddressRoutes);
  app.use("/Vendor/deliveryBoyDetails", DeliveryBoyAddressRoutes);
  app.use("/Vendor/requestChange", PasswordRoutes);
};

module.exports = setupRoutes;
