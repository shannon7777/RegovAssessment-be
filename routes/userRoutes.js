const express = require("express");
const router = express.Router();
const { getUsers, createUser } = require("../controllers/userController");

// Create a new user
router.post("/", createUser);

// Get all users
router.get("/", getUsers);

// Reset password
// router.put("/password", resetPassword)

module.exports = router;
