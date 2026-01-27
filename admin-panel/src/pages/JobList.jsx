import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobAPI } from '../api/jobAPI';

const JobList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', statusFilter, searchTerm],
    queryFn: () => jobAPI.getAllJobs({ status: statusFilter, search: searchTerm }),
  });

  const deleteMutation = useMutation({
    mutationFn: jobAPI.deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#04060D' }}>
        <div style={{ color: '#D3D4D7' }}>Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#04060D' }}>
        <div style={{ color: '#D3D4D7' }}>Error loading jobs: {error.message}</div>
      </div>
    );
  }

  const jobs = data?.data || [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#04060D' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#D3D4D7' }}>
            Job Management
          </h1>
          <button
            onClick={() => navigate('/jobs/create')}
            className="px-6 py-3 rounded font-semibold transition-colors hover:opacity-90"
            style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
          >
            + Create New Job
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded border-2 focus:outline-none"
            style={{
              backgroundColor: '#D3D4D7',
              borderColor: '#143AA2',
              color: '#04060D',
              minWidth: '300px'
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded border-2 focus:outline-none"
            style={{
              backgroundColor: '#D3D4D7',
              borderColor: '#143AA2',
              color: '#04060D'
            }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="p-8 rounded text-center" style={{ backgroundColor: '#D3D4D7' }}>
              <p style={{ color: '#04060D' }}>No jobs found. Create your first job!</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className="p-6 rounded-lg"
                style={{ backgroundColor: '#D3D4D7' }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#04060D' }}>
                      {job.title}
                    </h3>
                    <div className="flex gap-4 mb-3 flex-wrap">
                      <span className="text-sm" style={{ color: '#143AA2' }}>
                        <strong>Role:</strong> {job.role}
                      </span>
                      <span className="text-sm" style={{ color: '#143AA2' }}>
                        <strong>Level:</strong> {job.level}
                      </span>
                      <span className="text-sm" style={{ color: '#143AA2' }}>
                        <strong>Type:</strong> {job.employmentType}
                      </span>
                      <span
                        className="px-3 py-1 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: job.status === 'active' ? '#143AA2' : '#3E8DE3',
                          color: '#D3D4D7'
                        }}
                      >
                        {job.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: '#04060D' }}>
                      {job.description?.substring(0, 150)}...
                    </p>
                    <div className="text-sm" style={{ color: '#143AA2' }}>
                      <strong>Applications:</strong> {job.applicationsCount || 0}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4 flex-col">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/jobs/${job._id}/applications`);
                      }}
                      className="px-4 py-2 rounded font-semibold transition-colors hover:opacity-90"
                      style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
                    >
                      View Applications ({job.applicationsCount || 0})
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/jobs/edit/${job._id}`);
                      }}
                      className="px-4 py-2 rounded font-semibold transition-colors hover:opacity-90"
                      style={{ backgroundColor: '#3E8DE3', color: '#04060D' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      disabled={deleteMutation.isPending}
                      className="px-4 py-2 rounded font-semibold transition-colors hover:opacity-90"
                      style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
                    >
                      {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Info */}
        {data?.pagination && (
          <div className="mt-6 text-center" style={{ color: '#D3D4D7' }}>
            Showing {jobs.length} of {data.pagination.total} jobs
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;
