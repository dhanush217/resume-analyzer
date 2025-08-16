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

// API Configuration - Force production URL for Vercel
const API_BASE_URL = 'https://resume-analyzer-6f3l.onrender.com';

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

// API helper functions with error handling
const api = {
  // Test backend connection
  testConnection: async () => {
    try {
      console.log('🔍 Testing connection to:', API_BASE_URL + '/api');
      const response = await axios.get('/api');
      console.log('✅ Connection test response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Backend connection test failed:', error.message);
      console.error('Full error:', error);
      throw error;
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

      // First test backend connection with retries
      for (let attempt = 1; attempt <= 5; attempt++) {
        try {
          console.log(`🔍 Testing backend connection (attempt ${attempt}/5)...`);
          await api.testConnection();
          console.log('✅ Backend connection successful');
          toast.success('Connected to backend!', { id: 'backend-connection' });
          break;
        } catch (error) {
          console.error(`❌ Backend connection attempt ${attempt} failed:`, error.message);

          if (attempt === 5) {
            toast.error(`Failed to connect to backend after 5 attempts. The server might be down.`, { id: 'backend-connection' });
            setJobRolesLoading(false);
            return;
          }

          // Show progress to user
          toast.loading(`Connecting... (attempt ${attempt + 1}/5)`, { id: 'backend-connection' });

          // Wait longer for first few attempts (Render wake-up time)
          const waitTime = attempt <= 2 ? 5000 : 2000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
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
      const errorMessage = error.response?.data?.error || error.message || 'Failed to analyze resume. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
