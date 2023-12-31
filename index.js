const express = require("express");
const connectDb = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const verifyJwt = require("./middleware/verifyJwt");
const app = express();

// connect DBs
connectDb();
//testing
const PORT = process.env.PORT || 7000;

// using cors for app - cross origin resource sharing
app.use(cors());

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

// verify access token for all routes below
app.use(verifyJwt);
// Note Routes
app.use("/api/notes", require("./routes/noteRoutes"));

// Wrap app around errorHandler ; it will overwrite the expressJS default error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`This server is running on port ${PORT}`));
