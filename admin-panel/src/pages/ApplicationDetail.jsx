import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationAPI } from '../api/applicationAPI';
import EvaluationModal from '../components/EvaluationModal';

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
      'Happiness': '#3E8DE3',
      'Neutral': '#D3D4D7',
      'Sadness': '#143AA2',
      'Anger': '#8B0000',
      'Fear': '#4B0082',
      'Disgust': '#556B2F',
      'Surprise': '#FF8C00',
      'Contempt': '#2F4F4F'
    };
    return colors[emotion] || '#D3D4D7';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#04060D' }}>
      {/* Header */}
      <div className="p-4 border-b-2" style={{ borderColor: '#143AA2' }}>
        <div className="container mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-lg hover:opacity-80"
            style={{ color: '#3E8DE3' }}
          >
            ← Back
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#D3D4D7' }}>
                {application.applicantName}
              </h1>
              <p className="text-xl mt-2" style={{ color: '#3E8DE3' }}>
                {application.applicantEmail}
              </p>
            </div>
            <div className="text-right">
              <span
                className="px-6 py-3 rounded-lg font-bold text-lg uppercase inline-block"
                style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
              >
                {application.status}
              </span>
              <p className="mt-2 text-sm" style={{ color: '#D3D4D7' }}>
                Applied: {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Status Update Section */}
        <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: '#D3D4D7' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#04060D' }}>
            Update Application Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                New Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 rounded border-2"
                style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
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
              <label className="block text-sm font-medium mb-2" style={{ color: '#04060D' }}>
                Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 rounded border-2"
                style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
                placeholder="Add notes..."
              />
            </div>
          </div>
          <button
            onClick={handleStatusUpdate}
            disabled={!selectedStatus || updateStatusMutation.isPending}
            className="mt-4 px-6 py-2 rounded font-semibold disabled:opacity-50"
            style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
          >
            {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
          </button>
        </div>

        {/* Resume Section */}
        <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: '#D3D4D7' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold" style={{ color: '#04060D' }}>
              📄 Resume Information
            </h2>
            <button
              onClick={handleEvaluate}
              disabled={evaluateMutation.isPending}
              className="px-6 py-3 rounded-lg font-bold transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#3E8DE3', color: '#04060D' }}
            >
              {evaluateMutation.isPending ? 'Evaluating...' : '🎯 Evaluate Candidate'}
            </button>
          </div>

          <div className="mb-4">
            <p className="text-lg" style={{ color: '#04060D' }}>
              <strong>File:</strong> {application.resumeFileName || 'Resume.pdf'}
            </p>
            {application.resumeUrl && (
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block px-4 py-2 rounded font-semibold hover:opacity-90"
                style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
              >
                📥 Download Resume
              </a>
            )}
          </div>

          {application.parsedResumeData && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#143AA2' }}>
                Candidate Profile
              </h3>

              {/* Personal Information */}
              {(application.parsedResumeData.name || application.parsedResumeData.email || application.parsedResumeData.phone || application.parsedResumeData.location) && (
                <div className="mb-6 p-4 rounded" style={{ backgroundColor: '#fff' }}>
                  <h4 className="text-lg font-bold mb-3" style={{ color: '#04060D' }}>
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {application.parsedResumeData.name && (
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#143AA2' }}>Full Name</p>
                        <p style={{ color: '#04060D' }}>{application.parsedResumeData.name}</p>
                      </div>
                    )}
                    {application.parsedResumeData.email && (
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#143AA2' }}>Email</p>
                        <p style={{ color: '#04060D' }}>{application.parsedResumeData.email}</p>
                      </div>
                    )}
                    {application.parsedResumeData.phone && (
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#143AA2' }}>Phone</p>
                        <p style={{ color: '#04060D' }}>{application.parsedResumeData.phone}</p>
                      </div>
                    )}
                    {application.parsedResumeData.location && (
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#143AA2' }}>Location</p>
                        <p style={{ color: '#04060D' }}>{application.parsedResumeData.location}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Skills */}
              {application.parsedResumeData.skills && application.parsedResumeData.skills.length > 0 && (
                <div className="mb-6 p-4 rounded" style={{ backgroundColor: '#fff' }}>
                  <h4 className="text-lg font-bold mb-3" style={{ color: '#04060D' }}>
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {application.parsedResumeData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded text-sm font-semibold"
                        style={{ backgroundColor: '#3E8DE3', color: '#04060D' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {application.parsedResumeData.experience && application.parsedResumeData.experience.length > 0 && (
                <div className="mb-6 p-4 rounded" style={{ backgroundColor: '#fff' }}>
                  <h4 className="text-lg font-bold mb-3" style={{ color: '#04060D' }}>
                    Work Experience
                  </h4>
                  <div className="space-y-4">
                    {application.parsedResumeData.experience.map((exp, index) => (
                      <div key={index} className="border-l-4 pl-4" style={{ borderColor: '#143AA2' }}>
                        <h5 className="font-bold text-lg" style={{ color: '#04060D' }}>
                          {exp.title || exp.position || 'Position'}
                        </h5>
                        {exp.company && (
                          <p className="font-semibold" style={{ color: '#143AA2' }}>
                            {exp.company}
                          </p>
                        )}
                        {(exp.start_date || exp.end_date || exp.duration) && (
                          <p className="text-sm mb-2" style={{ color: '#143AA2' }}>
                            {exp.start_date && exp.end_date
                              ? `${exp.start_date} - ${exp.end_date}`
                              : exp.duration || 'Duration not specified'}
                          </p>
                        )}
                        {exp.description && (
                          <p className="text-sm" style={{ color: '#04060D' }}>
                            {exp.description}
                          </p>
                        )}
                        {exp.responsibilities && Array.isArray(exp.responsibilities) && (
                          <ul className="text-sm mt-2 list-disc list-inside" style={{ color: '#04060D' }}>
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
              {application.parsedResumeData.education && application.parsedResumeData.education.length > 0 && (
                <div className="mb-6 p-4 rounded" style={{ backgroundColor: '#fff' }}>
                  <h4 className="text-lg font-bold mb-3" style={{ color: '#04060D' }}>
                    Education
                  </h4>
                  <div className="space-y-4">
                    {application.parsedResumeData.education.map((edu, index) => (
                      <div key={index} className="border-l-4 pl-4" style={{ borderColor: '#3E8DE3' }}>
                        <h5 className="font-bold text-lg" style={{ color: '#04060D' }}>
                          {edu.degree || edu.qualification || 'Degree'}
                        </h5>
                        {edu.institution && (
                          <p className="font-semibold" style={{ color: '#143AA2' }}>
                            {edu.institution}
                          </p>
                        )}
                        {(edu.start_date || edu.end_date || edu.year || edu.graduation_year) && (
                          <p className="text-sm" style={{ color: '#143AA2' }}>
                            {edu.start_date && edu.end_date
                              ? `${edu.start_date} - ${edu.end_date}`
                              : edu.year || edu.graduation_year || 'Year not specified'}
                          </p>
                        )}
                        {edu.field && (
                          <p className="text-sm" style={{ color: '#04060D' }}>
                            Field: {edu.field}
                          </p>
                        )}
                        {edu.gpa && (
                          <p className="text-sm" style={{ color: '#04060D' }}>
                            GPA: {edu.gpa}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {application.parsedResumeData.certifications && application.parsedResumeData.certifications.length > 0 && (
                <div className="mb-6 p-4 rounded" style={{ backgroundColor: '#fff' }}>
                  <h4 className="text-lg font-bold mb-3" style={{ color: '#04060D' }}>
                    Certifications
                  </h4>
                  <div className="space-y-2">
                    {application.parsedResumeData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span style={{ color: '#143AA2' }}>•</span>
                        <div>
                          <p className="font-semibold" style={{ color: '#04060D' }}>
                            {typeof cert === 'string' ? cert : cert.name || cert.title}
                          </p>
                          {typeof cert === 'object' && cert.issuer && (
                            <p className="text-sm" style={{ color: '#143AA2' }}>
                              Issued by: {cert.issuer}
                            </p>
                          )}
                          {typeof cert === 'object' && cert.date && (
                            <p className="text-sm" style={{ color: '#143AA2' }}>
                              Date: {cert.date}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {application.parsedResumeData.languages && application.parsedResumeData.languages.length > 0 && (
                <div className="mb-6 p-4 rounded" style={{ backgroundColor: '#fff' }}>
                  <h4 className="text-lg font-bold mb-3" style={{ color: '#04060D' }}>
                    Languages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {application.parsedResumeData.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded text-sm font-semibold"
                        style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
                      >
                        {typeof lang === 'string' ? lang : `${lang.name} (${lang.proficiency})`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {application.parsedResumeData.projects && application.parsedResumeData.projects.length > 0 && (
                <div className="mb-6 p-4 rounded" style={{ backgroundColor: '#fff' }}>
                  <h4 className="text-lg font-bold mb-3" style={{ color: '#04060D' }}>
                    Projects
                  </h4>
                  <div className="space-y-4">
                    {application.parsedResumeData.projects.map((project, index) => (
                      <div key={index} className="border-l-4 pl-4" style={{ borderColor: '#3E8DE3' }}>
                        <h5 className="font-bold" style={{ color: '#04060D' }}>
                          {project.name || project.title}
                        </h5>
                        {project.description && (
                          <p className="text-sm mt-1" style={{ color: '#04060D' }}>
                            {project.description}
                          </p>
                        )}
                        {project.technologies && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(Array.isArray(project.technologies) ? project.technologies : [project.technologies]).map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 rounded text-xs"
                                style={{ backgroundColor: '#D3D4D7', color: '#04060D' }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary/About */}
              {application.parsedResumeData.summary && (
                <div className="mb-6 p-4 rounded" style={{ backgroundColor: '#fff' }}>
                  <h4 className="text-lg font-bold mb-3" style={{ color: '#04060D' }}>
                    Professional Summary
                  </h4>
                  <p style={{ color: '#04060D' }}>
                    {application.parsedResumeData.summary}
                  </p>
                </div>
              )}

              {/* Additional Information */}
              {(application.parsedResumeData.linkedin || application.parsedResumeData.github || application.parsedResumeData.website || application.parsedResumeData.portfolio) && (
                <div className="mb-6 p-4 rounded" style={{ backgroundColor: '#fff' }}>
                  <h4 className="text-lg font-bold mb-3" style={{ color: '#04060D' }}>
                    Online Presence
                  </h4>
                  <div className="space-y-2">
                    {application.parsedResumeData.linkedin && (
                      <p>
                        <span className="font-semibold" style={{ color: '#143AA2' }}>LinkedIn: </span>
                        <a href={application.parsedResumeData.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: '#04060D' }}>
                          {application.parsedResumeData.linkedin}
                        </a>
                      </p>
                    )}
                    {application.parsedResumeData.github && (
                      <p>
                        <span className="font-semibold" style={{ color: '#143AA2' }}>GitHub: </span>
                        <a href={application.parsedResumeData.github} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: '#04060D' }}>
                          {application.parsedResumeData.github}
                        </a>
                      </p>
                    )}
                    {application.parsedResumeData.website && (
                      <p>
                        <span className="font-semibold" style={{ color: '#143AA2' }}>Website: </span>
                        <a href={application.parsedResumeData.website} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: '#04060D' }}>
                          {application.parsedResumeData.website}
                        </a>
                      </p>
                    )}
                    {application.parsedResumeData.portfolio && (
                      <p>
                        <span className="font-semibold" style={{ color: '#143AA2' }}>Portfolio: </span>
                        <a href={application.parsedResumeData.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: '#04060D' }}>
                          {application.parsedResumeData.portfolio}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cover Letter */}
        {application.coverLetter && (
          <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: '#D3D4D7' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#04060D' }}>
              📝 Cover Letter
            </h2>
            <p className="whitespace-pre-line" style={{ color: '#04060D' }}>
              {application.coverLetter}
            </p>
          </div>
        )}

        {/* Video Interview Section */}
        {application.videoInterviewUrl && (
          <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: '#D3D4D7' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#04060D' }}>
              🎥 Video Interview
            </h2>

            <div className="mb-6">
              <video
                controls
                className="w-full rounded-lg"
                style={{ maxHeight: '500px', backgroundColor: '#04060D' }}
              >
                <source src={application.videoInterviewUrl} type="video/webm" />
                <source src={application.videoInterviewUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {videoAnalysis && (
              <div className="space-y-6">
                {/* Video Metadata */}
                {videoAnalysis.video_metadata && (
                  <div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: '#143AA2' }}>
                      Video Information
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 rounded" style={{ backgroundColor: '#3E8DE3' }}>
                        <p className="text-sm" style={{ color: '#04060D' }}>Duration</p>
                        <p className="text-2xl font-bold" style={{ color: '#04060D' }}>
                          {Math.floor(videoAnalysis.video_metadata.duration_seconds / 60)}:
                          {(videoAnalysis.video_metadata.duration_seconds % 60).toFixed(0).padStart(2, '0')}
                        </p>
                      </div>
                      <div className="p-3 rounded" style={{ backgroundColor: '#3E8DE3' }}>
                        <p className="text-sm" style={{ color: '#04060D' }}>Resolution</p>
                        <p className="text-2xl font-bold" style={{ color: '#04060D' }}>
                          {videoAnalysis.video_metadata.resolution?.width}x
                          {videoAnalysis.video_metadata.resolution?.height}
                        </p>
                      </div>
                      <div className="p-3 rounded" style={{ backgroundColor: '#3E8DE3' }}>
                        <p className="text-sm" style={{ color: '#04060D' }}>FPS</p>
                        <p className="text-2xl font-bold" style={{ color: '#04060D' }}>
                          {videoAnalysis.video_metadata.fps}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Emotion Analysis */}
                {videoAnalysis.emotions && (
                  <div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: '#143AA2' }}>
                      Emotion Analysis
                    </h3>

                    <div className="mb-4 p-4 rounded" style={{ backgroundColor: '#143AA2' }}>
                      <p className="text-lg" style={{ color: '#D3D4D7' }}>
                        <strong>Dominant Emotion:</strong> {videoAnalysis.emotions.dominant_emotion}
                      </p>
                      {videoAnalysis.processing_info && (
                        <p className="text-sm mt-2" style={{ color: '#D3D4D7' }}>
                          Analyzed {videoAnalysis.processing_info.emotion_frames_analyzed} frames
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      {videoAnalysis.emotions.distribution?.map((emotion, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span style={{ color: '#04060D' }}>{emotion.emotion}</span>
                            <span style={{ color: '#04060D' }}>{emotion.score.toFixed(2)}%</span>
                          </div>
                          <div className="w-full rounded-full h-4" style={{ backgroundColor: '#fff' }}>
                            <div
                              className="h-4 rounded-full transition-all"
                              style={{
                                width: `${emotion.score}%`,
                                backgroundColor: getEmotionColor(emotion.emotion)
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transcript */}
                {videoAnalysis.subtitles && (
                  <div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: '#143AA2' }}>
                      Interview Transcript
                    </h3>

                    {videoAnalysis.subtitles.full_text && (
                      <div className="mb-4 p-4 rounded" style={{ backgroundColor: '#fff', borderLeft: '4px solid #143AA2' }}>
                        <p className="text-lg leading-relaxed" style={{ color: '#04060D' }}>
                          {videoAnalysis.subtitles.full_text}
                        </p>
                      </div>
                    )}

                    {videoAnalysis.subtitles.segments && videoAnalysis.subtitles.segments.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-lg font-bold mb-3" style={{ color: '#04060D' }}>
                          Transcript Timeline
                        </h4>
                        <div className="space-y-3">
                          {videoAnalysis.subtitles.segments.map((segment, index) => (
                            <div
                              key={index}
                              className="p-3 rounded"
                              style={{ backgroundColor: '#fff', borderLeft: '3px solid #3E8DE3' }}
                            >
                              <p className="text-sm mb-1" style={{ color: '#143AA2' }}>
                                <strong>
                                  {Math.floor(segment.start / 60)}:
                                  {(segment.start % 60).toFixed(1).padStart(4, '0')} -
                                  {Math.floor(segment.end / 60)}:
                                  {(segment.end % 60).toFixed(1).padStart(4, '0')}
                                </strong>
                              </p>
                              <p style={{ color: '#04060D' }}>{segment.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Processing Info */}
                {videoAnalysis.processing_info && (
                  <div className="p-4 rounded" style={{ backgroundColor: '#fff' }}>
                    <h4 className="text-lg font-bold mb-2" style={{ color: '#04060D' }}>
                      Analysis Details
                    </h4>
                    <div className="text-sm space-y-1" style={{ color: '#04060D' }}>
                      <p><strong>Emotion Model:</strong> {videoAnalysis.processing_info.emotion_model}</p>
                      <p><strong>Frames Analyzed:</strong> {videoAnalysis.processing_info.emotion_frames_analyzed}</p>
                      <p><strong>Subtitle Segments:</strong> {videoAnalysis.processing_info.subtitle_segments_count}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Admin Notes */}
        {application.notes && (
          <div className="p-6 rounded-lg" style={{ backgroundColor: '#D3D4D7' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#04060D' }}>
              📌 Admin Notes
            </h2>
            <p style={{ color: '#04060D' }}>{application.notes}</p>
          </div>
        )}
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
