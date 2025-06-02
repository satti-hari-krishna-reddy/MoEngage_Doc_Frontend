import React, { useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';

const TextComparison = ({ originalText, revisedText }) => {
  const [showDiff, setShowDiff] = useState(true);
  
  // Check if there are any differences
  const hasDifferences = originalText !== revisedText;
  
  const formatText = (text) => {
    // Preserve the original structure for storage but display with proper formatting
    return text.replace(/\\n/g, '\n');
  };

  return (
    <div className="text-comparison-container">
      <h2>Text Comparison</h2>
      
      <div className="comparison-controls">
        <button 
          className={`view-mode-btn ${showDiff ? 'active' : ''}`}
          onClick={() => setShowDiff(true)}
        >
          Show Differences
        </button>
        <button 
          className={`view-mode-btn ${!showDiff ? 'active' : ''}`}
          onClick={() => setShowDiff(false)}
        >
          Show Full Text
        </button>
      </div>
      
      {!hasDifferences && (
        <div className="no-differences-message">
          <p>No changes were made to the text.</p>
        </div>
      )}
      
      <div className="diff-container">
        {showDiff ? (
          <ReactDiffViewer
            oldValue={formatText(originalText)}
            newValue={formatText(revisedText)}
            splitView={true}
            leftTitle="Original Text"
            rightTitle="Revised Text"
            disableWordDiff={false}
            showDiffOnly={false}
            useDarkTheme={false}
          />
        ) : (
          <div className="full-text-view">
            <div className="text-column">
              <h3>Original Text</h3>
              <div className="text-content">{formatText(originalText)}</div>
            </div>
            <div className="text-column">
              <h3>Revised Text</h3>
              <div className="text-content">{formatText(revisedText)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextComparison;