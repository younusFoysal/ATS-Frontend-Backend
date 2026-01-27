const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  applicantName: {
    type: String,
    required: [true, 'Applicant name is required']
  },
  applicantEmail: {
    type: String,
    required: [true, 'Applicant email is required']
  },
  resumeUrl: {
    type: String,
    required: [true, 'Resume URL is required']
  },
  resumeFileName: {
    type: String
  },
  parsedResumeData: {
    type: mongoose.Schema.Types.Mixed
  },
  videoInterviewUrl: {
    type: String
  },
  videoAnalysisData: {
    type: mongoose.Schema.Types.Mixed
  },
  coverLetter: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'],
    default: 'pending'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for quick lookups
applicationSchema.index({ jobId: 1, userId: 1 });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
