# VisionAI Debugging Guide

This document provides comprehensive debugging instructions for the VisionAI system, covering all components and common issues.

## System Components

The VisionAI system consists of these major components:

1. **iOS App**: Face tracking using ARKit
2. **Backend**: API services with AI processing
3. **Web Application**: React-based user interface
4. **Communication Layer**: APIs and WebSockets

## Prerequisites

Before debugging, make sure you have the following installed:

- Node.js (v16+)
- npm
- Git
- Xcode (for iOS debugging)
- Python 3.8+ (for backend debugging)
- Chrome or Firefox (latest version)

## Setting Up a Debugging Environment

```bash
# Clone and set up the project
git clone [repository-url]
cd new-vision-ai

# Install dependencies
npm install

# Install test-specific dependencies
npm install --save-dev puppeteer node-fetch
```

## Component-by-Component Debugging

### 1. iOS App Debugging

#### Testing ARKit Face Tracking

1. Open the iOS project in Xcode
2. Use a device with TrueDepth camera or a simulator with face tracking support
3. Check ARKit configuration:

```swift
let configuration = ARFaceTrackingConfiguration()
configuration.isLightEstimationEnabled = true
```

4. Verify measurements are within expected ranges:
   - Pupillary distance: 50-80mm
   - Face width: 120-160mm

#### Network Communication

1. Use Charles Proxy to monitor API requests
2. Check request formats and ensure data is properly formatted as JSON
3. Verify correct endpoints are being called

### 2. Backend Debugging

#### API Services

1. Run backend in debug mode
2. Test endpoints with Postman:

```
GET /api/measurements
POST /api/measurements
GET /api/measurements/:id
POST /api/analysis
```

3. Verify responses match expected JSON structure

#### AI Model Integration

1. Check model loading:
```python
try:
    model = load_model('path/to/model')
except Exception as e:
    logger.error(f"Model loading failed: {e}")
```

2. Test model with sample inputs:
```python
import numpy as np
test_input = np.zeros((1, 224, 224, 3))  # Sample dimensions
predictions = model.predict(test_input)
```

3. Verify prediction format matches API contract

### 3. Web Application Debugging

#### Setup and Configuration

1. Check Vite configuration:
```bash
# Start with debug logging
DEBUG=vite:* npm run dev
```

2. Verify proxy settings for API calls

#### React Component Testing

1. Run component tests:
```bash
npm test
```

2. Test individual components:
```javascript
// Example testing FaceScanner component
it('should render face scanner', () => {
  render(<FaceScanner />);
  expect(screen.getByText('Scan Face')).toBeInTheDocument();
});
```

#### Chart.js Integration

1. Check Chart.js registration:
```javascript
// Ensure Chart.js is properly registered
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
```

2. Verify data format for charts

### 4. Integration Testing

1. Run end-to-end tests:
```bash
npm run test:e2e
```

2. Test the complete user flow:
   - User login
   - Face scanning
   - Measurement extraction
   - Analysis and recommendations

## Common Issues and Solutions

### iOS App

| Issue | Solution |
|-------|----------|
| ARKit not detecting face | Ensure proper lighting and camera access |
| Measurements unreliable | Verify calibration with known-size object |
| Network errors | Check API endpoints and authentication |

### Backend

| Issue | Solution |
|-------|----------|
| Model loading failure | Check file paths and dependencies |
| Incorrect predictions | Validate input preprocessing |
| Memory issues | Monitor RAM usage during inference |

### Web Application

| Issue | Solution |
|-------|----------|
| Chart.js errors | Ensure chart.js and react-chartjs-2 are installed |
| React hooks errors | Check hook rules (only call at top level) |
| Missing dependencies | Verify package.json and run npm install |

## Performance Profiling

### iOS App

1. Use Instruments in Xcode to profile CPU/GPU usage
2. Check for memory leaks in ARKit sessions

### Web App

1. Use Chrome DevTools Performance tab
2. Monitor rendering performance with React DevTools Profiler

## Logging and Monitoring

1. Set up comprehensive logging:
```javascript
// Frontend
console.log('Debug info:', data);

// Backend
logger.debug(f"Processing request: {request_id}")
```

2. Use try-catch blocks for error handling:
```javascript
try {
  // Code that might fail
} catch (error) {
  console.error('Operation failed:', error);
  // Handle error appropriately
}
```

## Security Considerations

1. Ensure proper JWT validation for authentication
2. Validate all user inputs before processing
3. Use HTTPS for all API communications

## End-to-End Workflow Verification

1. Create a test user
2. Scan face (or upload test image)
3. Verify measurements captured
4. Check analysis results
5. Test product recommendations
6. Validate virtual try-on (if implemented)

## System Architecture Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│             │      │             │      │             │
│   iOS App   │<────>│   Backend   │<────>│   Web App   │
│             │      │             │      │             │
└─────────────┘      └─────────────┘      └─────────────┘
                           ▲
                           │
                     ┌─────────────┐
                     │             │
                     │   AI Model  │
                     │             │
                     └─────────────┘
```

## Final Checklist

- [x] iOS app configured properly
- [x] Backend API endpoints functional
- [x] AI models loaded correctly
- [x] Web app built with required dependencies
- [x] Authentication working
- [x] End-to-end flow verified
- [x] Tests passing
- [x] Performance acceptable

## Support Resources

- [TensorFlow.js Documentation](https://www.tensorflow.org/js/guide)
- [React Documentation](https://reactjs.org/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [MediaPipe Documentation](https://google.github.io/mediapipe/) 