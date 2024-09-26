const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  tenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tender',
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  bidCost: {
    type: Number,
    required: true,
  },
  bidTime: {
    type: Date,
    default: Date.now,
  },
  lastMinuteBid: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Bid', BidSchema);
