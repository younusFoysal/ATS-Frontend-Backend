import api from './axios';

export const applicationAPI = {
  // Get all applications for a job (admin)
  getJobApplications: async (jobId, params = {}) => {
    const response = await api.get(`/api/applications/job/${jobId}`, { params });
    return response.data;
  },

  // Get single application with full details
  getApplicationById: async (id) => {
    const response = await api.get(`/api/applications/${id}`);
    return response.data;
  },

  // Update application status
  updateApplicationStatus: async (id, statusData) => {
    const response = await api.put(`/api/applications/${id}/status`, statusData);
    return response.data;
  },

  // Get video analysis status
  getVideoAnalysis: async (applicationId) => {
    const response = await api.get(`/api/video/analysis/${applicationId}`);
    return response.data;
  }
};
