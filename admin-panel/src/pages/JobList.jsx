import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobAPI } from '../api/jobAPI';
import { Inbox, Briefcase, BarChart2, Clock, Users, Edit, Trash2, ArrowLeft } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">Error loading jobs: {error.message}</div>
      </div>
    );
  }

  const jobs = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
             <button
                onClick={() => navigate('/')}
                className="mb-2 text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                >
                <ArrowLeft size={16} /> Back to Dashboard
             </button>
            <h1 className="text-3xl font-bold text-gray-900">
                Job Management
            </h1>
            <p className="text-gray-500 mt-1">Manage and track your recruitment pipeline</p>
          </div>
          <button
            onClick={() => navigate('/jobs/create')}
            className="px-6 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            + Create New Job
          </button>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-4 flex-wrap bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
            style={{ minWidth: '300px' }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
             className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all min-w-[150px]"
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
            <div className="p-12 rounded-xl text-center bg-white border border-gray-200 shadow-sm">
              <div className="flex justify-center mb-4">
                <Inbox size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-6">Create your first job posting to get started!</p>
              <button
                 onClick={() => navigate('/jobs/create')}
                 className="px-6 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
              >
                Create Job
              </button>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                        </h3>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                job.status === 'active' 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : job.status === 'closed'
                                    ? 'bg-red-100 text-red-700 border border-red-200'
                                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}
                        >
                            {job.status}
                        </span>
                    </div>

                    <div className="flex gap-4 mb-4 flex-wrap text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Briefcase size={16} className="text-gray-400" /> {job.role}
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart2 size={16} className="text-gray-400" /> {job.level}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} className="text-gray-400" /> {job.employmentType}
                      </span>
                      <span className="flex items-center gap-1">
                         <Users size={16} className="text-gray-400" /> {job.applicationsCount || 0} Applicants
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 max-w-2xl">
                      {job.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[180px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/jobs/${job._id}/applications`);
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Users size={18} /> View Applicants
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/jobs/edit/${job._id}`);
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit size={16} /> Edit Job
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      disabled={deleteMutation.isPending}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-white border border-gray-300 hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Info */}
        {data?.pagination && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            Showing {jobs.length} of {data.pagination.total} jobs
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;
