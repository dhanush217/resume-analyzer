# 🚀 AI-Powered Resume Analyzer

A modern, AI-powered web application that analyzes resumes and provides intelligent feedback to improve job application success rates. Built with React, Node.js, and advanced AI algorithms.

![AI Resume Analyzer](https://img.shields.io/badge/AI-Powered-blue) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-Latest-green) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-blue)

## ✨ Features

### 🧠 AI-Powered Analysis
- **Smart Keyword Matching**: Advanced algorithm that matches resume content with job role requirements
- **Contextual Analysis**: Considers where keywords appear (experience vs. education vs. skills)
- **Semantic Understanding**: Goes beyond simple keyword matching to understand context and relevance
- **Weighted Scoring**: Critical skills have higher importance in the overall score calculation

### 📊 Comprehensive Scoring System
- **100-Point Scale**: Clear, standardized scoring from 0-100
- **Category-Based Feedback**: Scores categorized as Excellent (80+), Good (60-79), Moderate (40-59), or Poor (<40)
- **Context Bonus**: Additional points for keywords appearing in relevant sections
- **Real-time Progress**: Animated circular progress indicators with color-coded results

### 🎯 Multi-Role Support
Pre-configured analysis for popular job roles:
- Full Stack Developer
- Java Developer
- Python Developer
- UI/UX Designer
- SEO Specialist
- Prompt Engineering
- Mechanical Engineering
- Medical Professional
- HR Professional

### 📄 Multiple Input Methods
- **File Upload**: Support for PDF, DOC, DOCX, and TXT files (up to 5MB)
- **Drag & Drop**: Intuitive drag-and-drop interface
- **Text Input**: Direct paste functionality with word count validation
- **Real-time Validation**: Immediate feedback on file size and format

### 📈 Detailed Feedback System
- **Overall Assessment**: Comprehensive summary of resume strength
- **Strengths Analysis**: Highlighted positive aspects of your resume
- **Improvement Areas**: Specific recommendations for enhancement
- **Missing Keywords**: Visual tags showing important missing terms
- **Matched Keywords**: Clear display of successfully matched terms

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Tailwind CSS**: Modern, utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Accessible Design**: WCAG compliant with keyboard navigation
- **Professional Theme**: Clean, modern design with consistent color scheme

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - Modern React with hooks and concurrent features
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Framer Motion 10.16.0** - Production-ready motion library
- **React Dropzone 14.2.3** - File upload with drag-and-drop
- **Axios 1.6.0** - HTTP client for API calls
- **Lucide React** - Beautiful, customizable icons
- **React Hot Toast** - Elegant toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.17.1** - Web application framework
- **Multer 1.4.3** - File upload handling
- **Textract 2.5.0** - Text extraction from documents
- **CORS 2.8.5** - Cross-origin resource sharing

### Development Tools
- **PostCSS** - CSS transformation
- **Autoprefixer** - CSS vendor prefixing
- **React Scripts 5.0.1** - Build tools and configuration

## 📁 Project Structure

```
resume-analyzer/
├── backend/
│   ├── index.js              # Express server and API routes
│   ├── atsKeywords.js         # Job role keywords database
│   ├── package.json           # Backend dependencies
│   └── uploads/               # Temporary file storage
├── frontend/
│   ├── public/
│   │   ├── index.html         # HTML template
│   │   └── manifest.json      # PWA manifest
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Navbar.js      # Navigation bar
│   │   │   ├── FileUpload.js  # File upload component
│   │   │   ├── TextInput.js   # Text input component
│   │   │   ├── JobRoleSelector.js  # Job role selection
│   │   │   ├── AnalysisResults.js  # Results display
│   │   │   ├── LoadingSpinner.js   # Loading animation
│   │   │   └── Footer.js      # Footer component
│   │   ├── App.js             # Main application component
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles with Tailwind
│   ├── package.json           # Frontend dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   └── postcss.config.js      # PostCSS configuration
├── package.json               # Root package.json
└── README.md                  # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/ai-resume-analyzer.git
cd ai-resume-analyzer
```

2. **Install root dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

4. **Install frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

### Development Setup

**Environment Configuration:**

1. **Backend Environment Setup**
```bash
cd backend
cp .env.example .env
```
Edit the `.env` file and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Quick Start Commands:**

2. **Frontend Setup & Run**
```bash
cd frontend
npm install
npm start
```
The frontend will run on `http://localhost:3000`

3. **Backend Setup & Run** (in a new terminal)
```bash
cd backend
npm install
npm start
```
The backend will run on `http://localhost:5000`

4. **Open your browser**
Navigate to `http://localhost:3000` to see the application

### Environment Variables

The backend uses the following environment variables (configured in `backend/.env`):

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `GEMINI_API_KEY` | Google Gemini AI API key | - | Yes (for AI features) |
| `PORT` | Backend server port | 5000 | No |
| `NODE_ENV` | Environment mode | development | No |
| `MAX_FILE_SIZE` | Maximum upload file size in bytes | 5242880 (5MB) | No |
| `UPLOAD_DIR` | Directory for uploaded files | uploads | No |
| `CACHE_SIZE` | Maximum cache entries | 50 | No |

**Getting a Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file

## 🔧 Configuration

### Backend Configuration
The backend server runs on port 5000 by default. You can modify this in `backend/index.js`:

```javascript
const port = process.env.PORT || 5000;
```

### Frontend Configuration
The frontend is configured to proxy API requests to `http://localhost:5000`. This is set in `frontend/package.json`:

```json
"proxy": "http://localhost:5000"
```

### Environment Variables
Create a `.env` file in the frontend directory for custom configuration:

```env
REACT_APP_API_URL=http://localhost:5000
```

## 🎯 API Endpoints

### GET /api/job-roles
Returns available job roles for analysis.

**Response:**
```json
{
  "roles": ["Full Stack Developer", "Java Developer", ...]
}
```

### POST /api/analyze-file
Analyzes an uploaded resume file.

**Request:**
- `resume`: File (multipart/form-data)
- `jobRole`: String

**Response:**
```json
{
  "success": true,
  "score": 75,
  "matchedKeywords": ["JavaScript", "React", ...],
  "missingKeywords": ["Docker", "AWS", ...],
  "feedback": {
    "overall": "Good match! Your resume demonstrates...",
    "strengths": [...],
    "improvements": [...],
    "recommendations": [...]
  },
  "analysis": {
    "totalKeywords": 50,
    "matchedCount": 25,
    "matchPercentage": 50,
    "contextBonus": 15
  }
}
```

### POST /api/analyze-text
Analyzes resume text directly.

**Request:**
```json
{
  "resumeText": "Your resume content...",
  "jobRole": "Full Stack Developer"
}
```

**Response:** Same as `/api/analyze-file`

## 🎨 Customization

### Adding New Job Roles
Add new roles to `backend/atsKeywords.js`:

```javascript
const atsKeywords = {
  "Your New Role": [
    "Skill 1", "Skill 2", "Tool 1", "Framework 1",
    // Add relevant keywords...
  ]
};
```

### Styling Customization
Modify the Tailwind configuration in `frontend/tailwind.config.js` to customize colors, fonts, and other design tokens.

### Component Customization
All React components are in `frontend/src/components/` and can be easily modified to match your branding or requirements.

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
npm test  # Add test script to package.json
```

## 📦 Building for Production

### Build Frontend
```bash
cd frontend
npm run build
```

### Build Backend
The backend doesn't require building, but you can add production optimizations:

```bash
cd backend
npm install --production
```

### Deployment
1. Deploy the backend to your preferred hosting service (Heroku, AWS, etc.)
2. Deploy the frontend build to a static hosting service (Netlify, Vercel, S3)
3. Update the `REACT_APP_API_URL` environment variable to point to your backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the amazing utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide](https://lucide.dev/) for beautiful icons
- [React Dropzone](https://react-dropzone.js.org/) for file upload functionality

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/your-username/ai-resume-analyzer/issues) page
2. Create a new issue if your question isn't already answered
3. Contact us at support@example.com

---

**Made with ❤️ for job seekers worldwide**
