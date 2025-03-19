import React, { useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext, AccessibilityContext, AIContext, AuthContext } from '../main';
import PersonalizedUI from './PersonalizedUI';
import ARScene from './ARScene';
import AnimatedButton from './AnimatedButton';
import CloseButton from './CloseButton';
import ThemeToggle from './ThemeToggle';
import * as faceapi from 'face-api.js';
import { Typography } from '@mui/material';

const MeasurementsApp = () => {
  const { themeMode, setThemeMode } = useContext(ThemeContext);
  const { enableVoiceControl } = useContext(AccessibilityContext);
  const { status: aiStatus } = useContext(AIContext);
  const { logout } = useContext(AuthContext);
  const arContainerRef = useRef(null);
  const videoRef = useRef(null);
  const [emotion, setEmotion] = useState(null);

  const hapticFeedback = () => {
    if ('vibrate' in navigator) navigator.vibrate(50);
  };

  const detectEmotion = async () => {
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      if (videoRef.current) {
        const detections = await faceapi.detectSingleFace(videoRef.current).withFaceExpressions();
        if (detections) {
          const topEmotion = detections.expressions.asSortedArray()[0].expression;
          setEmotion(topEmotion);
          document.body.className = topEmotion === 'happy' ? 'bg-yellow-300' : 'bg-blue-500';
        }
      }
    } catch (error) {
      console.error('Emotion detection failed:', error);
    }
  };

  useEffect(() => {
    enableVoiceControl();
    detectEmotion();
  }, [enableVoiceControl]);

  console.log('MeasurementsApp rendering, emotion:', emotion);

  return (
    <div className="hologram-card max-w-md w-full relative">
      <CloseButton onClick={logout} />
      <Typography variant="h4" className="text-center mb-6 hologram">NewVisionAI Measurements</Typography>
      <PersonalizedUI setThemeMode={setThemeMode} />
      <ThemeToggle />
      <AnimatedButton
        id="ar-btn"
        className="hologram-button mb-4 w-full"
        onClick={() => hapticFeedback()}
      >
        Start AR Measurement
      </AnimatedButton>
      <Typography className="text-center mb-4">
        AI Status: {aiStatus.loading ? 'Loading...' : aiStatus.initialized ? 'Ready' : 'Error'}
      </Typography>
      {aiStatus.error && (
        <Typography className="text-center text-[#FF4F5A] mb-4">{aiStatus.error}</Typography>
      )}
      {emotion && (
        <Typography className="text-center mb-4">Emotion: {emotion}</Typography>
      )}
      <video ref={videoRef} autoPlay muted className="w-full h-48 mb-4 hidden" />
      <div ref={arContainerRef} className="w-full h-64">
        <ARScene containerRef={arContainerRef} />
      </div>
    </div>
  );
};

export default MeasurementsApp; 