import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FaceScanVisualizer = ({ onScanComplete, isScanning }) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('initializing');
  const [detectedFeatures, setDetectedFeatures] = useState([]);

  const phases = [
    { id: 'initializing', label: 'Initializing Scanner', duration: 1500 },
    { id: 'detecting', label: 'Detecting Face', duration: 2000 },
    { id: 'analyzing', label: 'Analyzing Features', duration: 4000 },
    { id: 'measuring', label: 'Taking Measurements', duration: 2500 },
    { id: 'processing', label: 'Processing Results', duration: 2000 },
    { id: 'complete', label: 'Scan Complete', duration: 1000 },
  ];

  const features = [
    { id: 'face', label: 'Face Detected', icon: '👤' },
    { id: 'eyes', label: 'Eye Distance', icon: '👁️' },
    { id: 'nose', label: 'Nose Structure', icon: '👃' },
    { id: 'jawline', label: 'Jawline Shape', icon: '🧬' },
    { id: 'forehead', label: 'Forehead Width', icon: '📏' },
  ];

  useEffect(() => {
    if (!isScanning) {
      setScanProgress(0);
      setCurrentPhase('initializing');
      setDetectedFeatures([]);
      return;
    }

    let currentPhaseIndex = 0;
    let accumulatedTime = 0;
    const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);

    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + 1;
        
        // Calculate which phase we should be in
        if (newProgress >= 100) {
          clearInterval(scanInterval);
          onScanComplete();
          return 100;
        }

        // Current time based on progress percentage
        const currentTime = (newProgress / 100) * totalDuration;
        
        // Find current phase based on accumulated time
        let timeSum = 0;
        for (let i = 0; i < phases.length; i++) {
          timeSum += phases[i].duration;
          if (currentTime <= timeSum) {
            if (currentPhaseIndex !== i) {
              currentPhaseIndex = i;
              setCurrentPhase(phases[i].id);
              
              // Add detected features gradually
              if (i >= 2 && i <= 4) {
                const featureIndex = i - 2;
                if (featureIndex < features.length) {
                  setDetectedFeatures(prev => [...prev, features[featureIndex]]);
                }
              }
            }
            break;
          }
        }
        
        return newProgress;
      });
    }, totalDuration / 100);

    return () => clearInterval(scanInterval);
  }, [isScanning, onScanComplete]);

  const getCurrentPhaseLabel = () => {
    const phase = phases.find(p => p.id === currentPhase);
    return phase ? phase.label : '';
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-xl p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
        Face Analysis Scanner
      </h2>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Scanner visualization */}
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          <div className="absolute inset-0 rounded-full border-4 border-slate-700 overflow-hidden">
            {/* Scanning animation */}
            {isScanning && (
              <>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent"
                  initial={{ y: '100%' }}
                  animate={{ y: '-100%' }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
                <motion.div 
                  className="absolute inset-x-0 h-1 bg-blue-500"
                  initial={{ y: '0%' }}
                  animate={{ y: '100%' }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
              </>
            )}
            
            {/* Face outline */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="70%" height="70%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path 
                  d="M50 10C30 10 20 30 20 50C20 70 30 90 50 90C70 90 80 70 80 50C80 30 70 10 50 10Z" 
                  stroke={isScanning ? "#60A5FA" : "#475569"}
                  strokeWidth="2"
                  strokeDasharray="1 3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: isScanning ? 1 : 0 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.circle 
                  cx="35" cy="40" r="5" 
                  stroke={detectedFeatures.some(f => f.id === 'eyes') ? "#60A5FA" : "#475569"}
                  strokeWidth="2"
                  fill="none"
                />
                <motion.circle 
                  cx="65" cy="40" r="5" 
                  stroke={detectedFeatures.some(f => f.id === 'eyes') ? "#60A5FA" : "#475569"}
                  strokeWidth="2"
                  fill="none"
                />
                <motion.path 
                  d="M42 60C45 65 55 65 58 60" 
                  stroke={detectedFeatures.some(f => f.id === 'nose') ? "#60A5FA" : "#475569"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <motion.path 
                  d="M30 75C35 83 65 83 70 75" 
                  stroke={detectedFeatures.some(f => f.id === 'jawline') ? "#60A5FA" : "#475569"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <motion.path 
                  d="M30 25C35 17 65 17 70 25" 
                  stroke={detectedFeatures.some(f => f.id === 'forehead') ? "#60A5FA" : "#475569"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>
          
          {/* Distance measurement indicators */}
          {detectedFeatures.length > 2 && (
            <>
              <motion.div 
                className="absolute top-1/4 left-1/4 w-1/2 h-px bg-blue-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
              >
                <div className="absolute -top-3 -right-2 text-xs text-blue-400">68mm</div>
              </motion.div>
              <motion.div 
                className="absolute top-1/3 right-1/4 h-1/3 w-px bg-blue-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5 }}
              >
                <div className="absolute -top-3 -left-6 text-xs text-blue-400">52mm</div>
              </motion.div>
            </>
          )}
        </div>
        
        {/* Status panel */}
        <div className="flex-1 flex flex-col">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300">{getCurrentPhaseLabel()}</span>
              <span className="text-sm font-medium">{scanProgress}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full" 
                style={{ width: `${scanProgress}%` }}
                initial={{ width: '0%' }}
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          
          <div className="space-y-3 mt-4">
            <h3 className="text-md font-medium">Detected Features:</h3>
            <AnimatePresence>
              {detectedFeatures.map((feature, index) => (
                <motion.div 
                  key={feature.id}
                  className="flex items-center p-2 bg-slate-800/50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <span className="text-lg mr-3">{feature.icon}</span>
                  <span>{feature.label}</span>
                  <motion.div 
                    className="ml-auto w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.1, type: 'spring' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {detectedFeatures.length === 0 && (
              <div className="p-3 bg-slate-800/50 rounded-lg text-slate-400 italic text-sm">
                {isScanning ? 'Waiting for face detection...' : 'Press "Scan Face" to begin analysis'}
              </div>
            )}
          </div>
          
          <div className="mt-auto pt-6">
            <button 
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                isScanning ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={() => {
                if (!isScanning) {
                  onScanComplete();
                }
              }}
            >
              {isScanning ? 'Cancel Scan' : 'Scan Face'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceScanVisualizer; 