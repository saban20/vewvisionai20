import React from 'react';

function MeasurementsPanel({ measurements }) {
    return (
        <div className="glass-card">
            {measurements ? (
                <div>Pupillary Distance: {measurements.pupillaryDistance} mm</div>
            ) : (
                <div>No measurements available</div>
            )}
        </div>
    );
}

export default MeasurementsPanel; 