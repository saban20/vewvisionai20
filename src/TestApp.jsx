import React from 'react';

const TestApp = () => {
  console.log('TestApp rendering');
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>VisionAI 2.0 Test Page</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <button 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#00D8FF', 
          border: 'none', 
          borderRadius: '5px',
          color: 'black',
          cursor: 'pointer',
          marginTop: '20px'
        }}
        onClick={() => alert('Button works!')}
      >
        Test Button
      </button>
    </div>
  );
};

export default TestApp; 