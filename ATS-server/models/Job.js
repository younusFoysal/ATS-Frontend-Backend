const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
    default: 'Full-time'
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  preferredSkills: [{
    type: String,
    trim: true
  }],
  educationRequirements: [{
    type: String,
    trim: true
  }],
  softSkills: [{
    type: String,
    trim: true
  }],
  experienceExpectations: [{
    type: String,
    trim: true
  }],
  projectExpectations: [{
    type: String,
    trim: true
  }],
  responsibilities: [{
    type: String,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  applicationDeadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

// Index for searching
jobSchema.index({ title: 'text', role: 'text', description: 'text' });

module.exports = mongoose.model('Job', jobSchema);
