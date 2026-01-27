import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { jobAPI } from '../api/jobAPI';
import { useAuth } from '../context/AuthContext';
import VideoInterview from './VideoInterview';

const ApplicationModal = ({ isOpen, onClose, job }) => {
  const { user } = useAuth();
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [showVideoInterview, setShowVideoInterview] = useState(false);
  const [step, setStep] = useState(1); // 1: Resume upload, 2: Video interview

  const submitMutation = useMutation({
    mutationFn: (formData) => jobAPI.submitApplication(job._id, formData),
    onSuccess: (data) => {
      if (data.success) {
        setSuccess(true);
        setError('');
        setApplicationId(data.data.applicationId);

        // Move to video interview step after 2 seconds
        setTimeout(() => {
          setSuccess(false);
          setStep(2);
          setShowVideoInterview(true);
        }, 2000);
      } else {
        setError(data.message || 'Application submission failed');
      }
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'An error occurred while submitting your application');
    },
  });

  const handleVideoComplete = () => {
    setShowVideoInterview(false);
    // Close modal and reset after video upload
    setTimeout(() => {
      onClose();
      resetForm();
    }, 500);
  };

  const handleVideoCancel = () => {
    setShowVideoInterview(false);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setResumeFile(null);
    setCoverLetter('');
    setApplicationId(null);
    setSuccess(false);
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setResumeFile(file);
      setError('');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setResumeFile(file);
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!resumeFile) {
      setError('Please upload your resume');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobId', job._id);
    formData.append('userId', user.id);
    formData.append('applicantName', user.name);
    formData.append('applicantEmail', user.email);
    if (coverLetter.trim()) {
      formData.append('coverLetter', coverLetter);
    }

    submitMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: '#D3D4D7' }}
      >
        {/* Header */}
        <div className="sticky top-0 p-6 border-b-2" style={{ backgroundColor: '#D3D4D7', borderColor: '#143AA2' }}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#04060D' }}>
                {step === 1 ? `Apply for ${job.title}` : 'Video Interview'}
              </h2>
              <p className="text-sm" style={{ color: '#143AA2' }}>
                {step === 1 ? `${job.role} • ${job.level}` : 'Step 2 of 2'}
              </p>
            </div>
            <button
              onClick={() => {
                if (step === 2) {
                  handleVideoCancel();
                } else {
                  onClose();
                }
              }}
              className="text-2xl font-bold hover:opacity-70 transition-opacity"
              style={{ color: '#04060D' }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Body - Step 1: Resume Upload */}
        {step === 1 && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 rounded" style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}>
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 rounded" style={{ backgroundColor: '#3E8DE3', color: '#04060D' }}>
              <strong>✓ Resume submitted successfully!</strong>
              <p className="mt-2">Moving to video interview step...</p>
              <p className="mt-1 text-sm">Your resume is being parsed in the background.</p>
            </div>
          )}

          {/* Applicant Info */}
          <div>
            <h3 className="text-lg font-bold mb-3" style={{ color: '#04060D' }}>
              Applicant Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#04060D' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={user.name}
                  disabled
                  className="w-full px-4 py-2 rounded border-2"
                  style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D', opacity: 0.7 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#04060D' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 rounded border-2"
                  style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D', opacity: 0.7 }}
                />
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <h3 className="text-lg font-bold mb-3" style={{ color: '#04060D' }}>
              Upload Resume *
            </h3>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-opacity-100' : 'border-opacity-50'
              }`}
              style={{ borderColor: '#143AA2' }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {resumeFile ? (
                <div>
                  <div className="text-4xl mb-2">📄</div>
                  <p className="font-semibold" style={{ color: '#04060D' }}>
                    {resumeFile.name}
                  </p>
                  <p className="text-sm mt-1" style={{ color: '#143AA2' }}>
                    {(resumeFile.size / 1024).toFixed(2)} KB
                  </p>
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="mt-3 px-4 py-2 rounded font-semibold hover:opacity-90"
                    style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-2">📁</div>
                  <p className="font-semibold mb-2" style={{ color: '#04060D' }}>
                    Drag and drop your resume here
                  </p>
                  <p className="text-sm mb-4" style={{ color: '#143AA2' }}>
                    or click to browse (PDF only, max 5MB)
                  </p>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={submitMutation.isPending}
                    />
                    <span
                      className="px-6 py-2 rounded font-semibold cursor-pointer hover:opacity-90 inline-block"
                      style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
                    >
                      Choose File
                    </span>
                  </label>
                </div>
              )}
            </div>
            <p className="text-xs mt-2" style={{ color: '#143AA2' }}>
              * Your resume will be automatically parsed in the background (takes 3-5 minutes)
            </p>
          </div>

          {/* Cover Letter */}
          <div>
            <h3 className="text-lg font-bold mb-3" style={{ color: '#04060D' }}>
              Cover Letter <span className="text-sm font-normal">(Optional)</span>
            </h3>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows="6"
              placeholder="Tell us why you're a great fit for this position..."
              className="w-full px-4 py-3 rounded border-2 focus:outline-none"
              style={{ backgroundColor: '#fff', borderColor: '#143AA2', color: '#04060D' }}
              disabled={submitMutation.isPending}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitMutation.isPending || !resumeFile || success}
              className="flex-1 py-3 rounded-lg font-bold transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
            >
              {submitMutation.isPending ? 'Submitting...' : success ? 'Moving to Video Interview...' : 'Next: Video Interview'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitMutation.isPending}
              className="px-8 py-3 rounded-lg font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: '#3E8DE3', color: '#04060D' }}
            >
              Cancel
            </button>
          </div>
        </form>
        )}

        {/* Body - Step 2: Video Interview */}
        {step === 2 && showVideoInterview && applicationId && (
          <div className="p-6">
            <VideoInterview
              applicationId={applicationId}
              onComplete={handleVideoComplete}
              onCancel={handleVideoCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationModal;
