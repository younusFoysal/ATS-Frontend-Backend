import React from 'react';

const EvaluationModal = ({ isOpen, onClose, evaluation, isLoading }) => {
  if (!isOpen) return null;

  const getScoreColor = (score) => {
    if (score >= 4) return '#3E8DE3'; // Sky blue - Excellent
    if (score >= 3) return '#143AA2'; // Dark blue - Good
    if (score >= 2) return '#D3D4D7'; // Gray - Average
    return '#8B0000'; // Dark red - Needs improvement
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
      <div className="w-full rounded-full h-6" style={{ backgroundColor: '#fff' }}>
        <div
          className="h-6 rounded-full flex items-center justify-end pr-2 transition-all"
          style={{
            width: `${percentage}%`,
            backgroundColor: getScoreColor(score)
          }}
        >
          <span className="text-sm font-bold" style={{ color: score >= 2 ? '#D3D4D7' : '#04060D' }}>
            {score.toFixed(1)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: '#D3D4D7' }}
      >
        {/* Header */}
        <div className="sticky top-0 p-6 border-b-2" style={{ backgroundColor: '#D3D4D7', borderColor: '#143AA2' }}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#04060D' }}>
                🎯 Candidate Evaluation
              </h2>
              {evaluation?.evaluation?.mode && (
                <p className="text-sm" style={{ color: '#143AA2' }}>
                  {evaluation.evaluation.mode}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-3xl font-bold hover:opacity-70 transition-opacity"
              style={{ color: '#04060D' }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 mb-4" style={{ borderColor: '#143AA2' }}></div>
              <p className="text-xl font-semibold" style={{ color: '#04060D' }}>
                Evaluating Candidate...
              </p>
              <p className="text-sm mt-2" style={{ color: '#143AA2' }}>
                This may take a few moments
              </p>
            </div>
          ) : evaluation ? (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="p-6 rounded-lg text-center" style={{ backgroundColor: '#143AA2' }}>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#D3D4D7' }}>
                  Overall Score
                </h3>
                <div className="text-6xl font-bold mb-2" style={{ color: '#D3D4D7' }}>
                  {evaluation.evaluation?.overall?.toFixed(2) || 'N/A'}
                  <span className="text-3xl"> / 5.0</span>
                </div>
                <p className="text-lg" style={{ color: '#3E8DE3' }}>
                  {getScoreLabel(evaluation.evaluation?.overall || 0)}
                </p>
              </div>

              {/* Individual Scores */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold" style={{ color: '#04060D' }}>
                  Detailed Scores
                </h3>

                {/* Technical Score */}
                {evaluation.evaluation?.technical !== undefined && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#fff' }}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-bold" style={{ color: '#04060D' }}>
                        💻 Technical Skills
                      </h4>
                      <span className="px-3 py-1 rounded font-bold" style={{ backgroundColor: getScoreColor(evaluation.evaluation.technical), color: '#D3D4D7' }}>
                        {evaluation.evaluation.technical.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <ScoreBar score={evaluation.evaluation.technical} />
                    {evaluation.evaluation.technical_reason && (
                      <p className="mt-3 text-sm" style={{ color: '#04060D' }}>
                        <strong>Reason:</strong> {evaluation.evaluation.technical_reason}
                      </p>
                    )}
                  </div>
                )}

                {/* Experience Score */}
                {evaluation.evaluation?.experience !== undefined && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#fff' }}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-bold" style={{ color: '#04060D' }}>
                        💼 Experience
                      </h4>
                      <span className="px-3 py-1 rounded font-bold" style={{ backgroundColor: getScoreColor(evaluation.evaluation.experience), color: '#D3D4D7' }}>
                        {evaluation.evaluation.experience.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <ScoreBar score={evaluation.evaluation.experience} />
                    {evaluation.evaluation.experience_reason && (
                      <p className="mt-3 text-sm" style={{ color: '#04060D' }}>
                        <strong>Reason:</strong> {evaluation.evaluation.experience_reason}
                      </p>
                    )}
                  </div>
                )}

                {/* Education Score */}
                {evaluation.evaluation?.education !== undefined && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#fff' }}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-bold" style={{ color: '#04060D' }}>
                        🎓 Education
                      </h4>
                      <span className="px-3 py-1 rounded font-bold" style={{ backgroundColor: getScoreColor(evaluation.evaluation.education), color: '#D3D4D7' }}>
                        {evaluation.evaluation.education.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <ScoreBar score={evaluation.evaluation.education} />
                    {evaluation.evaluation.education_reason && (
                      <p className="mt-3 text-sm" style={{ color: '#04060D' }}>
                        <strong>Reason:</strong> {evaluation.evaluation.education_reason}
                      </p>
                    )}
                  </div>
                )}

                {/* Communication Score */}
                {evaluation.evaluation?.communication !== undefined && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#fff' }}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-bold" style={{ color: '#04060D' }}>
                        💬 Communication
                      </h4>
                      <span className="px-3 py-1 rounded font-bold" style={{ backgroundColor: getScoreColor(evaluation.evaluation.communication), color: '#D3D4D7' }}>
                        {evaluation.evaluation.communication.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <ScoreBar score={evaluation.evaluation.communication} />
                    {evaluation.evaluation.communication_reason && (
                      <p className="mt-3 text-sm" style={{ color: '#04060D' }}>
                        <strong>Reason:</strong> {evaluation.evaluation.communication_reason}
                      </p>
                    )}
                  </div>
                )}

                {/* Professionalism Score */}
                {evaluation.evaluation?.professionalism !== undefined && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#fff' }}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-bold" style={{ color: '#04060D' }}>
                        👔 Professionalism
                      </h4>
                      <span className="px-3 py-1 rounded font-bold" style={{ backgroundColor: getScoreColor(evaluation.evaluation.professionalism), color: '#D3D4D7' }}>
                        {evaluation.evaluation.professionalism.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <ScoreBar score={evaluation.evaluation.professionalism} />
                    {evaluation.evaluation.professionalism_reason && (
                      <p className="mt-3 text-sm" style={{ color: '#04060D' }}>
                        <strong>Reason:</strong> {evaluation.evaluation.professionalism_reason}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Summary */}
              {evaluation.summary && (
                <div className="p-6 rounded-lg" style={{ backgroundColor: '#fff' }}>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#04060D' }}>
                    📝 Summary
                  </h3>
                  <div className="prose" style={{ color: '#04060D' }}>
                    {evaluation.summary.split('\n').map((line, index) => (
                      <p key={index} className="mb-2">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Rationale */}
              {evaluation.evaluation?.rationale && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#3E8DE3' }}>
                  <p className="text-sm" style={{ color: '#04060D' }}>
                    <strong>Evaluation Method:</strong> {evaluation.evaluation.rationale}
                  </p>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-lg font-bold transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#143AA2', color: '#D3D4D7' }}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl font-semibold" style={{ color: '#04060D' }}>
                No evaluation data available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;
