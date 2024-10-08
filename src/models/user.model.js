const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number,required:true,unique: true },
    name: { type: String ,required:true},
    role: { type: String, enum: ["admin", "user"], default: "user" },
    isDeleted:{type:Boolean,default:false}
})

module.exports = mongoose.model('User', UserSchema);
