const Bid = require('../../models/Bids.model');
const Tender = require('../../models/Tender.model');



// Api to Submit a bid for a tender
exports.submitBid = async (req, res) => {
  try {
    const { tenderId, companyName, bidCost } = req.body;

    // Find the tender
    const tender = await Tender.findById(tenderId);
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }


    const currentTime = new Date();
    const lastMinuteBid = (tender.tenderEndTime - currentTime) <= 5 * 60 * 1000; // Check if bid is within the last 5 minutes

    // Create a new bid
    const bid = new Bid({
      tenderId,
      companyName,
      bidCost,
      lastMinuteBid,
    });

    await bid.save();

    // If it's a last-minute bid, extend the tender end time by the buffer time
    if (lastMinuteBid) {
      tender.tenderEndTime = new Date(tender.tenderEndTime.getTime() + tender.bufferTime * 60 * 1000);
      await tender.save();
      const io = req.app.get('socketio');
      
      // Emit event to notify the frontend that tender end time has increased socket.emit to send information
      io.emit('tenderExtended', {
        tenderName: tender.tenderName,
        newEndTime: tender.tenderEndTime,
        bufferTime: tender.bufferTime,
      });
    }

    res.status(201).json({ message: 'Bid submitted successfully', bid });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Error submitting bid', error });
  }
};




//===================== Get all bids for a tender by using  tender id =====================//

exports.getBidsByTender = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const bids = await Bid.find({ tenderId }).sort({ bidCost: 1 }); // Sorted bids by cost
    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bids', error });
  }
};
