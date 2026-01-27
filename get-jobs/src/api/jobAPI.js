import api from './axios';

export const jobAPI = {
  // Get active jobs (user view)
  getActiveJobs: async (params = {}) => {
    const response = await api.get('/api/jobs/active/list', { params });
    return response.data;
  },

  // Get single job by ID
  getJobById: async (id) => {
    const response = await api.get(`/api/jobs/${id}`);
    return response.data;
  },

  // Submit job application with resume
  submitApplication: async (jobId, formData) => {
    const response = await api.post('/api/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user's applications
  getUserApplications: async (userId) => {
    const response = await api.get(`/api/applications/user/${userId}`);
    return response.data;
  },

  // Upload video interview
  uploadVideoInterview: async (applicationId, videoBlob) => {
    const formData = new FormData();
    formData.append('video', videoBlob, 'interview.webm');
    formData.append('applicationId', applicationId);

    const response = await api.post('/api/video/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get video analysis status
  getVideoAnalysisStatus: async (applicationId) => {
    const response = await api.get(`/api/video/analysis/${applicationId}`);
    return response.data;
  }
};
