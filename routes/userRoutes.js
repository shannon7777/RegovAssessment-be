const express = require("express");
const router = express.Router();
const { getUsers, createUser, resetPassword } = require("../controllers/userController");
const verifyPasswordReset = require("../middleware/verifyPasswordReset");

// Create a new user
router.post("/", createUser);

// Get all users
router.get("/", getUsers);

// Verify password reset token before allowing reset
router.use(verifyPasswordReset);
// Reset password
router.put("/edit-password", resetPassword);

module.exports = router;
