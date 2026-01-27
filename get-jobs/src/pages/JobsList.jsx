import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobAPI } from '../api/jobAPI';
import { useAuth } from '../context/AuthContext';

const JobsList = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['activeJobs', searchTerm],
    queryFn: () => jobAPI.getActiveJobs({ search: searchTerm }),
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
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
      {/* Header */}
      <nav className="p-4 border-b-2" style={{ borderColor: '#143AA2' }}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: '#D3D4D7' }}>
            Job Portal
          </h1>
          <div className="flex items-center gap-4">
            <span style={{ color: '#D3D4D7' }}>Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#D3D4D7' }}>
            Find Your Dream Job
          </h2>
          <input
            type="text"
            placeholder="Search jobs by title, role, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-2xl px-6 py-4 rounded-lg border-2 focus:outline-none text-lg"
            style={{
              backgroundColor: '#D3D4D7',
              borderColor: '#143AA2',
              color: '#04060D'
            }}
          />
        </div>

        {/* Job List */}
        <div className="space-y-6">
          {jobs.length === 0 ? (
            <div className="p-12 rounded-lg text-center" style={{ backgroundColor: '#D3D4D7' }}>
              <p className="text-xl" style={{ color: '#04060D' }}>
                No jobs available at the moment. Check back soon!
              </p>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className="p-6 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                style={{ backgroundColor: '#D3D4D7' }}
                onClick={() => navigate(`/jobs/${job._id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2" style={{ color: '#04060D' }}>
                      {job.title}
                    </h3>

                    <div className="flex gap-4 mb-3 flex-wrap">
                      <span className="text-sm font-semibold" style={{ color: '#143AA2' }}>
                        📍 {job.location || 'Remote'}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: '#143AA2' }}>
                        💼 {job.employmentType}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: '#143AA2' }}>
                        📊 {job.level}
                      </span>
                      {job.salary?.min && job.salary?.max && (
                        <span className="text-sm font-semibold" style={{ color: '#3E8DE3' }}>
                          💰 {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <p className="text-sm mb-4" style={{ color: '#04060D' }}>
                      <strong>Role:</strong> {job.role}
                    </p>

                    <p className="mb-4" style={{ color: '#04060D' }}>
                      {job.description?.substring(0, 200)}...
                    </p>

                    {job.requiredSkills?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requiredSkills.slice(0, 5).map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded text-sm"
                            style={{ backgroundColor: '#3E8DE3', color: '#04060D' }}
                          >
                            {skill}
                          </span>
                        ))}
                        {job.requiredSkills.length > 5 && (
                          <span
                            className="px-3 py-1 rounded text-sm"
                            style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
                          >
                            +{job.requiredSkills.length - 5} more
                          </span>
                        )}
                      </div>
                    )}

                    {job.applicationDeadline && (
                      <p className="text-sm" style={{ color: '#143AA2' }}>
                        <strong>Apply by:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/jobs/${job._id}`);
                    }}
                    className="ml-6 px-6 py-3 rounded font-semibold transition-colors hover:opacity-90 whitespace-nowrap"
                    style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Info */}
        {data?.pagination && (
          <div className="mt-8 text-center" style={{ color: '#D3D4D7' }}>
            <p className="text-lg">
              Showing <strong>{jobs.length}</strong> of <strong>{data.pagination.total}</strong> jobs
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsList;
