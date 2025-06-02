import { useState } from 'react';

const URLForm = ({ url, setUrl, onAnalyze, loading }) => {
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    // Only validate if there's actual input
    if (value.trim()) {
      try {
        // Use URL constructor for proper URL validation
        new URL(value);
        setIsValid(true);
      } catch {
        // If URL is not properly formatted but has content, don't show error yet
        setIsValid(true);
      }
    } else {
      setIsValid(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedUrl = url.trim();
    
    if (!trimmedUrl) {
      setIsValid(false);
      return;
    }

    // Add http:// if protocol is missing
    let urlToAnalyze = trimmedUrl;
    if (!urlToAnalyze.startsWith('http://') && !urlToAnalyze.startsWith('https://')) {
      urlToAnalyze = 'https://' + urlToAnalyze;
      setUrl(urlToAnalyze);
    }

    try {
      new URL(urlToAnalyze);
      setIsValid(true);
      onAnalyze();
    } catch {
      setIsValid(false);
    }
  };

  return (
    <div className="url-form-container">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={url}
            onChange={handleChange}
            placeholder="Enter website URL (e.g., example.com)"
            className={isValid ? '' : 'invalid'}
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="analyze-btn"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {!isValid && <p className="validation-error">Please enter a valid URL</p>}
      </form>
    </div>
  );
};

export default URLForm;