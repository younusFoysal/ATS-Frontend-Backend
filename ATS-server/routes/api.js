const authController = require('../controllers/authController');
const jobController = require('../controllers/jobController');
const applicationController = require('../controllers/applicationController');
const videoController = require('../controllers/videoController');
const multer = require('multer');

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and video files are allowed'), false);
    }
  }
});

module.exports = (app) => {
  // Health check
  app.get('/', (req, res) => {
    console.log('API called');
    res.json({ message: 'ATS server is running' });
  });

  // Auth routes
  app.post('/api/auth/register', authController.register);
  app.post('/api/auth/login', authController.login);

  // Admin auth route
  app.post('/api/auth/admin/login', authController.adminLogin);

  // Job routes - Admin
  app.post('/api/jobs', jobController.createJob);
  app.get('/api/jobs', jobController.getAllJobs);
  app.get('/api/jobs/:id', jobController.getJobById);
  app.put('/api/jobs/:id', jobController.updateJob);
  app.delete('/api/jobs/:id', jobController.deleteJob);

  // Job routes - Public (for users)
  app.get('/api/jobs/active/list', jobController.getActiveJobs);

  // Application routes
  app.post('/api/applications', upload.single('resume'), applicationController.submitApplication);
  app.get('/api/applications/user/:userId', applicationController.getUserApplications);
  app.get('/api/applications/job/:jobId', applicationController.getJobApplications);
  app.get('/api/applications/:id', applicationController.getApplicationById);
  app.put('/api/applications/:id/status', applicationController.updateApplicationStatus);

  // Video interview routes
  app.post('/api/video/upload', upload.single('video'), videoController.uploadVideo);
  app.get('/api/video/analysis/:applicationId', videoController.getVideoAnalysisStatus);
};
