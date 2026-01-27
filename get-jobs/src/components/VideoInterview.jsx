import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { jobAPI } from '../api/jobAPI';

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
    <div className="space-y-6">
      {/* Instructions */}
      {!isRecording && !showPreview && (
        <div className="p-6 rounded-lg" style={{ backgroundColor: '#3E8DE3' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: '#04060D' }}>
            📹 Video Interview Instructions
          </h3>
          <div className="space-y-3" style={{ color: '#04060D' }}>
            <p>• This interview should be <strong>5-10 minutes</strong> long</p>
            <p>• Please answer the following questions</p>
            <p>• <strong>Speak only in English</strong></p>
            <p>• Ensure good lighting and minimal background noise</p>
            <p>• Look at the camera while speaking</p>
          </div>
        </div>
      )}

      {/* Questions */}
      {!isRecording && !showPreview && (
        <div className="p-6 rounded-lg" style={{ backgroundColor: '#D3D4D7' }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#04060D' }}>
            Questions to Answer:
          </h3>
          <ol className="space-y-3" style={{ color: '#04060D' }}>
            {questions.map((question, index) => (
              <li key={index} className="flex">
                <span className="font-bold mr-2">{index + 1}.</span>
                <span>{question}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded" style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}>
          {error}
        </div>
      )}

      {/* Camera Preview / Recording */}
      {!showPreview && (
        <div className="relative rounded-lg overflow-hidden" style={{ backgroundColor: '#04060D' }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full"
            style={{ maxHeight: '500px', objectFit: 'cover' }}
          />

          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(212, 51, 51, 0.9)' }}>
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="text-white font-bold">{formatTime(recordingTime)} / 10:00</span>
            </div>
          )}

          {/* Recording Status */}
          {isRecording && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(4, 6, 13, 0.8)' }}>
              <span className="text-white font-bold">Recording in progress...</span>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {showPreview && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#3E8DE3' }}>
            <h3 className="text-lg font-bold" style={{ color: '#04060D' }}>
              📹 Review Your Recording
            </h3>
            <p style={{ color: '#04060D' }}>Duration: {formatTime(recordingTime)}</p>
          </div>
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#04060D' }}>
            <video
              ref={previewVideoRef}
              controls
              className="w-full"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4 justify-center">
        {!isRecording && !showPreview && (
          <>
            <button
              onClick={startRecording}
              className="px-8 py-4 rounded-lg font-bold text-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
            >
              📹 Open Camera and Record
            </button>
            <button
              onClick={onCancel}
              className="px-8 py-4 rounded-lg font-bold text-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: '#D3D4D7', color: '#04060D' }}
            >
              Cancel
            </button>
          </>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="px-12 py-4 rounded-lg font-bold text-xl transition-colors hover:opacity-90"
            style={{ backgroundColor: '#D3D4D7', color: '#04060D' }}
          >
            ⏹️ Stop Recording
          </button>
        )}

        {showPreview && (
          <>
            <button
              onClick={handleDone}
              disabled={uploadMutation.isPending}
              className="px-8 py-4 rounded-lg font-bold text-lg transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
            >
              {uploadMutation.isPending ? 'Uploading...' : '✓ Done - Submit Interview'}
            </button>
            <button
              onClick={handleRetake}
              disabled={uploadMutation.isPending}
              className="px-8 py-4 rounded-lg font-bold text-lg transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#3E8DE3', color: '#04060D' }}
            >
              🔄 Retake
            </button>
            <button
              onClick={onCancel}
              disabled={uploadMutation.isPending}
              className="px-8 py-4 rounded-lg font-bold text-lg transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#D3D4D7', color: '#04060D' }}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Important Note */}
      <div className="p-4 rounded-lg border-2" style={{ backgroundColor: '#D3D4D7', borderColor: '#143AA2' }}>
        <p className="text-sm text-center font-semibold" style={{ color: '#143AA2' }}>
          ⚠️ Important: Please speak only in English during the interview
        </p>
      </div>
    </div>
  );
};

export default VideoInterview;
