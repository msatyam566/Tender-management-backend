const Token = require("../../models/refreshToken.model")
const config = require("../../config/keys");
const jwt = require("jsonwebtoken");


// Api to logout user
const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, message: "Authorization header missing" });
    }

    const tokenWithoutBearer = token.slice(7);
    const data = jwt.verify(tokenWithoutBearer, config.jwt.accessSecret);

    if (!data) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Remove the token from the database
    const removeToken = await Token.findOneAndDelete({
      user: data._id,
    });

    if (!removeToken) {
      return res.status(400).json({ success: false, message: "No token found with this user" });
    }

    res.clearCookie("auth");
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error)
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};


module.exports = logoutUser