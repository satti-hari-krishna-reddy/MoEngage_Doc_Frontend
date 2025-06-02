import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const AnalysisResults = ({ analysis, onRevise, revisionLoading, showReviseButton }) => {
  // Format title from snake_case to Proper Case
  const formatTitle = (str) => {
    return str
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Recursive renderer for nested objects
  const renderAnalysisSection = (data, title, level = 1) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return null;
    }

    return (
      <div className={`analysis-section level-${level}`} key={title}>
        {title && <h3 className="section-title">{formatTitle(title)}</h3>}
        <div className="section-content">
          {Object.entries(data).map(([key, value]) => {
            // If value is an object, recursively render it
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
              return renderAnalysisSection(value, key, level + 1);
            }

            // If value is an array, render each item
            if (Array.isArray(value)) {
              return (
                <div key={key} className="analysis-item">
                  <span className="item-key">{formatTitle(key)}:</span>
                  <ul className="array-list">
                    {value.map((item, index) => (
                      <li key={index}>
                        {typeof item === 'object' ? (
                          <SyntaxHighlighter language="json" style={docco}>
                            {JSON.stringify(item, null, 2)}
                          </SyntaxHighlighter>
                        ) : (
                          item
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            // Render simple key-value pair
            return (
              <div key={key} className="analysis-item">
                <span className="item-key">{formatTitle(key)}:</span>
                <span className="item-value">{value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="analysis-results">
      <h2>Analysis Results</h2>

      {showReviseButton && (
        <div className="revise-button-container top">
          <button
            onClick={onRevise}
            disabled={revisionLoading}
            className="revise-btn"
          >
            {revisionLoading ? 'Running Agent 2...' : 'Run Agent 2'}
          </button>
          {revisionLoading && <p>Generating improvements based on analysis...</p>}
        </div>
      )}

      <div className="results-content">
        {analysis ? (
          <>
            {Object.entries(analysis).map(([key, value]) =>
              typeof value === 'object' && value !== null && !Array.isArray(value) ? (
                renderAnalysisSection(value, key)
              ) : (
                <div key={key} className="analysis-item">
                  <span className="item-key">{formatTitle(key)}:</span>
                  <span className="item-value">{value}</span>
                </div>
              )
            )}
          </>
        ) : (
          <p>No analysis data available</p>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;
