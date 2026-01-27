import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobAPI } from '../api/jobAPI';
import { useAuth } from '../context/AuthContext';
import ApplicationModal from '../components/ApplicationModal';

const JobDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [showApplyModal, setShowApplyModal] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobAPI.getJobById(id),
  });

  const handleApply = () => {
    setShowApplyModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#04060D' }}>
        <div style={{ color: '#D3D4D7' }}>Loading job details...</div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#04060D' }}>
        <div className="text-center">
          <p className="text-xl mb-4" style={{ color: '#D3D4D7' }}>
            {error?.message || 'Job not found'}
          </p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-6 py-3 rounded font-semibold"
            style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
          >
            ← Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const job = data.data;

  const renderList = (title, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-3" style={{ color: '#143AA2' }}>
          {title}
        </h3>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2" style={{ color: '#143AA2' }}>•</span>
              <span style={{ color: '#04060D' }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#04060D' }}>
      {/* Header */}
      <nav className="p-4 border-b-2" style={{ borderColor: '#143AA2' }}>
        <div className="container mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/jobs')}
            className="text-lg font-semibold hover:opacity-80"
            style={{ color: '#D3D4D7' }}
          >
            ← Back to Jobs
          </button>
          <span style={{ color: '#D3D4D7' }}>Welcome, {user?.name}</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Job Header */}
          <div className="p-8 rounded-lg mb-6" style={{ backgroundColor: '#D3D4D7' }}>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#04060D' }}>
              {job.title}
            </h1>

            <div className="flex gap-6 mb-6 flex-wrap">
              <span className="text-lg font-semibold" style={{ color: '#143AA2' }}>
                📍 {job.location || 'Remote'}
              </span>
              <span className="text-lg font-semibold" style={{ color: '#143AA2' }}>
                💼 {job.employmentType}
              </span>
              <span className="text-lg font-semibold" style={{ color: '#143AA2' }}>
                📊 {job.level}
              </span>
            </div>

            {job.salary?.min && job.salary?.max && (
              <div className="mb-6">
                <p className="text-xl font-bold" style={{ color: '#04060D' }}>
                  💰 Salary: {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                </p>
              </div>
            )}

            {job.applicationDeadline && (
              <p className="mb-6" style={{ color: '#143AA2' }}>
                <strong>Application Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}

            <button
              onClick={handleApply}
              className="w-full py-4 rounded-lg font-bold text-xl transition-colors hover:opacity-90"
              style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
            >
              Apply Now
            </button>
          </div>

          {/* Job Details */}
          <div className="p-8 rounded-lg space-y-8" style={{ backgroundColor: '#D3D4D7' }}>
            {/* Role & Description */}
            <div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#143AA2' }}>
                About the Role
              </h3>
              <p className="text-lg mb-4" style={{ color: '#04060D' }}>
                <strong>Role:</strong> {job.role}
              </p>
              <p className="text-lg leading-relaxed whitespace-pre-line" style={{ color: '#04060D' }}>
                {job.description}
              </p>
            </div>

            {/* Required Skills */}
            {renderList('Required Skills', job.requiredSkills)}

            {/* Preferred Skills */}
            {renderList('Preferred Skills', job.preferredSkills)}

            {/* Education Requirements */}
            {renderList('Education Requirements', job.educationRequirements)}

            {/* Soft Skills */}
            {renderList('Soft Skills', job.softSkills)}

            {/* Experience Expectations */}
            {renderList('Experience Expectations', job.experienceExpectations)}

            {/* Project Expectations */}
            {renderList('Project Expectations', job.projectExpectations)}

            {/* Responsibilities */}
            {renderList('Responsibilities', job.responsibilities)}

            {/* Benefits */}
            {renderList('Benefits', job.benefits)}
          </div>

          {/* Apply Button at Bottom */}
          <div className="mt-8 p-6 rounded-lg text-center" style={{ backgroundColor: '#D3D4D7' }}>
            <button
              onClick={handleApply}
              className="px-12 py-4 rounded-lg font-bold text-xl transition-colors hover:opacity-90"
              style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
            >
              Apply for this Position
            </button>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        job={job}
      />
    </div>
  );
};

export default JobDetail;
