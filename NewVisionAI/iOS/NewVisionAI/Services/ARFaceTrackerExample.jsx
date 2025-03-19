import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import ARFaceTrackerBridge from './ARFaceTrackerBridge';
import AIEyewearEngine from './AIEyewearEngine';

const ARFaceTrackerExample = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [faceData, setFaceData] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to face tracking updates
    const frameSubscription = ARFaceTrackerBridge.addFaceUpdateListener((data) => {
      setFaceData(data);
      
      // Process data through AIEyewearEngine
      const processed = AIEyewearEngine.processData(data);
      setProcessedData(processed);
    });

    // Subscribe to errors
    const errorSubscription = ARFaceTrackerBridge.addErrorListener((error) => {
      setError(error.error);
      setIsTracking(false);
    });

    // Clean up subscriptions on unmount
    return () => {
      frameSubscription.remove();
      errorSubscription.remove();
      if (isTracking) {
        ARFaceTrackerBridge.stopTracking();
      }
    };
  }, [isTracking]);

  const startTracking = () => {
    setError(null);
    ARFaceTrackerBridge.startTracking();
    setIsTracking(true);
  };

  const stopTracking = () => {
    ARFaceTrackerBridge.stopTracking();
    setIsTracking(false);
  };

  // Helper to render measurements
  const renderMeasurements = () => {
    if (!processedData || !processedData.measurements) return null;
    
    const { measurements } = processedData;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Measurements</Text>
        <Text>PD: {measurements.pd.toFixed(1)} mm</Text>
        <Text>Bridge Height: {measurements.bridgeHeight.toFixed(1)} mm</Text>
        <Text>Lens Height: {measurements.lensHeight.toFixed(1)} mm</Text>
        <Text>Face Width: {measurements.faceWidth.toFixed(1)} mm</Text>
        <Text>Jawline Width: {measurements.jawlineWidth.toFixed(1)} mm</Text>
        <Text>Forehead Height: {measurements.foreheadHeight.toFixed(1)} mm</Text>
      </View>
    );
  };

  // Helper to render dynamics
  const renderDynamics = () => {
    if (!processedData || !processedData.dynamics) return null;
    
    const { dynamics } = processedData;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dynamics</Text>
        <Text>Blink Rate: {dynamics.blinkRate.toFixed(2)}</Text>
        <Text>Smile Intensity: {dynamics.smileIntensity.toFixed(2)}</Text>
        <Text>Head Tilt: {dynamics.headTilt.toFixed(1)}°</Text>
        <Text>Movement Energy: {dynamics.movementEnergy.toFixed(2)}</Text>
      </View>
    );
  };

  // Helper to render face shape
  const renderFaceShape = () => {
    if (!processedData || !processedData.faceShape) return null;
    
    const { faceShape } = processedData;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Face Shape</Text>
        {Object.entries(faceShape).map(([shape, confidence]) => (
          <Text key={shape}>{shape}: {(confidence * 100).toFixed(0)}%</Text>
        ))}
      </View>
    );
  };

  // Helper to render visual aura
  const renderVisualAura = () => {
    if (!processedData || !processedData.visualAura) return null;
    
    const [r, g, b] = processedData.visualAura;
    const auraColor = `rgb(${Math.floor(r*255)}, ${Math.floor(g*255)}, ${Math.floor(b*255)})`;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visual Aura</Text>
        <View style={[styles.auraBox, {backgroundColor: auraColor}]} />
        <Text>RGB: [{(r * 255).toFixed(0)}, {(g * 255).toFixed(0)}, {(b * 255).toFixed(0)}]</Text>
      </View>
    );
  };

  // Helper to render recommendations
  const renderRecommendations = () => {
    if (!processedData || !processedData.recommendations) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        {processedData.recommendations.map((rec, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Text style={styles.recommendationName}>{rec.name}</Text>
            <View style={styles.resonanceBar}>
              <View 
                style={[
                  styles.resonanceFill, 
                  {width: `${(rec.resonance * 100).toFixed(0)}%`}
                ]} 
              />
            </View>
            <Text style={styles.resonanceText}>{(rec.resonance * 100).toFixed(0)}%</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AR Face Tracker</Text>
        <View style={styles.buttonContainer}>
          <Button
            title={isTracking ? "Stop Tracking" : "Start Tracking"}
            onPress={isTracking ? stopTracking : startTracking}
          />
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {processedData && (
        <View style={styles.dataContainer}>
          {renderMeasurements()}
          {renderDynamics()}
          {renderFaceShape()}
          {renderVisualAura()}
          {renderRecommendations()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    minWidth: 120,
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#ffdddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#cc0000',
  },
  dataContainer: {
    flex: 1,
  },
  section: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  auraBox: {
    height: 40,
    borderRadius: 6,
    marginVertical: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  recommendationName: {
    width: 120,
    fontSize: 16,
  },
  resonanceBar: {
    flex: 1,
    height: 12,
    backgroundColor: '#eee',
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 8,
  },
  resonanceFill: {
    height: '100%',
    backgroundColor: '#4a90e2',
    borderRadius: 6,
  },
  resonanceText: {
    width: 40,
    textAlign: 'right',
  },
});

export default ARFaceTrackerExample; 