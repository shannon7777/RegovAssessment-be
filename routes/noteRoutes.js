const express = require("express");
const router = express.Router();
const { fetchNotes, createNote } = require("../controllers/noteController");

// fetch all notes

// fetch notes belonging to specific user
router.get("/:user_id", fetchNotes);

// Create a note
router.post("/", createNote);

module.exports = router;
