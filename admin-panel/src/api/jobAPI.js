import api from './axios';

export const jobAPI = {
  // Create a new job
  createJob: async (jobData) => {
    const response = await api.post('/api/jobs', jobData);
    return response.data;
  },

  // Get all jobs (admin view)
  getAllJobs: async (params = {}) => {
    const response = await api.get('/api/jobs', { params });
    return response.data;
  },

  // Get single job by ID
  getJobById: async (id) => {
    const response = await api.get(`/api/jobs/${id}`);
    return response.data;
  },

  // Update job
  updateJob: async (id, jobData) => {
    const response = await api.put(`/api/jobs/${id}`, jobData);
    return response.data;
  },

  // Delete job
  deleteJob: async (id) => {
    const response = await api.delete(`/api/jobs/${id}`);
    return response.data;
  },

  // Get active jobs (user view)
  getActiveJobs: async (params = {}) => {
    const response = await api.get('/api/jobs/active/list', { params });
    return response.data;
  }
};
