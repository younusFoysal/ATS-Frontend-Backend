import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationAPI } from '../api/applicationAPI';
import EvaluationModal from '../components/EvaluationModal';
import { Mail, FileText, Target, Download, Pin, Video, ArrowLeft } from 'lucide-react';

const ApplicationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluationData, setEvaluationData] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationAPI.getApplicationById(id),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status, notes }) => applicationAPI.updateApplicationStatus(id, { status, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries(['application', id]);
      setSelectedStatus('');
      setNotes('');
    },
  });

  const evaluateMutation = useMutation({
    mutationFn: (data) => applicationAPI.evaluateCandidate(data),
    onSuccess: (data) => {
      setEvaluationData(data);
    },
    onError: (error) => {
      console.error('Evaluation error:', error);
      alert('Failed to evaluate candidate. Please try again.');
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#04060D' }}>
        <div style={{ color: '#D3D4D7' }}>Loading application details...</div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#04060D' }}>
        <div style={{ color: '#D3D4D7' }}>Application not found</div>
      </div>
    );
  }

  const application = data.data;
  const videoAnalysis = application.videoAnalysisData;

  const handleStatusUpdate = () => {
    if (selectedStatus) {
      updateStatusMutation.mutate({ status: selectedStatus, notes });
    }
  };

  const handleEvaluate = () => {
    setShowEvaluationModal(true);
    setEvaluationData(null);

    // Prepare evaluation data
    const evaluationPayload = {
      resume: {
        name: application.parsedResumeData?.name || application.applicantName,
        email: application.parsedResumeData?.email || application.applicantEmail,
        phone: application.parsedResumeData?.phone || '',
        skills: application.parsedResumeData?.skills || [],
        education: application.parsedResumeData?.education || [],
        experience: application.parsedResumeData?.experience || [],
        experience_years: application.parsedResumeData?.experience_years || 0
      },
      interview: {
        emotions: videoAnalysis?.emotions || {},
        subtitles: videoAnalysis?.subtitles || {},
        video_metadata: videoAnalysis?.video_metadata || {}
      },
      videoInterviewUrl: application.videoInterviewUrl || '',
      job_description: application.jobId || {},
      job_title: application.jobId?.title || ''
    };

    evaluateMutation.mutate(evaluationPayload);
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      'Happiness': 'bg-blue-500',
      'Neutral': 'bg-gray-400',
      'Sadness': 'bg-indigo-500',
      'Anger': 'bg-red-600',
      'Fear': 'bg-purple-600',
      'Disgust': 'bg-green-600',
      'Surprise': 'bg-yellow-500',
      'Contempt': 'bg-slate-600'
    };
    return colors[emotion] || 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-8 shadow-sm">
        <div className="container mx-auto max-w-6xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={16} /> Back to List
          </button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {application.applicantName}
              </h1>
              <p className="text-lg text-gray-500 mt-1 flex items-center gap-2">
                <Mail size={16} className="text-gray-400" /> {application.applicantEmail}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase border mb-2 ${
                    application.status === 'pending' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    application.status === 'reviewing' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                    application.status === 'shortlisted' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                    application.status === 'accepted' ? 'bg-green-100 text-green-700 border-green-200' :
                    'bg-red-100 text-red-700 border-red-200'
                }`}
              >
                {application.status}
              </span>
              <p className="text-sm text-gray-400">
                Applied: {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Status & Evaluation & Resume */}
            <div className="lg:col-span-2 space-y-8">
                 {/* Resume Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FileText size={20} className="text-gray-500" /> Resume & Profile
                        </h2>
                         <button
                            onClick={handleEvaluate}
                            disabled={evaluateMutation.isPending}
                            className="px-4 py-2 rounded-lg font-medium text-sm text-blue-700 bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                            {evaluateMutation.isPending ? 'Evaluating...' : <><Target size={16} /> Evaluate Candidate</>}
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xl">
                                <FileText size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{application.resumeFileName || 'Resume.pdf'}</p>
                                <p className="text-xs text-gray-500">Uploaded Resume</p>
                            </div>
                            {application.resumeUrl && (
                            <a
                                href={application.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <Download size={16} /> Download
                            </a>
                            )}
                        </div>

                        {application.parsedResumeData && (
                            <div className="space-y-8">
                                {/* Personal Info */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Personal Details</h3>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: 'Full Name', value: application.parsedResumeData.name },
                                            { label: 'Email', value: application.parsedResumeData.email },
                                            { label: 'Phone', value: application.parsedResumeData.phone },
                                            { label: 'Location', value: application.parsedResumeData.location }
                                        ].map((item, i) => item.value && (
                                            <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                                                <p className="font-medium text-gray-900 text-sm">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Skills */}
                                {application.parsedResumeData.skills?.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {application.parsedResumeData.skills.map((skill, index) => (
                                                <span key={index} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Experience */}
                                {application.parsedResumeData.experience?.length > 0 && (
                                     <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Work Experience</h3>
                                        <div className="space-y-4">
                                            {application.parsedResumeData.experience.map((exp, index) => (
                                                <div key={index} className="relative pl-6 border-l-2 border-blue-200 pb-2">
                                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                                                    <h4 className="font-bold text-gray-900 text-lg leading-tight">{exp.title || exp.position || 'Position'}</h4>
                                                    <p className="text-blue-600 font-medium mb-1">{exp.company}</p>
                                                    <p className="text-xs text-gray-500 mb-2">
                                                        {exp.start_date && exp.end_date
                                                        ? `${exp.start_date} - ${exp.end_date}`
                                                        : exp.duration || 'Duration not specified'}
                                                    </p>
                                                    <p className="text-gray-600 text-sm">{exp.description}</p>
                                                     {exp.responsibilities && Array.isArray(exp.responsibilities) && (
                                                        <ul className="text-sm mt-2 list-disc list-inside text-gray-600">
                                                            {exp.responsibilities.map((resp, idx) => (
                                                            <li key={idx}>{resp}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                 {/* Education */}
                                {application.parsedResumeData.education?.length > 0 && (
                                     <div>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Education</h3>
                                        <div className="space-y-4">
                                            {application.parsedResumeData.education.map((edu, index) => (
                                                <div key={index} className="relative pl-6 border-l-2 border-purple-200 pb-2">
                                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-100 border-2 border-purple-500"></div>
                                                    <h4 className="font-bold text-gray-900 text-lg leading-tight">{edu.degree || edu.qualification}</h4>
                                                    <p className="text-purple-600 font-medium mb-1">{edu.institution}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {edu.start_date && edu.end_date
                                                        ? `${edu.start_date} - ${edu.end_date}`
                                                        : edu.year || edu.graduation_year}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                 {/* Cover Letter */}
                {application.coverLetter && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><FileText size={20} className="text-gray-500" /> Cover Letter</h2>
                    </div>
                    <div className="p-6">
                        <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                            {application.coverLetter}
                        </p>
                    </div>
                </div>
                )}
            </div>

            {/* Right Column: Actions & Video */}
            <div className="space-y-8">
                 {/* Status Update Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
                     <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-900">Application Action</h2>
                    </div>
                    <div className="p-6 space-y-4">
                         <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Change Status</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                            >
                                <option value="">Select status...</option>
                                <option value="pending">Pending</option>
                                <option value="reviewing">Reviewing</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Admin Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all min-h-[100px]"
                                placeholder="Internal notes..."
                            />
                        </div>
                        <button
                            onClick={handleStatusUpdate}
                            disabled={!selectedStatus || updateStatusMutation.isPending}
                            className="w-full py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
                        </button>
                    </div>
                </div>

                {/* Admin Notes Display */}
                {application.notes && (
                     <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
                        <h2 className="text-sm font-bold text-yellow-800 uppercase tracking-wide mb-2 flex items-center gap-2"><Pin size={16} /> Previous Notes</h2>
                        <p className="text-yellow-900">{application.notes}</p>
                    </div>
                )}

                 {/* Video Interview */}
                 {application.videoInterviewUrl && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Video size={20} className="text-gray-500" /> Video Interview</h2>
                        </div>
                        <div className="p-6 space-y-6">
                             <div className="rounded-lg overflow-hidden bg-black aspect-video">
                                <video controls className="w-full h-full object-contain">
                                    <source src={application.videoInterviewUrl} type="video/webm" />
                                    <source src={application.videoInterviewUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                             </div>

                             {videoAnalysis && (
                                <div className="space-y-6">
                                    {/* Metrics */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="p-3 bg-gray-50 rounded-lg text-center border border-gray-100">
                                             <div className="text-xs text-gray-500 uppercase">Duration</div>
                                            <div className="font-bold text-gray-900">
                                                 {videoAnalysis.video_metadata ? Math.floor(videoAnalysis.video_metadata.duration_seconds / 60) + ':' + (videoAnalysis.video_metadata.duration_seconds % 60).toFixed(0).padStart(2, '0') : '-'}
                                            </div>
                                        </div>
                                         <div className="p-3 bg-gray-50 rounded-lg text-center border border-gray-100">
                                             <div className="text-xs text-gray-500 uppercase">Res</div>
                                            <div className="font-bold text-gray-900">720p</div>
                                        </div>
                                         <div className="p-3 bg-gray-50 rounded-lg text-center border border-gray-100">
                                             <div className="text-xs text-gray-500 uppercase">FPS</div>
                                            <div className="font-bold text-gray-900">{videoAnalysis.video_metadata?.fps || 30}</div>
                                        </div>
                                    </div>

                                    {/* Emotions */}
                                    {videoAnalysis.emotions && (
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 mb-3">Emotion Analysis</h3>
                                        <div className="space-y-3">
                                            {videoAnalysis.emotions.distribution?.slice(0, 5).map((emotion, index) => (
                                                <div key={index}>
                                                     <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-gray-700 font-medium">{emotion.emotion}</span>
                                                        <span className="text-gray-500">{emotion.score.toFixed(1)}%</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${getEmotionColor(emotion.emotion)}`}
                                                            style={{ width: `${emotion.score}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    )}

                                    {/* Transcript Snippet */}
                                     {videoAnalysis.subtitles?.full_text && (
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Transcript Preview</h3>
                                            <p className="text-sm text-gray-600 line-clamp-4 italic">
                                                "{videoAnalysis.subtitles.full_text}"
                                            </p>
                                        </div>
                                     )}
                                </div>
                             )}
                        </div>
                    </div>
                 )}
            </div>
        </div>
      </div>

      {/* Evaluation Modal */}
      <EvaluationModal
        isOpen={showEvaluationModal}
        onClose={() => setShowEvaluationModal(false)}
        evaluation={evaluationData}
        isLoading={evaluateMutation.isPending}
      />
    </div>
  );
};

export default ApplicationDetail;
