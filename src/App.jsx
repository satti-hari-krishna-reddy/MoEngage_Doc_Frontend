import { useState } from 'react';
import './App.css';
import URLForm from './components/URLForm';
import AnalysisResults from './components/AnalysisResults';
import TextComparison from './components/TextComparison';
import { analyzeURL, reviseText } from './services/api';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [rawText, setRawText] = useState('');
  const [revisedText, setRevisedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [revisionLoading, setRevisionLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    try {
      setError('');
      setLoading(true);
      setAnalysis(null);
      setRawText('');
      setRevisedText('');

      const data = await analyzeURL(url);
      
      // Validate response data
      if (!data.analysis || !data.raw_text) {
        throw new Error('Invalid response format from server');
      }

      setAnalysis(data.analysis);
      setRawText(data.raw_text);
    } catch (err) {
      setError(err.message || 'An error occurred during analysis');
      setAnalysis(null);
      setRawText('');
    } finally {
      setLoading(false);
    }
  };

  const handleRevise = async () => {
    try {
      if (!rawText || !analysis) {
        throw new Error('Missing required data for revision');
      }

      setError('');
      setRevisionLoading(true);
      setLoading(true);
      
      const data = await reviseText(rawText, analysis);
      setRevisedText(data.revised_text);
    } catch (err) {
      setError(err.message || 'An error occurred during revision');
      setRevisedText('');
    } finally {
      setRevisionLoading(false);
      setLoading(false);
      setAnalysis(null);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>URL Analysis Tool</h1>
        <p className="subtitle">Analyze and improve website content</p>
      </header>

      <main>
        <URLForm 
          url={url} 
          setUrl={setUrl} 
          onAnalyze={handleAnalyze} 
          loading={loading} 
        />

        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <LoadingSpinner message="Analyzing URL content and this might take some time please wait..." />
        ) : (
          <>
            {analysis && (
              <div className="results-container">
                <AnalysisResults 
                  analysis={analysis} 
                  onRevise={handleRevise}
                  revisionLoading={revisionLoading}
                  showReviseButton={!revisedText}
                />
              </div>
            )}
            
            {revisedText && (
              <TextComparison 
                originalText={rawText} 
                revisedText={revisedText} 
              />
            )}
          </>
        )}
      </main>

      <footer>
        <p>© 2025 URL Analysis Tool</p>
      </footer>
    </div>
  );
}

export default App;