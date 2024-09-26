const mongoose = require('mongoose');

const TenderSchema = new mongoose.Schema({
  tenderName: {
    type: String,
    required: true,
  },
  tenderDescription: {
    type: String,
    required: true,
  },
  tenderStartTime: {
    type: Date,
    required: true,
  },
  tenderEndTime: {
    type: Date,
    required: true,
  },
  bufferTime: {
    type: Number, 
    required: true,
  },
  isClosed :{type:Boolean,default:false},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Tender', TenderSchema);
