import React, { useRef, useEffect, useState } from 'react';
import AIEyewearEngine from './AIEyewearEngine';
import './App.css';

const FaceScanner3D = ({ onResults, isIOS = false }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [engine, setEngine] = useState(null);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const initEngine = async () => {
      const aiEngine = new AIEyewearEngine(videoRef.current, canvasRef.current, isIOS);
      await aiEngine.initialize();
      setEngine(aiEngine);
      setStatus('Ready');
    };
    initEngine();
    return () => engine && engine.stop();
  }, [engine, isIOS]);

  const handleCapture = async () => {
    if (engine) {
      const results = isIOS ? engine.getResults() : await engine.processClip(3000);
      setStatus('Captured');
      onResults(results);
    }
  };

  return (
    <div className="holo-card">
      <h2>Quantum Resonance Scanner</h2>
      <div style={{ position: 'relative' }}>
        <video ref={videoRef} style={{ width: '100%', borderRadius: '12px' }} autoPlay muted playsInline />
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%' }} width="640" height="480" />
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 0, 122, 0.3)',
            padding: '8px 16px',
            borderRadius: '20px',
          }}
        >
          {status}
        </div>
      </div>
      <button className="cyber-button" onClick={handleCapture}>
        {isIOS ? 'Capture Live' : 'Process Clip'}
      </button>
    </div>
  );
};

export default FaceScanner3D; 