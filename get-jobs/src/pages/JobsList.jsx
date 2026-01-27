import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobAPI } from '../api/jobAPI';
import { useAuth } from '../context/AuthContext';
import { MapPin, Briefcase, BarChart2, DollarSign, Calendar, Search, ArrowRight, ArrowLeft } from 'lucide-react';

const JobsList = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['activeJobs', searchTerm],
    queryFn: () => jobAPI.getActiveJobs({ search: searchTerm }),
    keepPreviousData: true, // Keep showing previous data while fetching new data
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">Error loading jobs: {error.message}</div>
      </div>
    );
  }

  const jobs = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10 w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            Browse Jobs
          </h1>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Search */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Find Your Next Opportunity
          </h2>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search jobs by title, role, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white transition-all"
              autoFocus // Optional: Helps focus on mount if desired
            />
            {isFetching && (
               <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
               </div>
            )}
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-6">
          {isLoading && !jobs.length ? (
             <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
             </div>
          ) : jobs.length === 0 ? (
            <div className="p-16 rounded-2xl text-center bg-white border border-gray-200 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500">
                Try adjusting your search terms or check back later.
              </p>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                onClick={() => navigate(`/jobs/${job._id}`)}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-gray-400" /> {job.location || 'Remote'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={16} className="text-gray-400" /> {job.employmentType}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BarChart2 size={16} className="text-gray-400" /> {job.level}
                      </span>
                      {job.salary?.min && job.salary?.max && (
                        <span className="flex items-center gap-1.5 font-medium text-green-600">
                          <DollarSign size={16} /> {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex items-center gap-4">
                      {job.requiredSkills?.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-600"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills?.length > 4 && (
                        <span className="text-xs text-gray-500 font-medium">
                          +{job.requiredSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 min-w-max">
                    {job.applicationDeadline && (
                      <span className="flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full font-medium mb-2">
                        <Calendar size={14} /> Apply by {new Date(job.applicationDeadline).toLocaleDateString()}
                      </span>
                    )}
                    <button
                      className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-colors"
                    >
                      View Details <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Info */}
        {data?.pagination && (
          <div className="mt-8 text-center text-gray-500">
            Showing <strong>{jobs.length}</strong> of <strong>{data.pagination.total}</strong> opportunities
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsList;
