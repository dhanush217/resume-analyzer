import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Zap, 
  Target, 
  Shield, 
  BarChart3, 
  FileText, 
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Cpu,
  Database,
  Globe
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced Google Gemini AI analyzes your resume with human-like understanding, providing contextual insights and recommendations.",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get comprehensive resume analysis in seconds. Upload your file and receive detailed feedback immediately.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Target,
      title: "Job-Specific Matching",
      description: "Tailored analysis for 9+ job roles including Full Stack Developer, Data Scientist, UI/UX Designer, and more.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Shield,
      title: "Smart Fallback System",
      description: "If AI is unavailable, our advanced keyword-based system ensures you always get reliable analysis.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Weighted Scoring",
      description: "Technical skills weighted at 80%, soft skills at 20% - reflecting real hiring priorities in the industry.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: FileText,
      title: "Multiple File Formats",
      description: "Support for PDF, DOCX, TXT, and DOC files with intelligent text extraction for each format.",
      color: "from-cyan-500 to-blue-500"
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Upload Your Resume",
      description: "Drag and drop your resume file or paste your resume text directly into our analyzer."
    },
    {
      step: 2,
      title: "Select Job Role",
      description: "Choose from 9+ specialized job roles to get targeted analysis and recommendations."
    },
    {
      step: 3,
      title: "AI Analysis",
      description: "Our Gemini AI analyzes your resume against industry standards and job requirements."
    },
    {
      step: 4,
      title: "Get Detailed Results",
      description: "Receive comprehensive feedback with scores, matched keywords, and improvement suggestions."
    }
  ];

  const techStack = [
    { name: "Google Gemini AI", icon: Sparkles, description: "Advanced language model for intelligent analysis" },
    { name: "React.js", icon: Cpu, description: "Modern frontend framework for smooth user experience" },
    { name: "Node.js", icon: Database, description: "Robust backend for file processing and API handling" },
    { name: "Tailwind CSS", icon: Globe, description: "Beautiful, responsive design system" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Analyzer</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Features & How It Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the powerful features that make our AI Resume Analyzer the most advanced 
            tool for optimizing your resume and landing your dream job.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-shadow duration-300"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start space-x-6 mb-8 last:mb-0"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built With Modern Technology
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg p-6 text-center shadow-soft hover:shadow-medium transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                  <tech.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{tech.name}</h3>
                <p className="text-sm text-gray-600">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Key Benefits */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose Our AI Resume Analyzer?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "AI-powered analysis with human-like understanding",
              "Support for 9+ specialized job roles",
              "Instant feedback and actionable recommendations",
              "Multiple file format support (PDF, DOCX, TXT, DOC)",
              "Weighted scoring system (80% technical, 20% soft skills)",
              "Smart fallback system ensures 100% uptime",
              "Modern, responsive design for all devices",
              "Free to use with no registration required"
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center space-x-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-medium hover:shadow-large"
          >
            Try AI Resume Analyzer Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
