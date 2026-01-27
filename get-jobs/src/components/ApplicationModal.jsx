import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { jobAPI } from '../api/jobAPI';
import { useAuth } from '../context/AuthContext';
import VideoInterview from './VideoInterview';
import { UploadCloud, FileText, CheckCircle2, X, User, Mail, AlertCircle, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/80 flex justify-between items-center sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {step === 1 ? `Apply for ${job.title}` : 'Video Interview'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {step === 1 ? `${job.role} • ${job.level}` : 'Step 2 of 2: Let us know you better'}
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
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors text-lg font-bold"
            >
              <X size={20} />
            </button>
        </div>

        {/* Body - Step 1: Resume Upload */}
        {step === 1 && (
          <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-start gap-2">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <div>
                <strong>Resume submitted successfully!</strong>
                <p className="mt-1">Moving to video interview step...</p>
                <p className="mt-1 text-xs opacity-80">Your resume is being parsed in the background.</p>
              </div>
            </div>
          )}

          {/* Applicant Info */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
              <User size={16} /> Applicant Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-500">Name</label>
                <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                    type="text"
                    value={user.name}
                    disabled
                    className="w-full pl-9 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm focus:outline-none"
                    />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-gray-500">Email</label>
                <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-9 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm focus:outline-none"
                    />
                </div>
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Resume / CV (PDF) <span className="text-red-500">*</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer bg-white ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : resumeFile 
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('resume-upload').click()}
            >
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept="application/pdf"
                onChange={handleFileChange}
              />

              {resumeFile ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="font-medium text-green-800">{resumeFile.name}</p>
                  <p className="text-green-600 text-xs mt-1">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p className="text-xs text-gray-500 mt-2">Click to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <UploadCloud size={24} />
                  </div>
                  <p className="font-medium text-gray-900">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-1">PDF format only (Max 5MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium mb-2 text-gray-700">
              Cover Letter (Optional)
            </label>
            <textarea
              id="coverLetter"
              rows="4"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all text-sm resize-none"
              placeholder="Tell us why you're a great fit for this role..."
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitMutation.isPending || success}
              className="px-8 py-2.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>Submit Application <ArrowRight size={16} /></>
              )}
            </button>
          </div>
          </form>
        )}

        {/* Step 2: Video Interview */}
        {step === 2 && showVideoInterview && applicationId && (
          <div className="flex-1 overflow-hidden bg-gray-100 p-4 rounded-b-2xl">
            <VideoInterview jobId={job._id} applicationId={applicationId} onComplete={handleVideoComplete} onCancel={handleVideoCancel} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationModal;
