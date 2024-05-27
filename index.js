const express = require('express');
const http = require("http");
const cors = require('cors');
const cron = require("cron");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const generateToken = require("./eCommerceUtils/generateToken.js");
const User = require("./eCommerceModel/user.js");
const bcrypt = require("bcryptjs");
const { Server } = require("socket.io");
const { socketConnection } = require("./eCommerceControllers/socketController.js");
const setupRoutes = require('./routes');
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(
    express.json({
      verify: (req, res, buf) => {
        if (req.originalUrl.startsWith("/orders/webhook/stripe")) {
          req.rawBody = buf.toString();
        }
      },
    })
  );

app.use(cors({
    origin:"http://localhost:3000",
    methods:"GET,POST,PUT,DELETE",
    credentials:true
  }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // If user doesn't exist, create a new user
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            password: await bcrypt.hash(Date.now().toString(), 10),
          });
        }

        // Generate token
        const token = generateToken(user._id);

        // Save token to the user object
        user.token = token;

        // Save user to the database
        await user.save();

        // Pass user to done callback
        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "http://localhost:3000/login",
  })
);

app.get("/auth/login/success", async (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "User Logged In", user: req.user });
  } else {
    res.status(400).json({ message: "Not Authorized" });
  }
});


setupRoutes(app);

const eCommerce_db = require('./eCommerceUtils/db');
const Stores_db = require('./storesUtils/db');
const Vendor_db = require('./vendorUtils/db');

eCommerce_db();
Stores_db();
Vendor_db();

const job = new cron.CronJob(
  "*/12 * * * *",
  () => {
    console.log("Cron job is running every 12 minutes in India...");
  },
  null,
  true,
  "Asia/Kolkata"
);

job.start();


const PORT = process.env.PORT || 5000; 

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

socketConnection(io);