import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobAPI } from '../api/jobAPI';
import { useAuth } from '../context/AuthContext';
import ApplicationModal from '../components/ApplicationModal';
import { MapPin, Briefcase, BarChart2, DollarSign, Calendar, ArrowLeft, CheckCircle2, Star, GraduationCap, Users, Clock } from 'lucide-react';

const JobDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [showApplyModal, setShowApplyModal] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobAPI.getJobById(id),
  });

  // Fetch user applications to check status
  const { data: userApplications } = useQuery({
    queryKey: ['userApplications', user.id],
    queryFn: () => jobAPI.getUserApplications(user.id),
    enabled: !!user,
  });

  const hasApplied = userApplications?.data?.some(app => app.jobId?._id === id || app.jobId === id);

  const handleApply = () => {
    if (!hasApplied) {
      setShowApplyModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl mb-4 text-red-500">
            {error?.message || 'Job not found'}
          </p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-6 py-2.5 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            ← Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const job = data.data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-20 w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/jobs')}
            className="text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
             <h1 className="text-lg font-bold text-gray-900 truncate max-w-md leading-tight">
                {job.title}
             </h1>
             <span className="text-xs text-gray-500">{job.location || 'Remote'} • {job.employmentType}</span>
          </div>
        </div>
        <button
          onClick={handleApply}
          disabled={hasApplied}
          className={`px-6 py-2 rounded-lg font-bold text-white transition-colors shadow-md shadow-blue-200 text-sm ${
            hasApplied 
              ? 'bg-green-600 hover:bg-green-700 cursor-not-allowed opacity-90' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {hasApplied ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} /> Applied
            </span>
          ) : (
            'Apply Now'
          )}
        </button>
      </nav>

      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content Column */}
            <div className="lg:col-span-2 space-y-8">
                {/* Description & Role */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Role</h2>
                    <div className="flex flex-wrap gap-4 mb-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                            <Briefcase size={16} /> {job.role}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
                            <BarChart2 size={16} /> {job.level}
                        </span>
                         <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                            <DollarSign size={16} /> {job.salary?.currency} {job.salary?.min?.toLocaleString()} - {job.salary?.max?.toLocaleString()}
                        </span>
                    </div>
                    <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                        {job.description}
                    </div>
                </div>

                {/* Responsibilities */}
                {job.responsibilities && job.responsibilities.length > 0 && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <CheckCircle2 className="text-blue-600" /> Key Responsibilities
                        </h3>
                        <ul className="space-y-4">
                            {job.responsibilities.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                                    <span className="text-gray-600 leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Expectations (Experience & Projects) */}
                {(job.experienceExpectations?.length > 0 || job.projectExpectations?.length > 0) && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Star className="text-yellow-500" /> Expectations
                        </h3>
                        <div className="space-y-6">
                            {job.experienceExpectations?.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Experience</h4>
                                    <ul className="space-y-2">
                                        {job.experienceExpectations.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3 text-gray-600 text-sm">
                                                <span className="text-yellow-500 mt-0.5">★</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {job.projectExpectations?.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Project Experience</h4>
                                    <ul className="space-y-2">
                                        {job.projectExpectations.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3 text-gray-600 text-sm">
                                                <span className="text-yellow-500 mt-0.5">★</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Skills & Education & Soft Skills */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <CheckCircle2 className="text-blue-600" /> Qualifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Required Skills */}
                        {job.requiredSkills && job.requiredSkills.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-gray-400" /> Required Skills
                                </h4>
                                <ul className="space-y-2">
                                    {job.requiredSkills.map((skill, index) => (
                                        <li key={index} className="flex items-start gap-3 text-gray-600 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Preferred Skills */}
                        {job.preferredSkills && job.preferredSkills.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Star size={16} className="text-yellow-500" /> Preferred Skills
                                </h4>
                                <ul className="space-y-2">
                                    {job.preferredSkills.map((skill, index) => (
                                        <li key={index} className="flex items-start gap-3 text-gray-600 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 shrink-0"></div>
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Education */}
                        {job.educationRequirements?.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <GraduationCap size={16} className="text-indigo-600" /> Education
                                </h4>
                                <ul className="space-y-2">
                                    {job.educationRequirements.map((req, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0"></div>
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Soft Skills */}
                        {job.softSkills?.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Users size={16} className="text-pink-600" /> Soft Skills
                                </h4>
                                <ul className="space-y-2">
                                    {job.softSkills.map((skill, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-600 mt-2 shrink-0"></div>
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                {/* Apply Card (Sticky optional) */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100  lg:top-24">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Interested?</h3>
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Clock className="text-gray-400" size={18} />
                            <span>{job.employmentType}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <MapPin className="text-gray-400" size={18} />
                            <span>{job.location || 'Remote'}</span>
                        </div>
                        {job.applicationDeadline && (
                            <div className="flex items-center gap-3 text-sm text-orange-600 bg-orange-50 p-2 rounded-lg">
                                <Calendar size={18} />
                                <span className="font-medium">Apply by {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleApply}
                        disabled={hasApplied}
                        className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-lg mb-4 ${
                          hasApplied
                            ? 'bg-green-600 shadow-green-200 cursor-not-allowed opacity-90'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:-translate-y-1'
                        }`}
                    >
                        {hasApplied ? (
                          <span className="flex items-center justify-center gap-2">
                            <CheckCircle2 size={20} /> Application Submitted
                          </span>
                        ) : (
                          'Apply Now'
                        )}
                    </button>
                    <p className="text-xs text-center text-gray-400">
                        Usually responds within 3 days
                    </p>
                </div>

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                        <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                            <Star size={18} className="text-green-600" /> Benefits
                        </h3>
                        <ul className="space-y-2">
                            {job.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-green-800 font-medium">
                                    <CheckCircle2 size={14} className="text-green-600" /> {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
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
