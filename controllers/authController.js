const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  console.log(`auth route`);
  const { email, password } = req.body;
  const userFound = await User.findOne({ email }).exec();
  if (!userFound) {
    return res
      .status(401)
      .json({ message: `Email ${email} does not exist, please try again` });
  }
  // compare password to the password in database
  const pwdMatch = await bcrypt.compare(password, userFound.password);
  try {
    if (pwdMatch) {
      // create JWT access token if password matches
      // encoding the email into the token by doing jwt.sign()
      const accessToken = jwt.sign(
        { email: userFound.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5h" }
      );

      const user = await User.findOne({ email })
        .select(["-password"])
        .lean()
        .exec();

      // send the accesstoken to the client
      res.status(200).json({
        message: `You have successfully logged in, welcome ${userFound.username}`,
        user,
        accessToken,
      });
    } else {
      res.status(400).json({ message: `Password does not match email` });
    }
  } catch (error) {
    res.status(401).json({ message: `Could not log in, ${error.message}` });
  }
};

const handleLogout = async (req, res) => {
  res.status(200).json({ message: `You have logged out` });
};

module.exports = { handleLogin, handleLogout };
