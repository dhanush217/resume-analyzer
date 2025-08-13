import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  TrendingUp,
  Target,
  Lightbulb,
  Award,
  BarChart3,
  Download,
  Share2
} from 'lucide-react';

const AnalysisResults = ({ results, jobRole, onNewAnalysis }) => {
  const { score, matchedKeywords, missingKeywords, feedback, analysis, aiPowered } = results;

  // Determine score category and styling
  const getScoreCategory = (score) => {
    if (score >= 80) return { category: 'excellent', color: 'success', label: 'Excellent Match' };
    if (score >= 60) return { category: 'good', color: 'primary', label: 'Good Match' };
    if (score >= 40) return { category: 'moderate', color: 'warning', label: 'Needs Improvement' };
    return { category: 'poor', color: 'danger', label: 'Significant Issues' };
  };

  const scoreInfo = getScoreCategory(score);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header with Score */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block"
        >
          <div className={`relative w-32 h-32 mx-auto mb-6`}>
            {/* Circular Progress */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={scoreInfo.color === 'success' ? '#22c55e' : 
                       scoreInfo.color === 'primary' ? '#3b82f6' :
                       scoreInfo.color === 'warning' ? '#f59e0b' : '#ef4444'}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - score / 100)}`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 54}` }}
                animate={{ strokeDashoffset: `${2 * Math.PI * 54 * (1 - score / 100)}` }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </svg>
            
            {/* Score Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-3xl font-bold text-gray-900"
                >
                  {score}
                </motion.span>
                <div className="text-sm text-gray-500">/ 100</div>
              </div>
            </div>
          </div>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full border score-${scoreInfo.category}`}>
            <Award className="w-5 h-5 mr-2" />
            <span className="font-semibold">{scoreInfo.label}</span>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-gray-900 mt-6 mb-2"
        >
          Resume Analysis Complete
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-gray-600"
        >
          Analysis for <span className="font-semibold text-primary-600">{jobRole}</span> position
        </motion.p>

        {/* AI Analysis Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mt-4"
        >
          {aiPowered ? (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-200">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
              AI-Powered Analysis
            </div>
          ) : (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
              <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
              Keyword-Based Analysis
            </div>
          )}
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap justify-center gap-4 mb-8"
      >
        <button
          onClick={onNewAnalysis}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Analyze Another Resume</span>
        </button>
        
        <button className="btn-secondary flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Download Report</span>
        </button>
        
        <button className="btn-secondary flex items-center space-x-2">
          <Share2 className="w-4 h-4" />
          <span>Share Results</span>
        </button>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Overall Feedback */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Overall Feedback Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Overall Assessment</h3>
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              {feedback.overall}
            </p>
          </motion.div>

          {/* Strengths */}
          {feedback.strengths && feedback.strengths.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="card p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-success-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-success-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
              </div>
              
              <ul className="space-y-3">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Areas for Improvement */}
          {feedback.improvements && feedback.improvements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="card p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-warning-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-warning-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Areas for Improvement</h3>
              </div>
              
              <ul className="space-y-3">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-warning-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Recommendations */}
          {feedback.recommendations && feedback.recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="card p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
              </div>
              
              <ul className="space-y-3">
                {feedback.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Right Column - Keywords and Analysis */}
        <div className="space-y-6">
          
          {/* Analysis Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Analysis Summary</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Keywords Matched</span>
                <span className="font-semibold text-success-600">
                  {analysis.matchedCount}/{analysis.totalKeywords}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Match Percentage</span>
                <span className="font-semibold text-primary-600">
                  {analysis.matchPercentage}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Context Bonus</span>
                <span className="font-semibold text-warning-600">
                  +{analysis.contextBonus} points
                </span>
              </div>
            </div>
          </motion.div>

          {/* Matched Keywords */}
          {matchedKeywords && matchedKeywords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="card p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-success-100 rounded-lg">
                  <Target className="w-5 h-5 text-success-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Matched Keywords ({matchedKeywords.length})
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                {matchedKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800 border border-success-200"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {keyword}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Missing Keywords */}
          {missingKeywords && missingKeywords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="card p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-danger-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-danger-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Missing Keywords ({missingKeywords.length})
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                {missingKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-danger-100 text-danger-800 border border-danger-200"
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    {keyword}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs text-orange-700">
                  <strong>Tip:</strong> Consider adding these keywords naturally throughout your resume, 
                  especially in your experience and skills sections.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisResults;
