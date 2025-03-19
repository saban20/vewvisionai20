import React, { useEffect } from 'react';

const ARScene = ({ containerRef }) => {
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = `
        <a-scene embedded>
          <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9" class="hologram"></a-box>
          <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E" class="hologram"></a-sphere>
          <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4" class="hologram"></a-plane>
        </a-scene>
      `;
    }
    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [containerRef]);

  return null;
};

export default ARScene; 