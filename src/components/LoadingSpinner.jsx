import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <ClipLoader color="#3b82f6" size={50} />
      <p className="loading-message">
        {message}
        {message.includes('analyzing') && (
          <span><br />AI agent is analyzing and it might take up to 2 minutes for the entire report. Please wait...</span>
        )}
      </p>
    </div>
  );
};

export default LoadingSpinner;