import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Github, Star } from 'lucide-react';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white border-b border-gray-200 shadow-soft sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-medium">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                AI Resume Analyzer
              </h1>
              <p className="text-xs text-gray-500">Powered by Advanced AI</p>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center space-x-6"
          >
            <Link
              to="/features"
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium"
            >
              Features
            </Link>
            <Link
              to="/features"
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium"
            >
              How It Works
            </Link>
            <a 
              href="#about" 
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium"
            >
              About
            </a>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center space-x-4"
          >
            <div className="hidden sm:flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700">AI-Powered</span>
            </div>
            
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">GitHub</span>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
