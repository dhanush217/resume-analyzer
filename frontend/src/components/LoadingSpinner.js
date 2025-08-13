import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="text-center">
      <div className="relative">
        {/* Animated Brain Icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full shadow-lg mb-6"
        >
          <Brain className="w-10 h-10 text-white" />
        </motion.div>

        {/* Floating Zap Icons */}
        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
          className="absolute -top-2 -right-2"
        >
          <Zap className="w-6 h-6 text-yellow-500 fill-current" />
        </motion.div>

        <motion.div
          animate={{ 
            y: [10, -10, 10],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ 
            duration: 1.8, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8
          }}
          className="absolute -bottom-2 -left-2"
        >
          <Zap className="w-4 h-4 text-primary-400 fill-current" />
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-900 mb-2"
      >
        Analyzing Your Resume
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 mb-6"
      >
        Our AI is carefully evaluating your resume...
      </motion.p>

      {/* Progress Indicators */}
      <div className="max-w-md mx-auto space-y-3">
        {[
          { text: "Extracting keywords", delay: 0 },
          { text: "Analyzing content structure", delay: 0.5 },
          { text: "Matching job requirements", delay: 1.0 },
          { text: "Generating recommendations", delay: 1.5 }
        ].map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step.delay }}
            className="flex items-center space-x-3 text-left"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: step.delay
              }}
              className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"
            />
            <span className="text-sm text-gray-700">{step.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Animated Progress Bar */}
      <div className="mt-8 max-w-xs mx-auto">
        <div className="progress-bar">
          <motion.div
            className="progress-fill bg-gradient-to-r from-primary-500 to-primary-600"
            animate={{ width: ["0%", "100%"] }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          This usually takes 10-30 seconds
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
