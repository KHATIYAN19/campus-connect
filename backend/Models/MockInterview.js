const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  details: { type: String, required: true },
  meetingLink: { type: String, required: true },
  startTime: { type: Date, required: true },
  duration: { type: Number, enum: [30, 45, 60], required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isCancelled: { type: Boolean, default: false },
  endTime: {
    type: Date,
    required: true,
  }
  
}, { timestamps: true });

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
