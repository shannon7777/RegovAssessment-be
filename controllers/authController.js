const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");

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

const pwdResetLink = async (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    const { email } = req.body;
    // check if user exists
    const user = await User.find({ email }).lean().exec();
    if (!user)
      return res.status(404).json({
        message: `${email} does not exist, please enter a valid email`,
      });

    const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    const link = `${req.protocol}://localhost:3000/password-reset?token=${token}`;
    const from = `shannonsimoncherry@hotmail.com`;
    const subject = `Password Recovery`;
    const content = `<div>Click this link to reset your password: ${link}</div>`;
    const payload = {
      to: email,
      from,
      subject,
      html: content,
    };

    await sgMail
      .send(payload)
      .then(() => {
        return res.status(200).json({
          message: `A link has been sent to your email, please check your inbox`,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: `Could not send link to email, please try again later`,
          error,
        });
      });
  } catch (error) {
    res.status(400).json({
      message: `Could not send link to email, please try again later`,
    });
  }
};

const verifyPasswordReset = (req, res) => {
  console.log(`verifying pwd token`);
  const { token } = req.body;
  const secretKey = process.env.ACCESS_TOKEN_SECRET;
  jwt.verify(token, secretKey, async (error, decoded) => {
    if (error)
      return res.status(403).json({ message: `Invalid password reset token` });

    const userExists = await User.find({ email: decoded.email }).lean().exec();
    if (userExists) res.status(200).json({ email: decoded.email });
  });
};

module.exports = {
  handleLogin,
  handleLogout,
  verifyPasswordReset,
  pwdResetLink,
};
