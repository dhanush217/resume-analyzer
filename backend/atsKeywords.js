/**
 * ATS Keywords Database for different job roles
 * Optimized with 15-20 technical skills and 5 soft skills per role
 * Technical skills have higher weight than soft skills in scoring
 */

const atsKeywords = {
  "Full Stack Developer": {
    technical: [
      "JavaScript", "TypeScript", "React", "Angular", "Vue.js", "Node.js", "Express",
      "MongoDB", "SQL", "PostgreSQL", "RESTful API", "GraphQL", "HTML5", "CSS3",
      "Git", "Docker", "AWS", "CI/CD", "Redux", "Webpack"
    ],
    soft: [
      "Problem Solving", "Communication", "Teamwork", "Project Management", "Leadership"
    ]
  },

  "Java Developer": {
    technical: [
      "Java", "Spring", "Spring Boot", "Hibernate", "Maven", "JUnit", "Microservices",
      "RESTful API", "SQL", "MySQL", "PostgreSQL", "Docker", "Git", "AWS",
      "Jenkins", "OOP", "Design Patterns", "Multithreading", "JVM", "Kafka"
    ],
    soft: [
      "Problem Solving", "Communication", "Teamwork", "Project Management", "Leadership"
    ]
  },
  
  "Python Developer": {
    technical: [
      "Python", "Django", "Flask", "FastAPI", "SQLAlchemy", "REST API", "Pytest",
      "SQL", "PostgreSQL", "MongoDB", "Redis", "Docker", "Git", "AWS",
      "Pandas", "NumPy", "Machine Learning", "Data Analysis", "CI/CD", "Microservices"
    ],
    soft: [
      "Problem Solving", "Communication", "Teamwork", "Project Management", "Leadership"
    ]
  },
  
  "UI/UX Designer": {
    technical: [
      "UI Design", "UX Design", "User Research", "Wireframing", "Prototyping",
      "User Testing", "Figma", "Sketch", "Adobe XD", "Adobe Photoshop",
      "HTML", "CSS", "Responsive Design", "Information Architecture", "User Flows",
      "Design Systems", "Typography", "Accessibility", "Interaction Design", "Visual Design"
    ],
    soft: [
      "Creativity", "Problem Solving", "Communication", "Teamwork", "Empathy"
    ]
  },
  
  "SEO": {
    technical: [
      "Search Engine Optimization", "Keyword Research", "On-Page SEO", "Off-Page SEO",
      "Technical SEO", "Google Analytics", "Google Search Console", "Ahrefs",
      "SEMrush", "Meta Tags", "Schema Markup", "Link Building", "Content Optimization",
      "Page Speed Optimization", "Google Ads", "PPC", "Backlink Analysis", "XML Sitemaps",
      "Local SEO", "Mobile SEO"
    ],
    soft: [
      "Analytical Thinking", "Problem Solving", "Communication", "Creativity", "Data Analysis"
    ]
  },

  "PROMPT Engineering": {
    technical: [
      "Natural Language Processing", "Machine Learning", "Deep Learning", "AI",
      "GPT", "BERT", "Transformers", "LLMs", "Prompt Design", "Python",
      "TensorFlow", "PyTorch", "OpenAI API", "LangChain", "Vector Databases",
      "Embeddings", "RAG", "Fine-tuning", "Token Optimization", "Hugging Face"
    ],
    soft: [
      "Critical Thinking", "Problem Solving", "Creativity", "Communication", "Research Skills"
    ]
  },
  
  "Mechanical Engineering": {
    technical: [
      "CAD", "SolidWorks", "AutoCAD", "CATIA", "FEA", "CFD", "GD&T",
      "Manufacturing Processes", "CNC", "3D Printing", "Materials Science",
      "Thermodynamics", "Fluid Mechanics", "Robotics", "Control Systems",
      "HVAC", "Product Design", "MATLAB", "Python", "Quality Control"
    ],
    soft: [
      "Problem Solving", "Communication", "Teamwork", "Innovation", "Analytical Thinking"
    ]
  },

  "Medical": {
    technical: [
      "Patient Care", "Clinical Experience", "Medical Terminology", "EHR", "EMR",
      "Epic", "Medical Coding", "ICD-10", "CPT", "HIPAA", "Vital Signs",
      "Phlebotomy", "Medication Administration", "Patient Assessment", "CPR",
      "BLS", "Medical Equipment", "Patient Scheduling", "Medical Records", "Laboratory Procedures"
    ],
    soft: [
      "Communication", "Empathy", "Compassion", "Teamwork", "Problem Solving"
    ]
  },
  
  "HR": {
    technical: [
      "Recruitment", "Talent Acquisition", "Interviewing", "Onboarding", "Employee Relations",
      "Performance Management", "Compensation", "Benefits", "HRIS", "Workday",
      "ATS", "Employee Engagement", "Training & Development", "HR Analytics",
      "Labor Laws", "FLSA", "FMLA", "Diversity & Inclusion", "Conflict Resolution", "Payroll"
    ],
    soft: [
      "Communication", "Problem Solving", "Emotional Intelligence", "Leadership", "Empathy"
    ]
  }
};

// Helper function to get keywords for a specific job role
const getKeywordsForRole = (role) => {
  const roleData = atsKeywords[role];
  if (!roleData) return { technical: [], soft: [] };

  return {
    technical: roleData.technical || [],
    soft: roleData.soft || []
  };
};

// Helper function to get all keywords combined (for backward compatibility)
const getAllKeywordsForRole = (role) => {
  const roleData = getKeywordsForRole(role);
  return [...roleData.technical, ...roleData.soft];
};

module.exports = {
  atsKeywords,
  getKeywordsForRole,
  getAllKeywordsForRole
};