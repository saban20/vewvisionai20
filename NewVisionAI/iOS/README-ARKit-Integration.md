# ARKit Face Tracking Integration for NewVisionAI

This document describes the implementation of ARKit face tracking in the NewVisionAI iOS application, which bridges face data to React Native for processing by the AIEyewearEngine.

## Overview

The integration uses ARKit's face tracking capabilities to extract facial measurements, dynamics, and expressions, which are then processed to generate eyewear recommendations. The data flow is as follows:

1. Native Swift code captures face tracking data from ARKit
2. Data is processed and sent to React Native via a bridge
3. JavaScript AIEyewearEngine processes the data and produces recommendations
4. UI displays measurements, dynamics, and personalized recommendations

## File Structure

- **`Services/ARFaceTracker.swift`**: Core native module implementing ARKit face tracking
- **`Services/ARFaceTracker.m`**: Objective-C bridge exposing native functionality to React Native
- **`Services/ARFaceTrackerBridge.js`**: JavaScript interface for the native module
- **`Services/AIEyewearEngine.js`**: Engine that processes face data and generates recommendations
- **`Services/ARFaceTrackerExample.jsx`**: Example React Native component showing usage

## Setup Requirements

1. **iOS Device Compatibility**: ARKit face tracking requires an iOS device with TrueDepth camera (iPhone X or newer)
2. **Permissions**: Add the following to your `Info.plist`:
   ```xml
   <key>NSCameraUsageDescription</key>
   <string>We need camera access to analyze your face for eyewear recommendations</string>
   ```
3. **Dependencies**: Ensure React Native is properly set up with native module support

## Usage

### 1. Import the bridge in your React Native component

```javascript
import ARFaceTrackerBridge from './Services/ARFaceTrackerBridge';
import AIEyewearEngine from './Services/AIEyewearEngine';
```

### 2. Set up listeners for face tracking data

```javascript
// Subscribe to face tracking updates
const frameSubscription = ARFaceTrackerBridge.addFaceUpdateListener((data) => {
  // Process data through AIEyewearEngine
  const processed = AIEyewearEngine.processData(data);
  
  // Use processed data in your UI
  setProcessedData(processed);
});

// Subscribe to errors
const errorSubscription = ARFaceTrackerBridge.addErrorListener((error) => {
  console.error(error.error);
});

// Remember to clean up
useEffect(() => {
  return () => {
    frameSubscription.remove();
    errorSubscription.remove();
  };
}, []);
```

### 3. Start and stop tracking

```javascript
// Start face tracking
ARFaceTrackerBridge.startTracking();

// Stop face tracking
ARFaceTrackerBridge.stopTracking();
```

## Data Format

The face tracking data is provided in the following format:

```json
{
  "measurements": { 
    "pd": 64.2, 
    "bridgeHeight": 18.7, 
    "lensHeight": 39.4, 
    "faceWidth": 140.1, 
    "jawlineWidth": 110.5, 
    "foreheadHeight": 65.3 
  },
  "dynamics": { 
    "blinkRate": 0.33, 
    "smileIntensity": 0.7, 
    "headTilt": 10, 
    "movementEnergy": 0.4 
  },
  "faceShape": { 
    "oval": 0.6, 
    "round": 0.2, 
    "square": 0.1, 
    "heart": 0.05, 
    "diamond": 0.05 
  },
  "visualAura": [0.65, 0.85, 0.40],
  "recommendations": [
    { "name": "Quantum Pulse", "resonance": 0.92 },
    { "name": "Ethereal Orbit", "resonance": 0.87 },
    { "name": "Void Runner", "resonance": 0.79 }
  ],
  "landmarks": [[x1, y1, z1], [x2, y2, z2], ...], // Raw face landmarks
  "blendShapes": { "eyeBlinkLeft": 0.1, ... } // Raw blend shapes
}
```

## Performance Considerations

- Face tracking is computationally intensive and may impact battery life
- Consider throttling the frequency of updates in production
- The example implementation includes placeholders that should be refined for production use

## Extending the Implementation

### Adding New Measurements

To add new facial measurements, modify the `calculateFaceMeasurements` method in `ARFaceTracker.swift`:

```swift
private func calculateFaceMeasurements(_ faceAnchor: ARFaceAnchor) -> [String: Float] {
    // Add new measurements here
    return [
        "pd": pdInMm,
        "newMeasurement": calculateNewMeasurement(faceAnchor)
    ]
}
```

### Improving Face Shape Detection

The current implementation uses placeholder values for face shape detection. For production, this should be replaced with a more sophisticated algorithm:

1. Consider using machine learning to classify face shapes
2. Use more precise landmark measurements for shape calculation
3. Refine the face shape affinities in the eyewear database

## Troubleshooting

1. **Face tracking not working on simulator**: ARKit face tracking requires a physical device with TrueDepth camera
2. **Bridge not connecting**: Ensure the native module is properly linked in your React Native setup
3. **Performance issues**: Try reducing the frequency of updates or the complexity of data processing 