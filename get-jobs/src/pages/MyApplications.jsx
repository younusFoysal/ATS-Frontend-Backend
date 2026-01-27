import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobAPI } from '../api/jobAPI';
import { useAuth } from '../context/AuthContext';
import { FileText, Clock, CheckCircle2, XCircle, AlertCircle, ArrowLeft, Building, MapPin, Calendar, LogOut } from 'lucide-react';

const MyApplications = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['userApplications', user.id],
    queryFn: () => jobAPI.getUserApplications(user.id),
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-blue-50 text-blue-700 border-blue-200",
      reviewing: "bg-purple-50 text-purple-700 border-purple-200",
      shortlisted: "bg-yellow-50 text-yellow-700 border-yellow-200",
      accepted: "bg-green-50 text-green-700 border-green-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
      default: "bg-gray-50 text-gray-700 border-gray-200"
    };

    const icons = {
      pending: <Clock size={14} />,
      reviewing: <FileText size={14} />,
      shortlisted: <AlertCircle size={14} />,
      accepted: <CheckCircle2 size={14} />,
      rejected: <XCircle size={14} />,
      default: <Clock size={14} />
    };

    const style = styles[status] || styles.default;
    const icon = icons[status] || icons.default;

    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style} capitalize`}>
        {icon} {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">Error loading applications: {error.message}</div>
      </div>
    );
  }

  const applications = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10 w-full">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              My Applications
            </h1>
          </div>
          <div className="hidden md:flex gap-6 ml-8">
            <button
              onClick={() => navigate('/jobs')}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Browse Jobs
            </button>
            <button
              onClick={() => navigate('/applications')}
              className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-4 -mb-4"
            >
              My Applications
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600 hidden sm:block">
            {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Application History</h2>
            <p className="text-gray-500 mt-1">Manage and track your ongoing job applications</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-600">
            Total Applications: <span className="font-bold text-blue-600">{applications.length}</span>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="p-16 rounded-2xl text-center bg-white border border-gray-200 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-500 mb-6">
              You haven't applied to any jobs yet. Start exploring opportunities!
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className="px-6 py-2.5 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {application.jobId?.title || 'Job Title Not Available'}
                        </h3>
                        <div className="md:hidden">
                            {getStatusBadge(application.status)}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Building size={16} className="text-gray-400" /> {application.jobId?.role || 'Role'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-gray-400" /> {application.jobId?.location || 'Location'}
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <Calendar size={16} className="text-gray-400" /> Applied on {new Date(application.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex gap-3 text-xs">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full flex items-center gap-1">
                            <FileText size={12} /> {application.resumeFileName ? 'Resume Uploaded' : 'No Resume'}
                        </span>
                        {application.videoInterviewUrl && (
                            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full flex items-center gap-1 border border-purple-100">
                                <Clock size={12} /> Interview Submitted
                            </span>
                        )}
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col items-end gap-3 min-w-max">
                    {getStatusBadge(application.status)}
                    <button
                        onClick={() => navigate(`/jobs/${application.jobId?._id}`)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                        View Job Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
