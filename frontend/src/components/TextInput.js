import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Zap } from 'lucide-react';

const TextInput = ({ value, onChange, onAnalyze }) => {
  const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
  const minWords = 50;
  const isValid = wordCount >= minWords;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-8 max-w-4xl mx-auto"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <FileText className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Paste Your Resume Text
        </h3>
        <p className="text-gray-600">
          Copy and paste your resume content for instant analysis
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste your resume content here...

Example:
John Doe
Software Engineer

Experience:
• 5+ years of experience in full-stack development
• Proficient in React, Node.js, Python, and AWS
• Built and deployed scalable web applications

Skills:
JavaScript, TypeScript, React, Node.js, Python, AWS, Docker..."
            className="form-textarea min-h-[400px] text-sm"
            rows={20}
          />
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${isValid ? 'text-success-600' : 'text-gray-500'}`}>
                {wordCount} words
              </span>
              {!isValid && (
                <span className="text-sm text-warning-600">
                  Minimum {minWords} words recommended
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isValid ? 'bg-success-500' : 'bg-gray-300'}`}></div>
              <span className={`text-xs ${isValid ? 'text-success-600' : 'text-gray-500'}`}>
                {isValid ? 'Ready to analyze' : 'Add more content'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center pt-4">
          <motion.button
            whileHover={{ scale: isValid ? 1.02 : 1 }}
            whileTap={{ scale: isValid ? 0.98 : 1 }}
            onClick={onAnalyze}
            disabled={!isValid || !value.trim()}
            className={`btn-primary flex items-center space-x-2 ${
              !isValid || !value.trim()
                ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100'
                : ''
            }`}
          >
            <Zap className="w-5 h-5" />
            <span>Analyze Resume</span>
          </motion.button>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Tips for better analysis:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">Include complete work experience details</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">List technical skills and tools</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">Mention educational background</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">Include relevant projects and achievements</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TextInput;
