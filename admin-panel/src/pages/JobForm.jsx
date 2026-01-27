import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobAPI } from '../api/jobAPI';

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
    <div className="min-h-screen" style={{ backgroundColor: '#04060D' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold" style={{ color: '#D3D4D7' }}>
              {isEditMode ? 'Edit Job' : 'Create New Job'}
            </h1>
            <button
              onClick={() => navigate('/jobs')}
              className="px-4 py-2 rounded font-semibold"
              style={{ backgroundColor: '#3E8DE3', color: '#04060D' }}
            >
              ← Back to Jobs
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-6 rounded-lg space-y-4" style={{ backgroundColor: '#D3D4D7' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#04060D' }}>Basic Information</h2>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                  style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                  placeholder="e.g., Senior Data Analyst"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                    Role *
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                    style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                    placeholder="e.g., Data Analyst"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                    Level *
                  </label>
                  <input
                    type="text"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                    style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                    placeholder="e.g., Entry to Mid-level (0-3 years)"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                    style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                    placeholder="e.g., Remote, New York, USA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                    Employment Type
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                    style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                    Min Salary
                  </label>
                  <input
                    type="number"
                    name="salary.min"
                    value={formData.salary.min}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                    style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                    Max Salary
                  </label>
                  <input
                    type="number"
                    name="salary.max"
                    value={formData.salary.max}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                    style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                    placeholder="80000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                    Currency
                  </label>
                  <input
                    type="text"
                    name="salary.currency"
                    value={formData.salary.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                    style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                    placeholder="USD"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                  Job Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                  style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                  placeholder="Detailed job description..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                    style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                    style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Skills and Requirements */}
            <div className="p-6 rounded-lg space-y-4" style={{ backgroundColor: '#D3D4D7' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#04060D' }}>Skills & Requirements</h2>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                  Required Skills (one per line)
                </label>
                <textarea
                  name="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                  style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                  placeholder="SQL proficiency&#10;Excel/Google Sheets&#10;Data visualization tools"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                  Preferred Skills (one per line)
                </label>
                <textarea
                  name="preferredSkills"
                  value={formData.preferredSkills}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                  style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                  placeholder="Python libraries (Pandas, NumPy)&#10;Machine learning basics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                  Education Requirements (one per line)
                </label>
                <textarea
                  name="educationRequirements"
                  value={formData.educationRequirements}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                  style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                  placeholder="Bachelor's degree in Statistics or related field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                  Soft Skills (one per line)
                </label>
                <textarea
                  name="softSkills"
                  value={formData.softSkills}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                  style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                  placeholder="Strong communication skills&#10;Attention to detail"
                />
              </div>
            </div>

            {/* Experience & Projects */}
            <div className="p-6 rounded-lg space-y-4" style={{ backgroundColor: '#D3D4D7' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#04060D' }}>Experience & Projects</h2>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                  Experience Expectations (one per line)
                </label>
                <textarea
                  name="experienceExpectations"
                  value={formData.experienceExpectations}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                  style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                  placeholder="0-3 years of data analysis experience&#10;Experience with data extraction from databases"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                  Project Expectations (one per line)
                </label>
                <textarea
                  name="projectExpectations"
                  value={formData.projectExpectations}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                  style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                  placeholder="Created dashboards for stakeholders&#10;Performed exploratory data analysis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                  Responsibilities (one per line)
                </label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                  style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                  placeholder="Analyze large datasets&#10;Create reports and dashboards"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                  Benefits (one per line)
                </label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 rounded border-2 focus:outline-none"
                  style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                  placeholder="Health insurance&#10;401(k) matching&#10;Remote work options"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 py-3 rounded font-semibold transition-colors hover:opacity-90"
                style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
              >
                {isPending ? 'Saving...' : isEditMode ? 'Update Job' : 'Create Job'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="px-8 py-3 rounded font-semibold transition-colors hover:opacity-90"
                style={{ backgroundColor: '#3E8DE3', color: '#04060D' }}
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
