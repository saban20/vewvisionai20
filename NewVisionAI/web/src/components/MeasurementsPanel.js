import React from 'react';
import { motion } from 'framer-motion';

const MeasurementsPanel = ({ measurements }) => {
  return (
    <motion.div className="glass-card" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }}>
      <h2>Your Measurements</h2>
      {measurements ? (
        <div>
          <p>Pupillary Distance: {measurements.pupillaryDistance} mm</p>
          <p>Bridge Width: {measurements.bridgeWidth} mm</p>
          <p>Lens Height: {measurements.lensHeight} mm</p>
          <p>Recommended Style: {measurements.recommendedStyle}</p>
          <motion.div
            animate={{ width: [0, measurements.pupillaryDistance * 2] }}
            transition={{ duration: 1 }}
            style={{ height: '10px', background: '#00CED1', marginTop: '10px' }}
          />
        </div>
      ) : (
        <p>No measurements yet. Start with the scanner!</p>
      )}
    </motion.div>
  );
};

export default MeasurementsPanel; 