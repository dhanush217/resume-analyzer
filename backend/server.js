const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const { getKeywordsForRole } = require('./atsKeywords');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to extract text from PDF
const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    // Try alternative method for problematic PDFs
    try {
      const fs = require('fs');
      const tempPath = './temp.pdf';
      fs.writeFileSync(tempPath, buffer);
      const data = await pdfParse(fs.readFileSync(tempPath));
      fs.unlinkSync(tempPath);
      return data.text;
    } catch (altError) {
      console.error('Alternative PDF extraction also failed:', altError);
      throw new Error('Unable to extract text from PDF. The file might be corrupted or password-protected.');
    }
  }
};

// Helper function to extract text from DOCX
const extractTextFromDOCX = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    return '';
  }
};

// Helper function to extract text from TXT
const extractTextFromTXT = (buffer) => {
  return buffer.toString('utf8');
};

// Helper function to extract text based on file type
const extractText = async (file) => {
  const fileExtension = file.originalname.split('.').pop().toLowerCase();
  
  switch (fileExtension) {
    case 'pdf':
      return await extractTextFromPDF(file.buffer);
    case 'docx':
      return await extractTextFromDOCX(file.buffer);
    case 'txt':
    case 'rtf':
      return extractTextFromTXT(file.buffer);
    default:
      throw new Error('Unsupported file format');
  }
};

// Helper function to analyze resume text against keywords
const analyzeResume = (text, jobRole) => {
  const keywords = getKeywordsForRole(jobRole);
  if (!keywords.length) {
    return {
      score: 0,
      skillMatch: '0/0',
      matchedKeywords: [],
      missingKeywords: []
    };
  }
  
  // Convert text to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  
  // Find matched keywords
  const matchedKeywords = keywords.filter(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  // Calculate score
  const score = Math.round((matchedKeywords.length / keywords.length) * 100);
  
  // Find missing keywords (up to 10 for display purposes)
  const missingKeywords = keywords
    .filter(keyword => !lowerText.includes(keyword.toLowerCase()))
    .slice(0, 10);
  
  // Count action verbs (simplified version)
  const actionVerbs = ['achieved', 'improved', 'created', 'developed', 'managed', 
                       'led', 'implemented', 'designed', 'analyzed', 'resolved'];
  const actionVerbCount = actionVerbs.filter(verb => 
    lowerText.includes(verb.toLowerCase())
  ).length;
  
  // Simple readability score (1-5)
  const avgSentenceLength = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    .map(s => s.trim().split(/\s+/).length)
    .reduce((sum, len) => sum + len, 0) / 
    (text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1);
  
  const readabilityScore = avgSentenceLength > 25 ? 3 : 
                          avgSentenceLength > 15 ? 4 : 5;
  
  return {
    score,
    skillMatch: `${matchedKeywords.length}/${keywords.length}`,
    actionVerbs: Math.min(5, actionVerbCount),
    readability: readabilityScore,
    resumePercentile: `${Math.min(95, score + 5)}%`,
    matchedKeywords,
    missingKeywords
  };
};

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    
    const jobRole = req.body.jobRole || '';
    
    // Extract text from the resume
    const text = await extractText(req.file);
    
    // Analyze the resume text against keywords for the selected job role
    const analysisResult = analyzeResume(text, jobRole);
    
    res.json(analysisResult);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).send('Error analyzing resume');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
