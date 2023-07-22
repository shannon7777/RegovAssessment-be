const express = require("express");
const path = require("path");
const connectDb = require("./config/db");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const errorHandler = require("./middleware/errorHandler");
const app = express();

// connect DB
connectDb();

const PORT = process.env.PORT || 7000;

// handle options credentials check - must set before CORS!!
// and to fetch cookies credentials requirement
app.use(credentials);

// using cors for app - cross origin resource sharing
app.use(cors);

// !!! MIDDLEWARE FUNCTIONS FOR HANDLING JSON MUST BE DECLARED BEFORE THE ROUTE IF NOT THERE'LL BE ERRORS
// for handling JSON
app.use(express.json());
// for handling form submission (POST method)
app.use(express.urlencoded({ extended: false }));

// Middleware for cookies
app.use(cookieParser());

// --- ROUTES ---
// User Routes
app.use("/api/users", require("./routes/userRoutes"));
// Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));

// Wrap app around errorHandler ; it will overwrite the expressJS default error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`This server is running on port ${PORT}`));