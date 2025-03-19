import React, { useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

const PersonalizedUI = ({ setThemeMode }) => {
  useEffect(() => {
    const personalize = async () => {
      try {
        const model = await tf.loadLayersModel('/models/user-behavior-model.json');
        const userData = tf.tensor2d([[0.5, 0.3, 0.8]]); // Mock data
        const prediction = model.predict(userData);
        const preferredTheme = prediction.dataSync()[0] > 0.5 ? 'dark' : 'light';
        setThemeMode(preferredTheme);
      } catch (error) {
        console.error('Error in personalization:', error);
      }
    };
    personalize();
  }, [setThemeMode]);

  return <div className="text-center text-[#D9D9D9] mb-4 hologram">Personalizing Experience...</div>;
};

export default PersonalizedUI; 