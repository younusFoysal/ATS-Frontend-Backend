import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { applicationAPI } from '../api/applicationAPI';
import { jobAPI } from '../api/jobAPI';

const ApplicationsList = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [statusFilter, setStatusFilter] = useState('');

  const { data: jobData } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobAPI.getJobById(jobId),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobApplications', jobId, statusFilter],
    queryFn: () => applicationAPI.getJobApplications(jobId, { status: statusFilter }),
  });

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
        <div style={{ color: '#D3D4D7' }}>Error loading applications</div>
      </div>
    );
  }

  const applications = data?.data || [];
  const job = jobData?.data;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#04060D' }}>
      {/* Header */}
      <div className="p-4 border-b-2" style={{ borderColor: '#143AA2' }}>
        <div className="container mx-auto">
          <button
            onClick={() => navigate('/jobs')}
            className="mb-4 text-lg hover:opacity-80"
            style={{ color: '#3E8DE3' }}
          >
            ← Back to Jobs
          </button>
          <h1 className="text-3xl font-bold" style={{ color: '#D3D4D7' }}>
            Applications for: {job?.title}
          </h1>
          <p className="mt-2" style={{ color: '#3E8DE3' }}>
            {applications.length} applications
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter */}
        <div className="mb-6">
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
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="p-12 rounded-lg text-center" style={{ backgroundColor: '#D3D4D7' }}>
            <p className="text-xl" style={{ color: '#04060D' }}>
              No applications yet for this job.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application._id}
                className="p-6 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#D3D4D7' }}
                onClick={() => navigate(`/applications/${application._id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2" style={{ color: '#04060D' }}>
                      {application.applicantName}
                    </h3>
                    <p className="text-lg mb-3" style={{ color: '#143AA2' }}>
                      📧 {application.applicantEmail}
                    </p>

                    <div className="flex gap-4 mb-3 flex-wrap">
                      <span className="text-sm" style={{ color: '#04060D' }}>
                        📄 Resume: {application.resumeFileName || 'Attached'}
                      </span>
                      {application.videoInterviewUrl && (
                        <span className="text-sm" style={{ color: '#04060D' }}>
                          🎥 Video Interview: Completed
                        </span>
                      )}
                      {application.parsedResumeData && (
                        <span className="text-sm" style={{ color: '#3E8DE3' }}>
                          ✓ Resume Parsed
                        </span>
                      )}
                      {application.videoAnalysisData && (
                        <span className="text-sm" style={{ color: '#3E8DE3' }}>
                          ✓ Video Analyzed
                        </span>
                      )}
                    </div>

                    <p className="text-sm" style={{ color: '#04060D' }}>
                      Applied: {new Date(application.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="ml-6">
                    <span
                      className="px-4 py-2 rounded-lg font-bold text-sm uppercase"
                      style={{
                        backgroundColor: getStatusColor(application.status).bg,
                        color: getStatusColor(application.status).text
                      }}
                    >
                      {application.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
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

export default ApplicationsList;
