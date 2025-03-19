import React from 'react';

const CloseButton = ({ onClick }) => (
  <button
    aria-label="Close dialog"
    onClick={onClick}
    className="absolute top-2 right-2 hologram-button text-xl"
  >
    <span aria-hidden="true">×</span>
  </button>
);

export default CloseButton; 