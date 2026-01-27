import React from 'react';
import { Target, Code, Briefcase, GraduationCap, MessageSquare, UserCheck, FileText, ClipboardList, X } from 'lucide-react';

const EvaluationModal = ({ isOpen, onClose, evaluation, isLoading }) => {
  if (!isOpen) return null;

  const getScoreColor = (score) => {
    if (score >= 4) return 'bg-blue-500'; // Excellent
    if (score >= 3) return 'bg-indigo-500'; // Good
    if (score >= 2) return 'bg-gray-400'; // Average
    return 'bg-red-600'; // Needs improvement
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 4) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (score >= 3) return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    if (score >= 2) return 'bg-gray-100 text-gray-700 border-gray-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getScoreLabel = (score) => {
    if (score >= 4) return 'Excellent';
    if (score >= 3) return 'Good';
    if (score >= 2) return 'Average';
    if (score >= 1) return 'Fair';
    return 'Needs Improvement';
  };

  const ScoreBar = ({ score, maxScore = 5 }) => {
    const percentage = (score / maxScore) * 100;
    return (
      <div className="w-full rounded-full h-3 bg-gray-100 mt-2">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${getScoreColor(score)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/80 flex justify-between items-center sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Target size={24} className="text-blue-600" /> Performance Evaluation
              </h2>
              {evaluation?.evaluation?.mode && (
                <p className="text-xs text-gray-500 mt-0.5">
                  AI Model: {evaluation.evaluation.mode}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors text-lg font-bold"
            >
              <X size={20} />
            </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900">Evaluating Candidate...</h3>
              <p className="text-gray-500 mt-2">Analyzing resume, video interview, and job fit.</p>
            </div>
          ) : evaluation ? (
            <div className="space-y-8">
              {/* Overall Score Card */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white shadow-lg shadow-blue-200/50">
                <h3 className="text-blue-100 font-medium uppercase tracking-wider text-sm mb-2">
                  Overall Qualification Score
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-6xl font-bold tracking-tight">{evaluation.evaluation?.overall?.toFixed(1) || '0.0'}</span>
                    <span className="text-2xl text-blue-200">/ 5.0</span>
                </div>
                <div className="inline-flex px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-sm font-semibold">
                  {getScoreLabel(evaluation.evaluation?.overall || 0)}
                </div>
              </div>

              {/* Detailed Scores Grid */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ClipboardList size={22} className="text-blue-600" /> Detailed Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Technical Score */}
                    {evaluation.evaluation?.technical !== undefined && (
                    <div className="p-5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Code size={18} className="text-gray-500" /> Technical Skills
                            </h4>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${getScoreBadgeColor(evaluation.evaluation.technical)}`}>
                                {evaluation.evaluation.technical.toFixed(1)}/5.0
                            </span>
                        </div>
                        <ScoreBar score={evaluation.evaluation.technical} />
                        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                             {evaluation.evaluation.technical_reason}
                        </p>
                    </div>
                    )}

                    {/* Experience Score */}
                    {evaluation.evaluation?.experience !== undefined && (
                    <div className="p-5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Briefcase size={18} className="text-gray-500" /> Experience
                            </h4>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${getScoreBadgeColor(evaluation.evaluation.experience)}`}>
                                {evaluation.evaluation.experience.toFixed(1)}/5.0
                            </span>
                        </div>
                        <ScoreBar score={evaluation.evaluation.experience} />
                        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                             {evaluation.evaluation.experience_reason}
                        </p>
                    </div>
                    )}

                    {/* Education Score */}
                    {evaluation.evaluation?.education !== undefined && (
                    <div className="p-5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <GraduationCap size={18} className="text-gray-500" /> Education
                            </h4>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${getScoreBadgeColor(evaluation.evaluation.education)}`}>
                                {evaluation.evaluation.education.toFixed(1)}/5.0
                            </span>
                        </div>
                        <ScoreBar score={evaluation.evaluation.education} />
                        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                             {evaluation.evaluation.education_reason}
                        </p>
                    </div>
                    )}

                    {/* Communication Score */}
                    {evaluation.evaluation?.communication !== undefined && (
                    <div className="p-5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <MessageSquare size={18} className="text-gray-500" /> Communication
                            </h4>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${getScoreBadgeColor(evaluation.evaluation.communication)}`}>
                                {evaluation.evaluation.communication.toFixed(1)}/5.0
                            </span>
                        </div>
                        <ScoreBar score={evaluation.evaluation.communication} />
                        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                             {evaluation.evaluation.communication_reason}
                        </p>
                    </div>
                    )}

                    {/* Professionalism Score */}
                    {evaluation.evaluation?.professionalism !== undefined && (
                    <div className="p-5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all md:col-span-2">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <UserCheck size={18} className="text-gray-500" /> Professionalism
                            </h4>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${getScoreBadgeColor(evaluation.evaluation.professionalism)}`}>
                                {evaluation.evaluation.professionalism.toFixed(1)}/5.0
                            </span>
                        </div>
                        <ScoreBar score={evaluation.evaluation.professionalism} />
                        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                             {evaluation.evaluation.professionalism_reason}
                        </p>
                    </div>
                    )}
                </div>
              </div>

              {/* Summary */}
              {evaluation.summary && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-gray-500" /> Executive Summary
                  </h3>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    {evaluation.summary.split('\n').map((line, index) => (
                      <p key={index} className="mb-2 leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Close Report
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-300 mb-4 flex justify-center">
                <ClipboardList size={64} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No evaluation data</h3>
              <p className="text-gray-500">Run an evaluation to see the results here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;
