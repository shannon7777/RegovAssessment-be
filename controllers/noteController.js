const Note = require("../models/noteModel");
// const jwt = require("jsonwebtoken");

const fetchNotes = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const notes = await Note.find({ user_id }).lean().exec();
    res.status(200).json({ notes });
  } catch (error) {
    res.status(400).json({ message: `Could not fetch notes..` });
  }
};

const createNote = async (req, res) => {
  try {
    const { text, user_id } = req.body;
    const newNote = await Note.create({
      text,
      user_id,
    });
    res.status(200).json({ message: `New note created`, newNote });
  } catch (error) {
    res.status(400).json({ message: `Could not create note` });
  }
};

module.exports = { fetchNotes, createNote };
