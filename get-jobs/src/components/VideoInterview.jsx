import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { jobAPI } from '../api/jobAPI';
import { Video, Mic, StopCircle, RotateCcw, Check, RefreshCw, AlertCircle, Camera } from 'lucide-react';

const VideoInterview = ({ applicationId, onComplete, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const previewVideoRef = useRef(null);

  const uploadMutation = useMutation({
    mutationFn: ({ applicationId, videoBlob }) => jobAPI.uploadVideoInterview(applicationId, videoBlob),
    onSuccess: () => {
      onComplete();
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to upload video');
    }
  });

  const questions = [
    "Tell us about yourself and your background.",
    "Why do you want to join our company?",
    "Why should we choose you for this position?",
    "What are your salary expectations?",
    "Describe a challenging project you've worked on."
  ];

  useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setError('');
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please grant camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startRecording = async () => {
    if (!streamRef.current) {
      await startCamera();
    }

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp9'
      });

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks);
        setShowPreview(true);
        stopCamera();
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          // Auto-stop at 10 minutes (600 seconds)
          if (newTime >= 600) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);

    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording. Please try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleDone = async () => {
    if (recordedChunks.length === 0) {
      setError('No recording found. Please record your interview first.');
      return;
    }

    const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
    uploadMutation.mutate({ applicationId, videoBlob });
  };

  const handleRetake = () => {
    setRecordedChunks([]);
    setShowPreview(false);
    setRecordingTime(0);
    startCamera();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (showPreview && recordedChunks.length > 0 && previewVideoRef.current) {
      const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(videoBlob);
      previewVideoRef.current.src = videoUrl;
    }
  }, [showPreview, recordedChunks]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Instructions */}
      {!isRecording && !showPreview && (
        <div className="p-6 rounded-xl bg-blue-50 border border-blue-100 mb-2">
          <h3 className="text-lg font-bold mb-4 text-blue-900 flex items-center gap-2">
            <Video size={20} /> Video Interview Instructions
          </h3>
          <div className="space-y-3 text-blue-800 text-sm">
            <p className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div> Make sure your response is <strong>5-10 minutes</strong> long</p>
            <p className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div> Please answer all the questions below</p>
            <p className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div> <strong>Speak only in English</strong> clearly</p>
            <p className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div> Ensure proper lighting and a quiet environment</p>
          </div>
        </div>
      )}

      {/* Questions */}
      {!isRecording && !showPreview && (
        <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
          <h3 className="text-sm font-bold mb-4 text-gray-500 uppercase tracking-wide">
            Questions to Answer
          </h3>
          <ol className="space-y-4 text-gray-700">
            {questions.map((question, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xs font-bold">{index + 1}</span>
                <span className="font-medium text-sm pt-0.5">{question}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Video Recorder/Player Area */}
      <div className={`relative bg-black rounded-2xl overflow-hidden shadow-lg border border-gray-800 flex-1 min-h-[300px] flex items-center justify-center ${!isRecording && !showPreview ? 'hidden' : 'block'}`}>
        {!showPreview ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
            />
            {isRecording && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                {formatTime(recordingTime)}
              </div>
            )}
          </>
        ) : (
          <video
            ref={previewVideoRef}
            controls
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 pt-2">
        {!isRecording && !showPreview ? (
          <>
            <button
              onClick={onCancel}
              className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={startRecording}
              className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              <Camera size={20} /> Open Camera & Record
            </button>
          </>
        ) : isRecording ? (
          <button
            onClick={stopRecording}
            className="px-8 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center gap-2"
          >
            <StopCircle size={20} /> Stop Recording
          </button>
        ) : (
          <>
            <button
              onClick={handleRetake}
              className="px-6 py-3 rounded-xl font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={18} /> Retake
            </button>
            <button
              onClick={handleDone}
              disabled={uploadMutation.isPending}
              className="px-8 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {uploadMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>Submit Interview <Check size={20} /></>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoInterview;
