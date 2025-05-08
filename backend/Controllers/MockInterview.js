const MockInterview = require('../Models/MockInterview');

exports.createMock = async (req, res) => {
    try {
      const { topic, details, link, startTime, duration } = req.body;
      if (!topic||!link||!details||!startTime||!duration) {
        return res.status(400).json({ success: false, message: 'All inputs are required' });
      }
      const userId = req.user.id;
      const start = new Date(startTime); 
      const endTime = new Date(start.getTime() + duration * 60000); 
      const clash = await MockInterview.findOne({
        $or: [{ author: userId }, { acceptedBy: userId }],
        $expr: {
          $and: [
            { $lt: ["$startTime", endTime] },
            { $gt: [{ $add: ["$startTime", { $multiply: ["$duration", 60000] }] }, start] } 
          ]
        }
      });
      if (clash) {
        return res.status(400).json({ success: false, message: 'You have a time clash with another interview' });
      }
      const mock = await MockInterview.create({
        topic,
        details,
        meetingLink:link,
        startTime: start,
        duration,
        author: userId,
        endTime, 
      });
      res.status(201).json({ success: true, message: 'Mock interview created successfully', mock });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };
  
exports.getAllAvailableMocks = async (req, res) => {
  try {
    const mocks = await MockInterview.find({ acceptedBy: null, isCancelled: false }).populate('author', 'name email phone' );
    res.json({ success: true, mocks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getMyMocks = async (req, res) => {
    try {
      const userId = req.user.id;
      const mocks = await MockInterview.find({
        $or: [{ author: userId }, { acceptedBy: userId }]
      })
        .populate("author", "name email phone")
        .populate("acceptedBy", "name email phone");
      res.json({ success: true, mocks });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };
  
  exports.acceptMock = async (req, res) => {
    try {
      const mockId = req.params.id;
      const userId = req.user.id;
  
      const mock = await MockInterview.findById(mockId);
      if (!mock) {
        return res.status(404).json({ success: false, message: 'Mock interview not found' });
      }
  
      if (mock.acceptedBy) {
        return res.status(400).json({ success: false, message: 'Interview already accepted' });
      }
  
      if (mock.author.toString() === userId) {
        return res.status(400).json({ success: false, message: 'You cannot accept your own mock' });
      }
  
      const start = new Date(mock.startTime);
      const end = new Date(start.getTime() + mock.duration * 60000);
  
      const clash = await MockInterview.findOne({
        $or: [{ author: userId }, { acceptedBy: userId }],
        startTime: { $lt: end },
        $expr: {
          $gt: [
            { $add: ["$startTime", { $multiply: ["$duration", 60000] }] },
            start
          ]
        }
      });
  
      if (clash) {
        return res.status(400).json({ success: false, message: 'You already have a mock at this time' });
      }
  
      mock.acceptedBy = userId;
      await mock.save();
  
      res.json({ success: true, message: 'Interview accepted', mock });
    } catch (error) {
      console.error("Accept Mock Error:", error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };
  
exports.cancelMock = async (req, res) => {
  try {
    const mockId = req.params.id;
    const userId = req.user.id;
    const mock = await MockInterview.findById(mockId);
    if (!mock) return res.status(404).json({ success: false, message: 'Interview not found' });
    if (String(mock.author) === String(userId)) {
      mock.isCancelled = true;
      await mock.save();
      return res.json({ success: true, message: 'Interview cancelled by author and removed' });
    } else if (String(mock.acceptedBy) === String(userId)) {
      const start = new Date(mock.startTime);
      if (start < new Date()) {
        return res.status(400).json({ success: false, message: 'Interview already started. Cannot cancel.' });
      }
      mock.acceptedBy = null;
      await mock.save();
      return res.json({ success: true, message: 'Interview unaccepted and available again' });
    } else {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this interview' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteMock = async (req, res) => {
    try {
      const mockId = req.params.id;
      const userId = req.user.id;
  
      const mock = await MockInterview.findById(mockId);
      if (!mock) {
        return res.status(404).json({ success: false, message: 'Interview not found' });
      }
  
      if (String(mock.author) !== String(userId)) {
        return res.status(403).json({ success: false, message: 'Only the creator can delete this mock' });
      }
  
      const currentTime = new Date();
      const startTime = new Date(mock.startTime);
  
      if (currentTime >= startTime) {
        return res.status(400).json({ success: false, message: 'Cannot delete mock that has already started or completed' });
      }
  
      await mock.deleteOne();
      res.json({ success: true, message: 'Interview deleted successfully' });
    } catch (error) {
      console.error("Delete Mock Error:", error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };
  