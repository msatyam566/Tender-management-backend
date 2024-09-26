const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const { accessSecret, refreshSecret, accessTokenLife, refreshTokenLife } =
  require("../config/keys").jwt;
const Token = require("../models/refreshToken.model");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../functions/generateToken");

const validateAccessToken = async (req, res, next) => {
  if (!req.headers.authorization)
    return next(createError.Unauthorized("No token found Please login again to continue"));

  const token = req.headers.authorization;

  if (!token.startsWith("Bearer")) {
    return next(createError.Unauthorized("Invalid token format"));
  }
  
  const tokenWithoutBearer = token.slice(7);

  jwt.verify(tokenWithoutBearer, accessSecret, async (err, decoded) => {

    if (err) {
      try {
        if (err.message === "jwt expired") {
          if (req.cookies?.auth) {
            const { auth } = req.cookies;
            const payload = jwt.verify(auth, refreshSecret);
            if (!payload)
              throw createError.Unauthorized(
                "Session expired. Please login again."
              );

            const resultQuery = await Token.findOne({
              user: payload.data._id,
              token: auth,
            });

            if (!resultQuery)
              return next(createError.Unauthorized("Please login again"));

            const jwtPayload = {
              data: payload.data,
            };
            const accessToken = generateAccessToken(
              jwtPayload,
              accessTokenLife
            );
            const refreshToken = generateRefreshToken(
              jwtPayload,
              refreshTokenLife
            );
            if (accessToken && refreshToken) {
              resultQuery.overwrite(
                new Token({
                  user: payload.data._id,
                  token: refreshToken,
                })
              );
              await resultQuery.save();
              res.cookie("auth", refreshToken, { httpOnly: true });
              const json_ = res.json; // capture the default resp.json implementation

              res.json = function (object) {
                object["accessToken"] = accessToken;

                json_.call(res, object);
              };
              req.user = { data: payload.data };
              return next();
            }
          }
        }

        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));

      } catch (error) {
        console.log("error: ", error);
        return next(createError.InternalServerError());
      }
    }
    req.user = decoded;
    next();
  });
};
module.exports = validateAccessToken;
