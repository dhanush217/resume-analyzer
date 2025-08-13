/**
 * Configuration module for AI Resume Analyzer
 * Centralizes all environment variable handling
 */

// Load environment variables
require('dotenv').config();

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000'
  },

  // AI Configuration
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    allowedTypes: ['.pdf', '.docx', '.txt', '.doc']
  },

  // Cache Configuration
  cache: {
    maxSize: parseInt(process.env.CACHE_SIZE) || 50
  },

  // Validation
  validate() {
    const warnings = [];
    const errors = [];

    // Check required environment variables
    if (!this.ai.geminiApiKey) {
      warnings.push('GEMINI_API_KEY not set - AI analysis will not be available');
    }

    // Check numeric values
    if (isNaN(this.upload.maxFileSize)) {
      errors.push('MAX_FILE_SIZE must be a valid number');
    }

    if (isNaN(this.cache.maxSize)) {
      errors.push('CACHE_SIZE must be a valid number');
    }

    // Log warnings and errors
    if (warnings.length > 0) {
      console.warn('⚠️ Configuration Warnings:');
      warnings.forEach(warning => console.warn(`   - ${warning}`));
    }

    if (errors.length > 0) {
      console.error('❌ Configuration Errors:');
      errors.forEach(error => console.error(`   - ${error}`));
      throw new Error('Invalid configuration. Please check your environment variables.');
    }

    return true;
  }
};

// Validate configuration on load
config.validate();

module.exports = config;
