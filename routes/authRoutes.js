const express = require("express");
const router = express.Router();
const {
  handleLogin,
  handleLogout,
  pwdResetLink,
} = require("../controllers/authController");

// User log in
router.post("/", handleLogin);

// User Logout
router.get("/logout", handleLogout);

// Handle password reset
router.post("/reset", pwdResetLink);

module.exports = router;
