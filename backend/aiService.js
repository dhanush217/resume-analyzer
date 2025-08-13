/**
 * AI Service for Resume Analysis using Google Gemini API
 * Provides intelligent resume analysis with fallback to keyword-based analysis
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./config/config');
const { getKeywordsForRole } = require('./atsKeywords');

// Initialize Gemini AI with configuration
const genAI = config.ai.geminiApiKey ? new GoogleGenerativeAI(config.ai.geminiApiKey) : null;

/**
 * Generate AI-powered resume analysis using Gemini
 * @param {string} resumeText - The resume content
 * @param {string} jobRole - The target job role
 * @returns {Promise<Object>} Analysis result
 */
async function analyzeResumeWithGemini(resumeText, jobRole) {
  try {
    // Check if API key is available
    if (!genAI) {
      throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in environment variables.');
    }

    const model = genAI.getGenerativeModel({ model: config.ai.model });
    
    const roleKeywords = getKeywordsForRole(jobRole);
    const technicalKeywords = roleKeywords.technical || [];
    const softKeywords = roleKeywords.soft || [];
    
    const prompt = `
You are an expert ATS (Applicant Tracking System) and HR professional. Analyze the following resume for a ${jobRole} position.

RESUME CONTENT:
${resumeText}

TARGET JOB ROLE: ${jobRole}

RELEVANT TECHNICAL SKILLS TO LOOK FOR: ${technicalKeywords.join(', ')}
RELEVANT SOFT SKILLS TO LOOK FOR: ${softKeywords.join(', ')}

Please provide a comprehensive analysis in the following JSON format (respond ONLY with valid JSON, no additional text):

{
  "success": true,
  "score": [number between 0-100],
  "matchedKeywords": [array of matched keywords from the lists above],
  "missingKeywords": [array of important missing keywords, max 15],
  "feedback": {
    "overall": "Overall assessment paragraph",
    "strengths": [array of 3-5 strength points],
    "improvements": [array of 3-5 improvement suggestions],
    "recommendations": [array of 3-5 actionable recommendations]
  },
  "analysis": {
    "totalKeywords": [total number of keywords checked],
    "matchedCount": [number of keywords found],
    "technicalMatched": [number of technical skills found],
    "softMatched": [number of soft skills found],
    "technicalTotal": ${technicalKeywords.length},
    "softTotal": ${softKeywords.length},
    "technicalScore": [technical skills score 0-100],
    "softScore": [soft skills score 0-100],
    "matchPercentage": [overall match percentage],
    "contextBonus": [bonus points for context, 0-25]
  }
}

SCORING GUIDELINES:
- Technical skills should carry 80% weight, soft skills 20% weight
- Score 90-100: Excellent match, strong technical skills, relevant experience
- Score 75-89: Good match, most technical requirements met
- Score 60-74: Moderate match, some gaps in technical skills
- Score 40-59: Needs improvement, significant technical gaps
- Score 0-39: Poor match, major technical deficiencies

Consider:
1. Presence of technical skills and their depth
2. Relevant work experience and projects
3. Education and certifications
4. Soft skills demonstration
5. Overall resume quality and ATS compatibility
6. Industry-specific experience
7. Leadership and impact examples

Be thorough but concise in your analysis.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

    // Parse the JSON response
    const analysisResult = JSON.parse(text);
    
    // Validate the response structure
    if (!analysisResult.success || typeof analysisResult.score !== 'number') {
      throw new Error('Invalid AI response structure');
    }
    
    // Ensure score is within valid range
    analysisResult.score = Math.max(0, Math.min(100, analysisResult.score));
    
    console.log('✅ Gemini AI analysis completed successfully');
    return analysisResult;
    
  } catch (error) {
    console.error('❌ Gemini AI analysis failed:', error.message);
    throw error;
  }
}

/**
 * Fallback keyword-based analysis (existing system)
 * @param {string} resumeText - The resume content
 * @param {string} jobRole - The target job role
 * @returns {Object} Analysis result
 */
function analyzeResumeWithKeywords(resumeText, jobRole) {
  try {
    const roleKeywords = getKeywordsForRole(jobRole);
    const technicalKeywords = roleKeywords.technical || [];
    const softKeywords = roleKeywords.soft || [];
    
    // Convert text to lowercase for analysis
    const resumeTextLower = resumeText.toLowerCase();
    
    // Find matching keywords with separate tracking for technical and soft skills
    const matchedTechnical = [];
    const matchedSoft = [];
    const missingTechnical = [];
    const missingSoft = [];
    
    // Check technical keywords
    technicalKeywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      const variations = [
        keywordLower,
        keywordLower.replace(/[\s-]/g, ''), // Remove spaces and hyphens
        keywordLower.replace(/\.js$/, ''), // Remove .js extension
        keywordLower.replace(/\.net$/, ''), // Remove .net extension
      ];
      
      const isFound = variations.some(variant => {
        return resumeTextLower.includes(variant) || 
               resumeTextLower.includes(variant.replace(/\s+/g, ''));
      });
      
      if (isFound) {
        matchedTechnical.push(keyword);
      } else {
        missingTechnical.push(keyword);
      }
    });
    
    // Check soft skills keywords
    softKeywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      const variations = [keywordLower, keywordLower.replace(/[\s-]/g, '')];
      
      const isFound = variations.some(variant => {
        return resumeTextLower.includes(variant) || 
               resumeTextLower.includes(variant.replace(/\s+/g, ''));
      });
      
      if (isFound) {
        matchedSoft.push(keyword);
      } else {
        missingSoft.push(keyword);
      }
    });
    
    // Calculate weighted score (Technical skills: 80%, Soft skills: 20%)
    const technicalWeight = 0.8;
    const softWeight = 0.2;
    
    const technicalScore = technicalKeywords.length > 0 ? 
      (matchedTechnical.length / technicalKeywords.length) * 100 : 0;
    const softScore = softKeywords.length > 0 ? 
      (matchedSoft.length / softKeywords.length) * 100 : 0;
    
    let baseScore = Math.round((technicalScore * technicalWeight) + (softScore * softWeight));
    
    // Apply contextual analysis bonus
    let contextBonus = 0;
    const experienceSection = extractSection(resumeText, 'experience');
    const skillsSection = extractSection(resumeText, 'skills');
    const projectsSection = extractSection(resumeText, 'projects');
    
    // Boost score if technical keywords appear in relevant sections
    matchedTechnical.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      if (experienceSection.toLowerCase().includes(keywordLower)) {
        contextBonus += 3;
      }
      if (projectsSection.toLowerCase().includes(keywordLower)) {
        contextBonus += 2;
      }
      if (skillsSection.toLowerCase().includes(keywordLower)) {
        contextBonus += 1.5;
      }
    });
    
    // Lower bonus for soft skills
    matchedSoft.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      if (experienceSection.toLowerCase().includes(keywordLower)) {
        contextBonus += 1;
      }
    });
    
    // Apply bonus but cap at reasonable limits
    const finalScore = Math.min(100, baseScore + Math.min(contextBonus, 25));
    
    // Combine all matched and missing keywords for response
    const allMatchedKeywords = [...matchedTechnical, ...matchedSoft];
    const allMissingKeywords = [...missingTechnical, ...missingSoft];
    
    // Generate detailed feedback
    const feedback = generateDetailedFeedback(
      finalScore, 
      allMatchedKeywords, 
      allMissingKeywords.slice(0, 15),
      resumeText,
      jobRole
    );
    
    return {
      success: true,
      score: finalScore,
      matchedKeywords: allMatchedKeywords,
      missingKeywords: allMissingKeywords.slice(0, 15),
      feedback,
      analysis: {
        totalKeywords: technicalKeywords.length + softKeywords.length,
        matchedCount: allMatchedKeywords.length,
        technicalMatched: matchedTechnical.length,
        softMatched: matchedSoft.length,
        technicalTotal: technicalKeywords.length,
        softTotal: softKeywords.length,
        technicalScore: Math.round(technicalScore),
        softScore: Math.round(softScore),
        matchPercentage: Math.round((allMatchedKeywords.length / (technicalKeywords.length + softKeywords.length)) * 100),
        contextBonus: Math.min(contextBonus, 25)
      }
    };
    
  } catch (error) {
    console.error('❌ Keyword analysis failed:', error.message);
    return {
      success: false,
      error: 'Failed to analyze resume: ' + error.message
    };
  }
}

// Helper functions (extracted from main file)
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
  
  return sectionText || resumeText;
}

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

module.exports = {
  analyzeResumeWithGemini,
  analyzeResumeWithKeywords
};
