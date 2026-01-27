import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { applicationAPI } from '../api/applicationAPI';
import { jobAPI } from '../api/jobAPI';
import { Inbox, Mail, FileText, Video, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';

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
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'reviewing':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'shortlisted':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">Error loading applications</div>
      </div>
    );
  }

  const applications = data?.data || [];
  const job = jobData?.data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6 shadow-sm">
        <div className="container mx-auto">
          <button
            onClick={() => navigate('/jobs')}
            className="mb-4 text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Jobs
          </button>
          <div className="flex justify-between items-end">
             <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Applications for: <span className="text-blue-600">{job?.title}</span>
                </h1>
                <p className="mt-2 text-gray-500">
                    Manage and review all candidates for this position
                </p>
             </div>
             <div className="text-right">
                <span className="text-3xl font-bold text-blue-600">{applications.length}</span>
                <p className="text-gray-500 text-sm">Total Applications</p>
             </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        {/* Filter */}
        <div className="mb-8 bg-white p-4 rounded-xl border border-gray-200 shadow-sm inline-flex">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all min-w-[200px]"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="p-12 rounded-xl text-center bg-white border border-gray-200 shadow-sm">
             <div className="flex justify-center mb-4">
                <Inbox size={48} className="text-gray-400" />
             </div>
            <p className="text-xl font-bold text-gray-900 mb-2">
              No applications yet
            </p>
             <p className="text-gray-500">
              When candidates apply, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application._id}
                className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                onClick={() => navigate(`/applications/${application._id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {application.applicantName}
                    </h3>
                    <p className="text-gray-500 mb-4 flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" /> {application.applicantEmail}
                    </p>

                    <div className="flex gap-3 mb-4 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs border border-gray-200">
                        <FileText size={14} /> Resume: {application.resumeFileName || 'Attached'}
                      </span>
                      {application.videoInterviewUrl && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs border border-purple-200">
                          <Video size={14} /> Video Interview
                        </span>
                      )}
                      {application.parsedResumeData && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs border border-green-200">
                          <CheckCircle2 size={14} /> Resume Parsed
                        </span>
                      )}
                      {application.videoAnalysisData && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs border border-blue-200">
                          <CheckCircle2 size={14} /> Video Analyzed
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-400">
                      Applied: {new Date(application.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="ml-6 flex flex-col items-end gap-2">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border ${getStatusColor(application.status)}`}
                    >
                      {application.status}
                    </span>
                    <span className="text-blue-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity font-medium mt-2 flex items-center gap-1">
                        View Details <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        {applications.length > 0 && (
          <div className="mt-10 p-8 rounded-xl bg-white border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-gray-900 border-b border-gray-100 pb-4">
              Application Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center p-4 rounded-lg bg-gray-50">
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {applications.length}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Total</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {applications.filter(a => a.status === 'pending').length}
                </div>
                <div className="text-xs text-blue-600 uppercase tracking-wide opacity-80">Pending</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {applications.filter(a => a.status === 'reviewing').length}
                </div>
                <div className="text-xs text-purple-600 uppercase tracking-wide opacity-80">Reviewing</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-yellow-50">
                <div className="text-3xl font-bold text-yellow-600 mb-1">
                  {applications.filter(a => a.status === 'shortlisted').length}
                </div>
                 <div className="text-xs text-yellow-600 uppercase tracking-wide opacity-80">Shortlisted</div>
              </div>
               <div className="text-center p-4 rounded-lg bg-green-50">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {applications.filter(a => a.status === 'accepted').length}
                </div>
                 <div className="text-xs text-green-600 uppercase tracking-wide opacity-80">Accepted</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsList;
