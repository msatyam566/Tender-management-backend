const Tender = require('../../models/Tender.model');

//================= Create a new tender by admin ===================//

exports.createTender = async (req, res) => {
  try {
    const { tenderName, tenderDescription, tenderStartTime, tenderEndTime, bufferTime } = req.body;

    const tender = new Tender({
      tenderName,
      tenderDescription,
      tenderStartTime,
      tenderEndTime,
      bufferTime,
    });

    await tender.save();
    res.status(201).json({ message: 'Tender created successfully', tender });
  } catch (error) {
    res.status(500).json({ message: 'Error creating tender', error });
  }
};

//============================== Get all tenders  for admin ===========================//

exports.getTenders = async (req, res) => {
  try {
    const tenders = await Tender.find();
    res.status(200).json(tenders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tenders', error });
  }
};


//=====================Get all active tenders for users only they can see the active tender and bid on it================= //
exports.getActiveTenders = async (req, res) => {
    try {
      const currentDate = new Date();
      const tenders = await Tender.find({ tenderEndTime: { $gt: currentDate } });
      res.status(200).json(tenders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tenders', error });
    }
  };


  
  