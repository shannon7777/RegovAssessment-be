const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().lean().exec();
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ message: `Could not fetch users` });
  }
};

const createUser = async (req, res) => {
  console.log(`register user`);
  const { firstName, lastName, email, password } = req.body;
  // check for email duplicates in DB
  const duplicateEmail = await User.findOne({ email }).lean().exec();

  if (duplicateEmail) {
    return res.status(409).json({
      message: `This email : ${email} already exists, please try another email`,
    });
  }

  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPwd,
    });
    res.status(200).json({
      message: `Registration successful, please proceed to sign in.`,
    });
  } catch (error) {
    if (!firstName || !lastName || !email || !password) {
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

const resetPassword = async (req, res) => {
  try {
    const email = req.params.email;
    const { password } = req.body;
    const user = await User.find({ email }).lean().exec();
    const hashedPwd = await bcrypt.hash(password, 10);
    console.log(hashedPwd);

    await User.updateOne(user._id, {
      password: hashedPwd,
    }).exec();

    res.status(200).json({
      message: `Your password has been reset, please log in using your new credentials`,
    });
  } catch (error) {
    res.status(400).json({ message: `Could not reset password` });
  }
};

module.exports = { getUsers, createUser, resetPassword };
