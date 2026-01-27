import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobAPI } from '../api/jobAPI';
import { ArrowLeft } from 'lucide-react';

const JobForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    role: '',
    level: '',
    location: '',
    employmentType: 'Full-time',
    salary: { min: '', max: '', currency: 'USD' },
    description: '',
    requiredSkills: '',
    preferredSkills: '',
    educationRequirements: '',
    softSkills: '',
    experienceExpectations: '',
    projectExpectations: '',
    responsibilities: '',
    benefits: '',
    applicationDeadline: '',
    status: 'active'
  });

  const [error, setError] = useState('');

  // Fetch job data if editing
  const { data: jobData } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobAPI.getJobById(id),
    enabled: isEditMode
  });

  useEffect(() => {
    if (jobData?.data) {
      const job = jobData.data;
      setFormData({
        title: job.title || '',
        role: job.role || '',
        level: job.level || '',
        location: job.location || '',
        employmentType: job.employmentType || 'Full-time',
        salary: job.salary || { min: '', max: '', currency: 'USD' },
        description: job.description || '',
        requiredSkills: job.requiredSkills?.join('\n') || '',
        preferredSkills: job.preferredSkills?.join('\n') || '',
        educationRequirements: job.educationRequirements?.join('\n') || '',
        softSkills: job.softSkills?.join('\n') || '',
        experienceExpectations: job.experienceExpectations?.join('\n') || '',
        projectExpectations: job.projectExpectations?.join('\n') || '',
        responsibilities: job.responsibilities?.join('\n') || '',
        benefits: job.benefits?.join('\n') || '',
        applicationDeadline: job.applicationDeadline?.split('T')[0] || '',
        status: job.status || 'active'
      });
    }
  }, [jobData]);

  const createMutation = useMutation({
    mutationFn: jobAPI.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      navigate('/jobs');
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Error creating job');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => jobAPI.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      queryClient.invalidateQueries(['job', id]);
      navigate('/jobs');
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Error updating job');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('salary.')) {
      const salaryField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        salary: { ...prev.salary, [salaryField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.role || !formData.level || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    // Convert newline-separated strings to arrays
    const jobData = {
      ...formData,
      requiredSkills: formData.requiredSkills.split('\n').filter(s => s.trim()),
      preferredSkills: formData.preferredSkills.split('\n').filter(s => s.trim()),
      educationRequirements: formData.educationRequirements.split('\n').filter(s => s.trim()),
      softSkills: formData.softSkills.split('\n').filter(s => s.trim()),
      experienceExpectations: formData.experienceExpectations.split('\n').filter(s => s.trim()),
      projectExpectations: formData.projectExpectations.split('\n').filter(s => s.trim()),
      responsibilities: formData.responsibilities.split('\n').filter(s => s.trim()),
      benefits: formData.benefits.split('\n').filter(s => s.trim()),
    };

    if (isEditMode) {
      updateMutation.mutate({ id, data: jobData });
    } else {
      createMutation.mutate(jobData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
               <button
                  onClick={() => navigate('/jobs')}
                  className="mb-2 text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
               >
                  <ArrowLeft size={16} /> Back to Jobs
               </button>
               <h1 className="text-3xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Job Posting' : 'Create New Job Posting'}
               </h1>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm shadow-sm">
              <span className="font-bold">Error: </span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                Basic Information
              </h2>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                  placeholder="e.g., Senior Data Analyst"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                    placeholder="e.g., Data Analyst"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Level <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                    placeholder="e.g., Senior, Entry-Level"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                    placeholder="e.g., San Francisco, Remote"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Employment Type
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Salary Range
                </label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    name="salary.min"
                    value={formData.salary.min}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    name="salary.max"
                    value={formData.salary.max}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                    placeholder="Max"
                  />
                  <select
                    name="salary.currency"
                    value={formData.salary.currency}
                    onChange={handleChange}
                    className="w-32 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="BDT">BDT</option>
                  </select>
                </div>
              </div>

               <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Job Description</h2>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                  placeholder="Detailed job description..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Required Skills (One per line)
                  </label>
                  <textarea
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                    placeholder="Java&#10;Python&#10;SQL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Preferred Skills (One per line)
                  </label>
                  <textarea
                    name="preferredSkills"
                    value={formData.preferredSkills}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                    placeholder="Docker&#10;Kubernetes"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
               <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Additional Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                       Education Requirements
                    </label>
                    <textarea
                      name="educationRequirements"
                      value={formData.educationRequirements}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                      placeholder="Bachelor's degree in CS..."
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                       Soft Skills
                    </label>
                    <textarea
                      name="softSkills"
                      value={formData.softSkills}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                      placeholder="Communication&#10;Teamwork"
                    />
                  </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Responsibilities
                    </label>
                    <textarea
                      name="responsibilities"
                      value={formData.responsibilities}
                      onChange={handleChange}
                      rows="4"
                       className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                      placeholder="Lead team..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Benefits
                    </label>
                    <textarea
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleChange}
                      rows="4"
                       className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                      placeholder="Health insurance&#10;Remote work"
                    />
                  </div>
                 </div>

                   <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                       Experience Expectations
                    </label>
                    <textarea
                      name="experienceExpectations"
                      value={formData.experienceExpectations}
                      onChange={handleChange}
                      rows="4"
                       className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                      placeholder="3+ years of experience..."
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                       Project Expectations
                    </label>
                    <textarea
                      name="projectExpectations"
                      value={formData.projectExpectations}
                      onChange={handleChange}
                      rows="4"
                       className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                      placeholder="Built REST APIs..."
                    />
                  </div>

                 <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Application Deadline
                    </label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleChange}
                       className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                    />
                  </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 py-3.5 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Saving...' : isEditMode ? 'Update Job' : 'Create Job'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="px-8 py-3.5 rounded-lg font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobForm;
