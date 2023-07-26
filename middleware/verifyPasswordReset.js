const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const verifyPasswordReset = (req, res, next) => {
  console.log(`verifying pwd token`);
  const { token } = req.body;
  const secretKey = process.env.ACCESS_TOKEN_SECRET;
  jwt.verify(token, secretKey, async (error, decoded) => {
    if (error)
      return res.status(403).json({ message: `Invalid password reset token` });

    const userExists = await User.find({ email: decoded.email }).lean().exec();
    if (userExists) next();
  });
};

module.exports = verifyPasswordReset;
