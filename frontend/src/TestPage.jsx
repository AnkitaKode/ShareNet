import React from 'react';

const TestPage = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#333' }}>ShareX Test Page</h1>
      <p style={{ color: '#666' }}>If you can see this, React is working correctly!</p>
      <div style={{ marginTop: '20px' }}>
        <button 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={() => alert('Button clicked!')}
        >
          Test Button
        </button>
      </div>
    </div>
  );
};

export default TestPage;