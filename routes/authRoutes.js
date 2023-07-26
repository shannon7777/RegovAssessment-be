const express = require("express");
const router = express.Router();
const { handleLogin, handleLogout } = require("../controllers/authController");

// User log in
router.post("/", handleLogin);

// User Logout
router.get("/logout", handleLogout);

module.exports = router;
