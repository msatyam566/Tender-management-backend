const { Schema, model, models } = require("mongoose");

const { refreshTokenLife } = require("../config/keys").jwt;

const tokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "employees",
  },
  token: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: refreshTokenLife,
    default: Date.now,
  },
});

// Check if the model is already compiled before compiling it again
const Token = models.token || model("token", tokenSchema, "token");

module.exports = Token;
