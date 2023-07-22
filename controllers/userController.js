const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  // check for email duplicates in DB
  const duplicateEmail = await User.findOne({ email }).lean().exec();
  const duplicateUsername = await User.findOne({ username }).lean().exec();

  if (duplicateEmail) {
    return res.status(409).json({
      message: `This email : ${email} already exists, please try another email`,
    });
  }

  if (duplicateUsername) {
    return res.status(408).json({
      message: `This username : ${username} already exists, please try another email`,
    });
  }

  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: hashedPwd,
    });
    res.status(200).json({
      message: `Registration successful, please proceed to sign in.`,
    });
  } catch (error) {
    if (!firstName || !lastName || !email || !username || !password) {
      res
        .status(403)
        .json({ message: `Please fill in the all the required fields` });
    } else {
      res
        .status(401)
        .json({ message: `Could not create a user, ${error.message}` });
    }
  }
};

module.exports = { createUser };
