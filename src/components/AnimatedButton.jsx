import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({ children, className, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    className={className}
    {...props}
  >
    {children}
  </motion.button>
);

export default AnimatedButton; 