#!/usr/bin/env node

/**
 * Environment Configuration Checker
 * Validates that all required environment variables are properly set
 */

const config = require('../config/config');

console.log('🔍 AI Resume Analyzer - Environment Configuration Check\n');

// Display current configuration
console.log('📋 Current Configuration:');
console.log('─'.repeat(50));
console.log(`Server Port: ${config.server.port}`);
console.log(`Node Environment: ${config.server.nodeEnv}`);
console.log(`API Base URL: ${config.server.apiBaseUrl}`);
console.log(`Upload Directory: ${config.upload.uploadDir}`);
console.log(`Max File Size: ${(config.upload.maxFileSize / 1024 / 1024).toFixed(1)}MB`);
console.log(`Cache Size: ${config.cache.maxSize} entries`);
console.log(`AI Model: ${config.ai.model}`);

// Check API key status
console.log('\n🤖 AI Configuration:');
console.log('─'.repeat(50));
if (config.ai.geminiApiKey) {
  const maskedKey = config.ai.geminiApiKey.substring(0, 8) + '...' + 
                   config.ai.geminiApiKey.substring(config.ai.geminiApiKey.length - 4);
  console.log(`✅ Gemini API Key: ${maskedKey}`);
  console.log('✅ AI analysis will be available');
} else {
  console.log('❌ Gemini API Key: Not configured');
  console.log('⚠️  AI analysis will not be available - will use keyword fallback');
}

// Check file system
console.log('\n📁 File System:');
console.log('─'.repeat(50));
const fs = require('fs');
const path = require('path');

const uploadPath = path.resolve(config.upload.uploadDir);
if (fs.existsSync(uploadPath)) {
  console.log(`✅ Upload directory exists: ${uploadPath}`);
} else {
  console.log(`⚠️  Upload directory will be created: ${uploadPath}`);
}

// Check dependencies
console.log('\n📦 Dependencies:');
console.log('─'.repeat(50));
try {
  require('@google/generative-ai');
  console.log('✅ Google Generative AI package installed');
} catch (error) {
  console.log('❌ Google Generative AI package missing');
}

try {
  require('pdf-parse');
  console.log('✅ PDF parsing package installed');
} catch (error) {
  console.log('❌ PDF parsing package missing');
}

try {
  require('mammoth');
  console.log('✅ DOCX parsing package installed');
} catch (error) {
  console.log('❌ DOCX parsing package missing');
}

console.log('\n🎯 Summary:');
console.log('─'.repeat(50));
if (config.ai.geminiApiKey) {
  console.log('✅ Configuration is complete - AI features enabled');
} else {
  console.log('⚠️  Configuration is partial - AI features disabled');
  console.log('   Add GEMINI_API_KEY to .env file to enable AI analysis');
}

console.log('\n💡 To get a Gemini API key:');
console.log('   1. Visit: https://makersuite.google.com/app/apikey');
console.log('   2. Sign in with Google account');
console.log('   3. Create new API key');
console.log('   4. Add to backend/.env file');

console.log('\n🚀 Ready to start the server!');
