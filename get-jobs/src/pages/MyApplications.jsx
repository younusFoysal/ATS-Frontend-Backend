import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobAPI } from '../api/jobAPI';
import { useAuth } from '../context/AuthContext';

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { bg: '#3E8DE3', text: '#04060D' };
      case 'reviewing':
        return { bg: '#143AA2', text: '#D3D4D7' };
      case 'shortlisted':
        return { bg: '#3E8DE3', text: '#04060D' };
      case 'accepted':
        return { bg: '#143AA2', text: '#D3D4D7' };
      case 'rejected':
        return { bg: '#D3D4D7', text: '#04060D' };
      default:
        return { bg: '#D3D4D7', text: '#04060D' };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#04060D' }}>
        <div style={{ color: '#D3D4D7' }}>Loading applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#04060D' }}>
        <div style={{ color: '#D3D4D7' }}>Error loading applications: {error.message}</div>
      </div>
    );
  }

  const applications = data?.data || [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#04060D' }}>
      {/* Header */}
      <nav className="p-4 border-b-2" style={{ borderColor: '#143AA2' }}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold" style={{ color: '#D3D4D7' }}>
              Job Portal
            </h1>
            <button
              onClick={() => navigate('/jobs')}
              className="text-lg hover:opacity-80"
              style={{ color: '#3E8DE3' }}
            >
              Browse Jobs
            </button>
            <button
              onClick={() => navigate('/applications')}
              className="text-lg font-semibold"
              style={{ color: '#D3D4D7' }}
            >
              My Applications
            </button>
          </div>
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
        <h2 className="text-3xl font-bold mb-6" style={{ color: '#D3D4D7' }}>
          My Applications
        </h2>

        {applications.length === 0 ? (
          <div className="p-12 rounded-lg text-center" style={{ backgroundColor: '#D3D4D7' }}>
            <p className="text-xl mb-4" style={{ color: '#04060D' }}>
              You haven't applied to any jobs yet.
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className="px-8 py-3 rounded-lg font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
            >
              Browse Available Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application._id}
                className="p-6 rounded-lg"
                style={{ backgroundColor: '#D3D4D7' }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2" style={{ color: '#04060D' }}>
                      {application.jobId?.title || 'Job Title Not Available'}
                    </h3>

                    <div className="flex gap-4 mb-3 flex-wrap">
                      <span className="text-sm font-semibold" style={{ color: '#143AA2' }}>
                        📍 {application.jobId?.location || 'N/A'}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: '#143AA2' }}>
                        💼 {application.jobId?.employmentType || 'N/A'}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: '#143AA2' }}>
                        📊 {application.jobId?.level || 'N/A'}
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="text-sm font-semibold" style={{ color: '#04060D' }}>
                        Applied on: {new Date(application.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="text-sm" style={{ color: '#04060D' }}>
                        <strong>Resume:</strong> {application.resumeFileName}
                      </span>
                    </div>

                    {application.parsedResumeData && (
                      <div className="mb-3">
                        <span
                          className="text-sm px-2 py-1 rounded"
                          style={{ backgroundColor: '#3E8DE3', color: '#04060D' }}
                        >
                          ✓ Resume Parsed
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col items-end gap-3">
                    <span
                      className="px-4 py-2 rounded-lg font-bold text-sm uppercase"
                      style={{
                        backgroundColor: getStatusColor(application.status).bg,
                        color: getStatusColor(application.status).text
                      }}
                    >
                      {application.status}
                    </span>
                    <button
                      onClick={() => navigate(`/jobs/${application.jobId?._id}`)}
                      className="px-4 py-2 rounded font-semibold transition-colors hover:opacity-90"
                      style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
                    >
                      View Job
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {applications.length > 0 && (
          <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: '#D3D4D7' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#04060D' }}>
              Application Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: '#143AA2' }}>
                  {applications.length}
                </div>
                <div className="text-sm" style={{ color: '#04060D' }}>Total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: '#3E8DE3' }}>
                  {applications.filter(a => a.status === 'pending').length}
                </div>
                <div className="text-sm" style={{ color: '#04060D' }}>Pending</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: '#143AA2' }}>
                  {applications.filter(a => a.status === 'reviewing').length}
                </div>
                <div className="text-sm" style={{ color: '#04060D' }}>Reviewing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: '#3E8DE3' }}>
                  {applications.filter(a => a.status === 'shortlisted').length}
                </div>
                <div className="text-sm" style={{ color: '#04060D' }}>Shortlisted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: '#143AA2' }}>
                  {applications.filter(a => a.status === 'accepted').length}
                </div>
                <div className="text-sm" style={{ color: '#04060D' }}>Accepted</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
