const express = require("express");
const router = express.Router();
const { getUsers, createUser, resetPassword } = require("../controllers/userController");

// Create a new user
router.post("/", createUser);

// Get all users
router.get("/", getUsers);

// Reset password
router.put("/edit-password/:email", resetPassword);

module.exports = router;
