const Application = require('../models/Application');
const Job = require('../models/Job');
const axios = require('axios');
const FormData = require('form-data');

// Resume parser API URL
const RESUME_PARSER_URL = process.env.RESUME_PARSER_URL || 'http://127.0.0.1:3001/parse-resume';

// Submit job application
exports.submitApplication = async (req, res) => {
  try {
    const { jobId, userId, applicantName, applicantEmail, coverLetter } = req.body;
    const resumeFile = req.file;

    // Validate required fields
    if (!jobId || !userId || !applicantName || !applicantEmail || !resumeFile) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    let parsedResumeData = null;

    // Try to parse resume using Python API (async - don't wait for it)
    // Python API takes 1-3 minutes, so we'll process it asynchronously
    const parseResumeAsync = async () => {
      try {
        const formData = new FormData();
        formData.append('file', resumeFile.buffer, {
          filename: resumeFile.originalname,
          contentType: resumeFile.mimetype
        });

        console.log('Sending resume to parser API:', RESUME_PARSER_URL);
        const parseResponse = await axios.post(RESUME_PARSER_URL, formData, {
          headers: {
            ...formData.getHeaders()
          },
          timeout: 600000, // 10 minute timeout (Python API can take up to 3+ min)
          validateStatus: function (status) {
            return status < 500; // Accept any status code less than 500
          }
        });

        if (parseResponse.status === 200 && parseResponse.data) {
          console.log('Resume parsed successfully');
          parsedResumeData = parseResponse.data;

          // Update the application with parsed data after it's received
          await Application.findByIdAndUpdate(
            application._id,
            { parsedResumeData: parseResponse.data }
          );
        } else {
          console.log(`Resume parser returned status ${parseResponse.status}`);
        }
      } catch (parseError) {
        console.error('Resume parsing error:', parseError.message);
        if (parseError.response) {
          console.error('Parser API response status:', parseError.response.status);
          console.error('Parser API response data:', parseError.response.data);
        }
        // Application already saved, parsing is optional
      }
    };

    // Note: We'll create the application first, then parse asynchronously

    // For now, we'll store the resume as base64 (in production, use cloud storage)
    const resumeBase64 = resumeFile.buffer.toString('base64');
    const resumeUrl = `data:${resumeFile.mimetype};base64,${resumeBase64}`;

    // Create application (without waiting for parsing)
    const application = await Application.create({
      jobId,
      userId,
      applicantName,
      applicantEmail,
      resumeUrl,
      resumeFileName: resumeFile.originalname,
      parsedResumeData: null, // Will be updated asynchronously
      coverLetter,
      status: 'pending'
    });

    // Increment job applications count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 }
    });

    // Send response immediately (don't wait for parsing)
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. Resume is being parsed in the background.',
      data: {
        applicationId: application._id,
        status: application.status,
        parsing: 'in-progress'
      }
    });

    // Start parsing asynchronously (after response is sent)
    // This won't block the response to the user
    parseResumeAsync().catch(err => {
      console.error('Async resume parsing failed:', err.message);
    });

  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message
    });
  }
};

// Get user's applications
exports.getUserApplications = async (req, res) => {
  try {
    const { userId } = req.params;

    const applications = await Application.find({ userId })
      .populate('jobId', 'title role level location employmentType status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

// Get applications for a job (Admin)
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.query;

    let query = { jobId };
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
      total: applications.length
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job applications',
      error: error.message
    });
  }
};

// Get single application
exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate('jobId')
      .populate('userId', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
};

// Update application status (Admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await Application.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated',
      data: application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application status',
      error: error.message
    });
  }
};
