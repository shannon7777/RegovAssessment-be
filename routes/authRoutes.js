const express = require("express");
const router = express.Router();
const {
  handleLogin,
  handleLogout,
  pwdResetLink,
  verifyPasswordReset,
} = require("../controllers/authController");

// User log in
router.post("/", handleLogin);

// User Logout
router.get("/logout", handleLogout);

// Handle send password reset link
router.post("/reset", pwdResetLink);

// Verify password reset token
router.post("/verify-pwd-reset", verifyPasswordReset);

module.exports = router;
