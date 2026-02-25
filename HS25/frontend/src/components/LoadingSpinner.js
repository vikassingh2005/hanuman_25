import React from 'react';

const LoadingSpinner = ({ size = 'medium', fullPage = false }) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return '20px';
      case 'large':
        return '60px';
      case 'medium':
      default:
        return '40px';
    }
  };

  const spinnerStyle = {
    width: getSize(),
    height: getSize(),
    border: `4px solid rgba(0, 0, 0, 0.1)`,
    borderRadius: '50%',
    borderTop: `4px solid #1976d2`,
    animation: 'spin 1s linear infinite',
  };

  const containerStyle = fullPage ? {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1000,
  } : {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 0',
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;