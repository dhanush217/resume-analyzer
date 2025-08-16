import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import JobRoleSelector from './components/JobRoleSelector';
import TextInput from './components/TextInput';
import AnalysisResults from './components/AnalysisResults';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';

// Pages
import Features from './pages/Features';

// API Configuration - Use multiple backend URLs for redundancy
const BACKEND_URLS = [
  'https://resume-analyzer-6f3l.onrender.com',
  'https://resume-analyzer-backend.onrender.com',
  'https://ai-resume-analyzer-backend.onrender.com'
];

let API_BASE_URL = BACKEND_URLS[0];

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.timeout = 30000;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add axios interceptors for better error handling
axios.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received from: ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error.message);
    if (error.code === 'NETWORK_ERROR') {
      console.error('Network error - backend might be down or CORS issue');
    }
    return Promise.reject(error);
  }
);

console.log('🔗 API Base URL:', API_BASE_URL);

// API helper functions with error handling and fallback
const api = {
  // Test backend connection with multiple URLs
  testConnection: async () => {
    for (let i = 0; i < BACKEND_URLS.length; i++) {
      const testUrl = BACKEND_URLS[i];
      try {
        console.log(`🔍 Testing connection to: ${testUrl}/api`);
        const response = await fetch(`${testUrl}/api`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors'
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Connection successful with:', testUrl);
          API_BASE_URL = testUrl;
          axios.defaults.baseURL = API_BASE_URL;
          return data;
        }
      } catch (error) {
        console.log(`❌ Failed to connect to ${testUrl}:`, error.message);
        if (i === BACKEND_URLS.length - 1) {
          throw new Error('All backend URLs failed');
        }
      }
    }
  },

  getJobRoles: () => {
    console.log('📊 Fetching job roles from:', API_BASE_URL + '/api/job-roles');
    return axios.get('/api/job-roles');
  },

  analyzeFile: (formData) => {
    console.log('📄 Analyzing file via:', API_BASE_URL + '/api/analyze-file');
    return axios.post('/api/analyze-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  analyzeText: (data) => {
    console.log('📝 Analyzing text via:', API_BASE_URL + '/api/analyze-text');
    return axios.post('/api/analyze-text', data);
  }
};



// Main Analyzer Component
function ResumeAnalyzer() {
  const [jobRoles, setJobRoles] = useState([]);
  const [selectedJobRole, setSelectedJobRole] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobRolesLoading, setJobRolesLoading] = useState(true);
  const [inputMode, setInputMode] = useState('file'); // 'file' or 'text'
  const [resumeText, setResumeText] = useState('');

  // Test backend connection and load job roles
  useEffect(() => {
    const initializeApp = async () => {
      setJobRolesLoading(true);

      // Wake up Render backend (free tier goes to sleep)
      console.log('🌅 Waking up backend server...');
      toast.loading('Connecting to backend...', { id: 'backend-connection' });

      // Test backend connection with multiple attempts and URLs
      let connected = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`🔍 Testing backend connection (attempt ${attempt}/3)...`);
          await api.testConnection();
          console.log('✅ Backend connection successful');
          toast.success('Connected to backend!', { id: 'backend-connection' });
          connected = true;
          break;
        } catch (error) {
          console.error(`❌ Backend connection attempt ${attempt} failed:`, error.message);

          if (attempt < 3) {
            toast.loading(`Trying backup servers... (${attempt + 1}/3)`, { id: 'backend-connection' });
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }
      }

      if (!connected) {
        console.log('🔄 All backend URLs failed, using fallback mode...');
        toast.error('Backend unavailable. Using offline mode with limited features.', { id: 'backend-connection' });

        // Set fallback job roles
        const fallbackRoles = [
          'Full Stack Developer', 'Java Developer', 'Python Developer',
          'UI/UX Designer', 'SEO', 'PROMPT Engineering',
          'Mechanical Engineering', 'Medical', 'HR'
        ];
        setJobRoles(fallbackRoles);
        setJobRolesLoading(false);
        return;
      }

      // Then load job roles
      try {
        console.log('📊 Loading job roles...');
        const response = await api.getJobRoles();
        const roles = response.data.roles || [];
        setJobRoles(roles);
        // Don't auto-select first role - let user choose
        toast.success('Connected to backend successfully!');
        console.log('✅ Job roles loaded:', roles.length);
      } catch (error) {
        console.error('Error loading job roles:', error);

        // Fallback to default job roles if API fails
        const fallbackRoles = [
          'Full Stack Developer',
          'Java Developer',
          'Python Developer',
          'UI/UX Designer',
          'SEO',
          'PROMPT Engineering',
          'Mechanical Engineering',
          'Medical',
          'HR'
        ];

        setJobRoles(fallbackRoles);
        // Don't auto-select first role - let user choose
        toast.error('Using offline job roles. Backend connection failed.');
      } finally {
        setJobRolesLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Handle file upload analysis
  const handleFileAnalysis = async (file) => {
    if (!selectedJobRole) {
      toast.error('Please select a job role first');
      return;
    }

    setLoading(true);
    setAnalysisResults(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobRole', selectedJobRole);

      const response = await api.analyzeFile(formData);

      if (response.data.success) {
        setAnalysisResults(response.data);
        toast.success('Resume analyzed successfully!');
      } else {
        throw new Error(response.data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing file:', error);

      // Fallback to basic analysis
      console.log('🔄 Using fallback analysis...');
      toast.loading('Backend unavailable, using offline analysis...', { id: 'analysis' });

      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          const fallbackResult = performBasicAnalysis(text, selectedJobRole);
          setAnalysisResults(fallbackResult);
          toast.success('Offline analysis completed!', { id: 'analysis' });
          setLoading(false);
        };
        reader.readAsText(file);
      } catch (fallbackError) {
        toast.error('Analysis failed. Please try again later.', { id: 'analysis' });
        setLoading(false);
      }
    }
  };

  // Basic offline analysis function
  const performBasicAnalysis = (text, jobRole) => {
    const keywords = {
      'Full Stack Developer': ['javascript', 'react', 'node', 'html', 'css', 'mongodb', 'express', 'api', 'frontend', 'backend'],
      'Java Developer': ['java', 'spring', 'hibernate', 'maven', 'junit', 'sql', 'rest', 'microservices'],
      'Python Developer': ['python', 'django', 'flask', 'pandas', 'numpy', 'sql', 'api', 'machine learning'],
      'UI/UX Designer': ['figma', 'sketch', 'adobe', 'wireframe', 'prototype', 'user experience', 'design'],
      'SEO': ['seo', 'google analytics', 'keywords', 'content', 'marketing', 'optimization'],
      'PROMPT Engineering': ['ai', 'gpt', 'prompt', 'machine learning', 'nlp', 'chatbot'],
      'Mechanical Engineering': ['autocad', 'solidworks', 'manufacturing', 'design', 'engineering'],
      'Medical': ['medical', 'healthcare', 'patient', 'clinical', 'diagnosis', 'treatment'],
      'HR': ['recruitment', 'hiring', 'hr', 'human resources', 'employee', 'management']
    };

    const roleKeywords = keywords[jobRole] || [];
    const textLower = text.toLowerCase();
    const matchedKeywords = roleKeywords.filter(keyword => textLower.includes(keyword));
    const score = Math.min(95, (matchedKeywords.length / roleKeywords.length) * 100);

    return {
      success: true,
      analysis: {
        overallScore: Math.round(score),
        technicalScore: Math.round(score * 0.8),
        softSkillsScore: Math.round(score * 0.2 + 60),
        matchedKeywords: matchedKeywords,
        missingKeywords: roleKeywords.filter(k => !matchedKeywords.includes(k)),
        feedback: `Offline analysis complete. Matched ${matchedKeywords.length} out of ${roleKeywords.length} key skills for ${jobRole}.`,
        analysisMethod: 'Offline Keyword Analysis'
      }
    };
  };

  // Handle text-based analysis
  const handleTextAnalysis = async () => {
    if (!selectedJobRole) {
      toast.error('Please select a job role first');
      return;
    }

    if (!resumeText.trim()) {
      toast.error('Please enter your resume text');
      return;
    }

    setLoading(true);
    setAnalysisResults(null);

    try {
      const response = await api.analyzeText({
        resumeText: resumeText.trim(),
        jobRole: selectedJobRole
      });

      if (response.data.success) {
        setAnalysisResults(response.data);
        toast.success('Resume analyzed successfully!');
      } else {
        throw new Error(response.data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing text:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to analyze resume. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle new analysis
  const handleNewAnalysis = () => {
    setAnalysisResults(null);
    setResumeText('');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!analysisResults && !loading && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              {/* Header Section */}
              <div className="text-center mb-12">
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-5xl font-bold gradient-text mb-4"
                >
                  AI-Powered Resume Analyzer
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-gray-600 mb-8"
                >
                  Get intelligent feedback and improve your resume's ATS compatibility
                </motion.p>
              </div>

              {/* Job Role Selection */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <JobRoleSelector
                  jobRoles={jobRoles}
                  selectedJobRole={selectedJobRole}
                  onJobRoleChange={setSelectedJobRole}
                  loading={jobRolesLoading}
                />
              </motion.div>

              {/* Input Mode Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center mb-8"
              >
                <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-soft">
                  <button
                    onClick={() => setInputMode('file')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      inputMode === 'file'
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    onClick={() => setInputMode('text')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      inputMode === 'text'
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Paste Text
                  </button>
                </div>
              </motion.div>

              {/* Input Components */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {inputMode === 'file' ? (
                  <FileUpload onFileSelect={handleFileAnalysis} />
                ) : (
                  <TextInput
                    value={resumeText}
                    onChange={setResumeText}
                    onAnalyze={handleTextAnalysis}
                  />
                )}
              </motion.div>
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20"
            >
              <LoadingSpinner />
            </motion.div>
          )}

          {analysisResults && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AnalysisResults
                results={analysisResults}
                jobRole={selectedJobRole}
                onNewAnalysis={handleNewAnalysis}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
}

// Main App Component with Routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResumeAnalyzer />} />
        <Route path="/features" element={<Features />} />
      </Routes>
    </Router>
  );
}

export default App;
