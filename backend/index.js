const express = require('express');
const cors = require('cors');
const multer = require('multer');
const textract = require('textract');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');
const fs = require('fs');

// Load configuration
const config = require('./config/config');
const { atsKeywords, getKeywordsForRole, getAllKeywordsForRole } = require('./atsKeywords');
const { analyzeResumeWithGemini, analyzeResumeWithKeywords } = require('./aiService');

const app = express();
const port = config.server.port;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = config.upload.uploadDir.endsWith('/') ?
      config.upload.uploadDir : config.upload.uploadDir + '/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (config.upload.allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Supported formats: PDF, DOCX, TXT, DOC. For best results, use PDF or DOCX.'));
    }
  },
  limits: {
    fileSize: config.upload.maxFileSize
  }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Simple cache for extracted text to avoid re-processing same files
const extractionCache = new Map();

// Helper function to try PDF extraction with multiple strategies
async function tryPdfExtraction(dataBuffer) {
  const strategies = [
    // Strategy 1: Default pdf-parse
    async () => {
      console.log('🔄 Trying default pdf-parse...');
      return await pdfParse(dataBuffer);
    },
    // Strategy 2: pdf-parse with alternative options
    async () => {
      console.log('🔄 Trying pdf-parse with alternative options...');
      return await pdfParse(dataBuffer, {
        normalizeWhitespace: false,
        disableCombineTextItems: false
      });
    },
    // Strategy 3: pdf-parse with max pages limit
    async () => {
      console.log('🔄 Trying pdf-parse with page limit...');
      return await pdfParse(dataBuffer, {
        max: 10 // Limit to first 10 pages
      });
    }
  ];

  let lastError;

  for (let i = 0; i < strategies.length; i++) {
    try {
      const result = await strategies[i]();
      console.log(`✅ PDF extraction successful with strategy ${i + 1}: ${result.text.length} characters`);
      return result.text;
    } catch (error) {
      lastError = error;
      console.log(`⚠️ Strategy ${i + 1} failed: ${error.message}`);

      // Wait a bit between strategies to avoid race conditions
      if (i < strategies.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  // If all strategies failed, throw the last error
  throw lastError;
}

// Enhanced text extraction function
async function extractTextFromFile(filePath, fileType) {
  const extension = path.extname(filePath).toLowerCase();

  // Create a cache key based on file stats to avoid re-processing identical files
  const stats = fs.statSync(filePath);
  const cacheKey = `${path.basename(filePath)}_${stats.size}_${stats.mtime.getTime()}`;

  // Check cache first
  if (extractionCache.has(cacheKey)) {
    console.log('📋 Using cached extraction result');
    return extractionCache.get(cacheKey);
  }

  try {
    let extractedText = '';

    if (extension === '.pdf') {
      // Use pdf-parse for PDF files with smart error handling
      console.log('📄 Extracting text from PDF file...');

      try {
        const dataBuffer = fs.readFileSync(filePath);

        // Basic PDF validation
        const pdfHeader = dataBuffer.slice(0, 5).toString();
        if (!pdfHeader.startsWith('%PDF')) {
          throw new Error('Invalid PDF file format');
        }

        // Try pdf-parse with multiple strategies
        extractedText = await tryPdfExtraction(dataBuffer);

      } catch (pdfError) {
        console.log(`⚠️ All PDF parsing strategies failed: ${pdfError.message}`);

        // If it's a specific PDF corruption error, try textract as final fallback
        if (pdfError.message.includes('bad XRef entry') ||
            pdfError.message.includes('Invalid PDF') ||
            pdfError.message.includes('FormatError')) {
          console.log('🔄 Trying textract as final fallback...');

          try {
            extractedText = await new Promise((resolve, reject) => {
              textract.fromFileWithPath(filePath, (error, text) => {
                if (error) {
                  reject(new Error('PDF extraction failed due to file corruption (bad XRef entry). Please try: 1) Re-saving the PDF from the original application, 2) Converting to DOCX format, or 3) Using a PDF repair tool before uploading.'));
                } else {
                  console.log(`✅ PDF text extracted via textract: ${text.length} characters`);
                  resolve(text);
                }
              });
            });
          } catch (textractError) {
            throw textractError;
          }
        } else {
          throw new Error(`PDF extraction failed: ${pdfError.message}`);
        }
      }
    } else if (extension === '.docx') {
      // Use mammoth for DOCX files
      console.log('📄 Extracting text from DOCX file...');
      const result = await mammoth.extractRawText({ path: filePath });
      console.log(`✅ DOCX text extracted: ${result.value.length} characters`);
      extractedText = result.value;

    } else if (extension === '.txt') {
      // Read text files directly
      console.log('📄 Reading text file...');
      const data = await fs.promises.readFile(filePath, 'utf8');
      console.log(`✅ Text file read: ${data.length} characters`);
      extractedText = data;

    } else if (extension === '.doc') {
      // Fallback to textract for DOC files (if available)
      console.log('📄 Extracting text from DOC file...');
      extractedText = await new Promise((resolve, reject) => {
        textract.fromFileWithPath(filePath, (error, text) => {
          if (error) {
            console.error('DOC extraction error:', error);
            reject(new Error('Failed to extract text from DOC file. Please convert to DOCX or PDF format.'));
          } else {
            console.log(`✅ DOC text extracted: ${text.length} characters`);
            resolve(text);
          }
        });
      });
    } else {
      throw new Error('Unsupported file format');
    }

    // Cache the result for future use
    extractionCache.set(cacheKey, extractedText);

    // Clean up cache if it gets too large
    if (extractionCache.size > config.cache.maxSize) {
      const firstKey = extractionCache.keys().next().value;
      extractionCache.delete(firstKey);
    }

    return extractedText;

  } catch (error) {
    console.error('File extraction error:', error);
    throw new Error('Failed to process file: ' + error.message);
  }
}

// AI-powered resume analysis function with fallback
async function analyzeResumeWithAI(resumeText, jobRole) {
  try {
    console.log('🤖 Attempting Gemini AI analysis...');

    // Try Gemini AI analysis first
    const aiResult = await analyzeResumeWithGemini(resumeText, jobRole);

    // Add AI analysis indicator
    aiResult.analysisMethod = 'AI';
    aiResult.aiPowered = true;

    return aiResult;

  } catch (aiError) {
    console.log('⚠️ Gemini AI failed, falling back to keyword analysis:', aiError.message);

    try {
      // Fallback to keyword-based analysis
      const keywordResult = analyzeResumeWithKeywords(resumeText, jobRole);

      // Add fallback indicator
      keywordResult.analysisMethod = 'Keywords';
      keywordResult.aiPowered = false;
      keywordResult.fallbackReason = aiError.message;

      return keywordResult;

    } catch (fallbackError) {
      console.error('❌ Both AI and keyword analysis failed:', fallbackError.message);
      return {
        success: false,
        error: 'Analysis failed: ' + fallbackError.message,
        analysisMethod: 'Failed',
        aiPowered: false
      };
    }
  }
}



// Extract specific sections from resume
function extractSection(resumeText, sectionType) {
  const text = resumeText.toLowerCase();
  let sectionText = '';
  
  const patterns = {
    'experience': [
      /(?:work\s+)?experience[\s\S]*?(?=(?:education|skills|projects|certificates?|awards?|languages?|interests?|references?|$))/i,
      /(?:professional\s+)?(?:work\s+)?history[\s\S]*?(?=(?:education|skills|projects|certificates?|awards?|languages?|interests?|references?|$))/i,
      /employment[\s\S]*?(?=(?:education|skills|projects|certificates?|awards?|languages?|interests?|references?|$))/i
    ],
    'skills': [
      /(?:technical\s+)?skills[\s\S]*?(?=(?:experience|education|projects|certificates?|awards?|languages?|interests?|references?|$))/i,
      /(?:core\s+)?competencies[\s\S]*?(?=(?:experience|education|projects|certificates?|awards?|languages?|interests?|references?|$))/i,
      /technologies[\s\S]*?(?=(?:experience|education|projects|certificates?|awards?|languages?|interests?|references?|$))/i
    ],
    'projects': [
      /projects?[\s\S]*?(?=(?:experience|education|skills|certificates?|awards?|languages?|interests?|references?|$))/i,
      /portfolio[\s\S]*?(?=(?:experience|education|skills|certificates?|awards?|languages?|interests?|references?|$))/i
    ]
  };
  
  const sectionPatterns = patterns[sectionType] || [];
  
  for (const pattern of sectionPatterns) {
    const match = resumeText.match(pattern);
    if (match) {
      sectionText = match[0];
      break;
    }
  }
  
  return sectionText || resumeText; // Fallback to full text if section not found
}

// Generate detailed feedback based on analysis
function generateDetailedFeedback(score, matchedKeywords, missingKeywords, resumeText, jobRole) {
  let feedback = {
    overall: '',
    strengths: [],
    improvements: [],
    recommendations: []
  };
  
  // Overall assessment
  if (score >= 80) {
    feedback.overall = `Excellent match! Your resume shows strong alignment with ${jobRole} requirements with ${score}% relevance.`;
  } else if (score >= 60) {
    feedback.overall = `Good match! Your resume demonstrates relevant skills for ${jobRole} with ${score}% relevance, but there's room for improvement.`;
  } else if (score >= 40) {
    feedback.overall = `Moderate match. Your resume shows some relevant skills for ${jobRole} (${score}% relevance), but significant improvements are needed.`;
  } else {
    feedback.overall = `Low match. Your resume currently has limited alignment with ${jobRole} requirements (${score}% relevance). Consider significant revisions.`;
  }
  
  // Strengths
  if (matchedKeywords.length > 0) {
    feedback.strengths.push(`Strong presence of key skills: ${matchedKeywords.slice(0, 8).join(', ')}`);
  }
  
  if (resumeText.toLowerCase().includes('experience') && resumeText.toLowerCase().includes('year')) {
    feedback.strengths.push('Resume includes relevant work experience');
  }
  
  if (resumeText.toLowerCase().includes('project')) {
    feedback.strengths.push('Demonstrates practical experience through projects');
  }
  
  // Improvements
  if (missingKeywords.length > 0) {
    feedback.improvements.push(`Consider adding these important ${jobRole} keywords: ${missingKeywords.slice(0, 8).join(', ')}`);
  }
  
  if (!resumeText.toLowerCase().includes('quantif') && !resumeText.toLowerCase().includes('achiev')) {
    feedback.improvements.push('Add quantifiable achievements and impact metrics');
  }
  
  if (resumeText.length < 500) {
    feedback.improvements.push('Resume appears brief - consider adding more detailed experience descriptions');
  }
  
  // Recommendations
  feedback.recommendations = [
    'Use specific examples that demonstrate your expertise with mentioned technologies',
    'Include relevant certifications or training programs',
    'Quantify your achievements with numbers, percentages, or metrics',
    'Tailor your resume for each specific job application',
    'Consider adding a professional summary that highlights your key qualifications'
  ];
  
  return feedback;
}

// File upload and analysis endpoint
app.post('/api/analyze-file', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { jobRole } = req.body;
    if (!jobRole) {
      return res.status(400).json({ error: 'Job role is required' });
    }

    const filePath = req.file.path;
    console.log(`📄 Processing file: ${req.file.originalname} (${req.file.mimetype})`);

    try {
      // Extract text using enhanced extraction function
      const text = await extractTextFromFile(filePath, req.file.mimetype);

      // Clean up uploaded file
      fs.unlink(filePath, (unlinkError) => {
        if (unlinkError) console.log('Error deleting file:', unlinkError);
      });

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'No readable text found in the uploaded file. Please ensure the file contains text content.' });
      }

      console.log(`✅ Text extracted successfully. Length: ${text.length} characters`);

      // Analyze the extracted text with AI
      const analysisResult = await analyzeResumeWithAI(text, jobRole);
      res.json(analysisResult);

    } catch (extractionError) {
      // Clean up uploaded file on error
      fs.unlink(filePath, (unlinkError) => {
        if (unlinkError) console.log('Error deleting file:', unlinkError);
      });

      console.error('Text extraction error:', extractionError);
      return res.status(500).json({
        error: extractionError.message || 'Failed to extract text from file'
      });
    }

  } catch (error) {
    console.error('File analysis error:', error);
    res.status(500).json({ error: 'Internal server error during file analysis' });
  }
});

// Text-based analysis endpoint
app.post('/api/analyze-text', async (req, res) => {
  try {
    const { resumeText, jobRole } = req.body;

    if (!resumeText || !jobRole) {
      return res.status(400).json({ error: 'Resume text and job role are required' });
    }

    if (resumeText.trim().length === 0) {
      return res.status(400).json({ error: 'Resume text cannot be empty' });
    }

    const analysisResult = await analyzeResumeWithAI(resumeText, jobRole);
    res.json(analysisResult);

  } catch (error) {
    console.error('Text analysis error:', error);
    res.status(500).json({ error: 'Internal server error during text analysis' });
  }
});

// Get available job roles
app.get('/api/job-roles', (req, res) => {
  try {
    const roles = Object.keys(atsKeywords);
    res.json({ roles });
  } catch (error) {
    console.error('Error fetching job roles:', error);
    res.status(500).json({ error: 'Failed to fetch job roles' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    aiEnabled: true,
    features: ['AI Analysis', 'Keyword Fallback', 'Weighted Scoring']
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum 5MB allowed.' });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`🚀 AI-Powered Resume Analyzer Backend running on http://localhost:${port}`);
  console.log(`📊 Available job roles: ${Object.keys(atsKeywords).join(', ')}`);
});
