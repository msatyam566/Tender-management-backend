const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const {loginValidation}= require("../../validator/validator")
const { generateAccessToken, generateRefreshToken } =require( "../../functions/generateToken");
const Token = require("../../models/refreshToken.model")
const config = require("../../config/keys");



// Login user
const loginUser = async (req, res) => {
    try {
      const { email, password } = await loginValidation.validateAsync(req.body); 

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({
            status: false,
            message: "Incorrect password. Please try again.",
          });    }

          const payload = {
            role: user.role,
            email: user.email,
            _id: user._id,
          };

         // generate access token and refersh token
          const accessToken = generateAccessToken(
            payload,
            config.jwt.accessTokenLife
          );
          const refreshToken = generateRefreshToken(
            payload,
            config.jwt.refreshTokenLife
          );
          if (!accessToken || !refreshToken) {
            return res.status(500).json({
              status: false,
              message: "Unable to generate tokens. Please try again later.",
            });
          }

          // Making a new entry in database of token
          const token = new Token({
            user: user._id,
            token: accessToken,
            refreshToken: refreshToken,
          });
          await token.save();
          res.cookie("auth", refreshToken, { httpOnly: true });

        res.status(200).json({ 
          token:token.token,
          role :user.role
         });
    } catch (error) {
        if (error.isJoi) {
          return res.status(400).json(error.details.map((details)=>details.message));
          }
        res.status(500).json({ error: error.message });
    }
};

module.exports = loginUser