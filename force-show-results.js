// Force show results to test if the component works
const forceShowResults = () => {
  // This will create a simple HTML file that shows the results section
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Test Results Display</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; }
      .card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 10px 0; }
      .btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    
    <script type="text/babel">
      const { useState } = React;
      
      // Mock results data
      const mockResults = {
        success: true,
        score: 85,
        matchedKeywords: ['JavaScript', 'React', 'Node.js'],
        missingKeywords: ['TypeScript', 'Vue.js', 'Angular'],
        feedback: {
          overall: 'Great match! Your resume shows strong alignment with Full Stack Developer requirements.',
          strengths: [
            'Strong technical skills in JavaScript and React',
            'Experience with modern web development frameworks'
          ],
          improvements: [
            'Add more quantifiable achievements',
            'Include specific project details and technologies used'
          ],
          recommendations: [
            'Add a projects section detailing accomplishments',
            'Highlight specific contributions and quantify impact'
          ]
        },
        analysis: {
          matchedCount: 3,
          totalKeywords: 5,
          technicalMatched: 3,
          softMatched: 0,
          technicalTotal: 5,
          softTotal: 0,
          technicalScore: 85,
          softScore: 60,
          matchPercentage: 60,
          contextBonus: 25
        },
        analysisMethod: 'AI',
        aiPowered: true
      };
      
      // Simple AnalysisResults component
      const AnalysisResults = ({ results, jobRole }) => {
        const { score, matchedKeywords, missingKeywords, feedback, analysis, aiPowered } = results;
        
        const getScoreCategory = (score) => {
          if (score >= 80) return { category: 'excellent', color: 'green' };
          if (score >= 60) return { category: 'good', color: 'blue' };
          if (score >= 40) return { category: 'moderate', color: 'orange' };
          return { category: 'poor', color: 'red' };
        };
        
        const scoreInfo = getScoreCategory(score);
        
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h1>Test Results Display</h1>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2>Score: {score}/100</h2>
              <div style={{ color: scoreInfo.color }}>
                Category: {scoreInfo.category}
              </div>
            </div>
            
            <div className="card">
              <h3>Overall Assessment</h3>
              <p>{feedback.overall}</p>
            </div>
            
            <div className="card">
              <h3>Matched Keywords ({matchedKeywords.length})</h3>
              <div>
                {matchedKeywords.map((keyword, index) => (
                  <span key={index} style={{ background: '#e8f5e8', padding: '4px 8px', margin: '4px', display: 'inline-block', borderRadius: '4px' }}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="card">
              <h3>Missing Keywords ({missingKeywords.length})</h3>
              <div>
                {missingKeywords.map((keyword, index) => (
                  <span key={index} style={{ background: '#ffe8e8', padding: '4px 8px', margin: '4px', display: 'inline-block', borderRadius: '4px' }}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            
            <button className="btn" onClick={() => alert('This would reset the analysis')}>Analyze Another Resume</button>
          </div>
        );
      };
      
      // Main App component
      const App = () => {
        const [showResults, setShowResults] = useState(true);
        
        return (
          <div>
            <h1>AI Resume Analyzer - Test Results</h1>
            {showResults ? (
              <AnalysisResults results={mockResults} jobRole="Full Stack Developer" />
            ) : (
              <div>
                <p>This is where the input form would be</p>
                <button className="btn" onClick={() => setShowResults(true)}>Show Results</button>
              </div>
            )}
          </div>
        );
      };
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<App />);
    </script>
  </body>
  </html>
  `;
  
  // Save to a file
  const fs = require('fs');
  fs.writeFileSync('test-results.html', html);
  console.log('Test file created: test-results.html');
  console.log('Open this file in your browser to see the results section');
};

forceShowResults();