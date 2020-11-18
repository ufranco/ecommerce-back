const express = require("express");
const cors = require('cors');
const morgan = require("morgan");
const passport = require('passport');
const cookieSession = require('cookie-session');
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/db");
require("dotenv").config({ path: "./config/config.env" });
require("colors");
require("./passport-setup");
connectDB();

const auth = require('./routes/auth');
const oAuth = require('./routes/oAuth');
const users = require("./routes/users");
const products = require("./routes/products");
const reviews = require("./routes/reviews");

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(cookieSession({
  name: 'e-commerce-session',
  keys: [
    'key1',
    'key2'
  ],
}));

app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));

  app.use( (req, res, next) => {
    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();

    app.options('*', (req, res) => {
        // allowed XHR methods  
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
  });
}

app.use("/api/auth", auth);
app.use("/api/oauth", oAuth); 
app.use("/api/users", users);
app.use("/api/products", products);
app.use("/api/reviews", reviews);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue.bold)
);

process.on(
  "unhandledRejection", 
  (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    server.close(() => process.exit(1));
});
