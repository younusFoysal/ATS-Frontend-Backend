const Application = require('../models/Application');
const axios = require('axios');
const { default: PublitioAPI } = require('publitio_js_sdk/build/publitio-api');

// Initialize Publitio
const publitioAPI = new PublitioAPI(
  process.env.PUBLITIO_API_KEY,
  process.env.PUBLITIO_API_SECRET
);

// Video analysis API URL
const VIDEO_ANALYSIS_URL = process.env.VIDEO_ANALYSIS_URL || 'http://127.0.0.1:3001/parse-video';

// Upload video to Publitio
exports.uploadVideo = async (req, res) => {
  try {
    const { applicationId } = req.body;
    const videoFile = req.file;

    if (!applicationId || !videoFile) {
      return res.status(400).json({
        success: false,
        message: 'Missing application ID or video file'
      });
    }

    // Check if application exists
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    console.log('Uploading video to Publitio...');

    // Upload to Publitio
    const uploadResponse = await publitioAPI.uploadFile(videoFile.buffer, 'file', {
      title: `Interview_${applicationId}`,
      folder: 'interviews'
    });

    if (!uploadResponse || !uploadResponse.url_preview) {
      throw new Error('Failed to upload video to Publitio');
    }

    const videoUrl = uploadResponse.url_preview;
    console.log('Video uploaded successfully:', videoUrl);

    // Update application with video URL
    application.videoInterviewUrl = videoUrl;
    await application.save();

    // Send response immediately
    res.status(200).json({
      success: true,
      message: 'Video uploaded successfully. Analysis in progress.',
      data: {
        videoUrl,
        applicationId
      }
    });

    // Analyze video asynchronously
    analyzeVideoAsync(applicationId, videoUrl).catch(err => {
      console.error('Video analysis error:', err.message);
    });

  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading video',
      error: error.message
    });
  }
};

// Analyze video asynchronously
async function analyzeVideoAsync(applicationId, videoUrl) {
  try {
    console.log('Sending video for analysis:', videoUrl);

    const analysisResponse = await axios.post(VIDEO_ANALYSIS_URL, {
      video_url: videoUrl
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 600000 // 10 minute timeout
    });

    if (analysisResponse.data) {
      console.log('Video analysis completed successfully');

      // Update application with analysis data
      await Application.findByIdAndUpdate(applicationId, {
        videoAnalysisData: analysisResponse.data
      });
    }
  } catch (error) {
    console.error('Video analysis error:', error.message);
    if (error.response) {
      console.error('Analysis API response status:', error.response.status);
      console.error('Analysis API response data:', error.response.data);
    }
  }
}

// Get video analysis status
exports.getVideoAnalysisStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .select('videoInterviewUrl videoAnalysisData');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        hasVideo: !!application.videoInterviewUrl,
        hasAnalysis: !!application.videoAnalysisData,
        videoUrl: application.videoInterviewUrl,
        analysisData: application.videoAnalysisData
      }
    });
  } catch (error) {
    console.error('Get video analysis status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching video analysis status',
      error: error.message
    });
  }
};
