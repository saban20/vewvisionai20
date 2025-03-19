import * as tf from '@tensorflow/tfjs';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

// Utility functions for geometric calculations
const euclideanDistance = (p1, p2) => {
  return Math.sqrt(
    Math.pow(p2.x - p1.x, 2) +
    Math.pow(p2.y - p1.y, 2) +
    Math.pow((p2.z || 0) - (p1.z || 0), 2)
  );
};

const normalizeLandmarks = (landmarks) => {
  const noseTip = landmarks[1]; // Reference point (nose tip)
  return landmarks.map(point => ({
    x: point.x - noseTip.x,
    y: point.y - noseTip.y,
    z: (point.z || 0) - (noseTip.z || 0),
  }));
};

// Neural network for style prediction
const createStyleModel = () => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 128, inputShape: [468 * 3], activation: 'relu' }));
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 8, activation: 'softmax' })); // 8 face shapes based on the backend models
  model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });
  return model;
};

// Train style model with real data from backend
async function trainStyleModel() {
  try {
    // Fetch real data from backend
    const response = await fetch('/api/training-data');
    if (!response.ok) {
      throw new Error(`Failed to fetch training data: ${response.status}`);
    }
    
    const realData = await response.json();
    
    // Create model
    const model = createStyleModel();
    
    // Prepare training data from real data
    const landmarks = realData.landmarks || [];
    const labels = realData.labels || [];
    
    if (landmarks.length === 0 || labels.length === 0) {
      console.warn('No training data available');
      return model;
    }
    
    // Convert data to tensors
    const xs = tf.tensor2d(landmarks);
    const ys = tf.tensor2d(labels);
    
    // Train the model
    await model.fit(xs, ys, { 
      epochs: 20, 
      batchSize: 32,
      validationSplit: 0.1,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Training... Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
        }
      }
    });
    
    // Clean up tensors
    tf.dispose([xs, ys]);
    
    console.log('Style model training complete');
    return model;
  } catch (error) {
    console.error('Error training style model:', error);
    // Fallback to simulated data if API fails
    console.log('Falling back to simulated training data');
    
    const model = createStyleModel();
    const xs = tf.randomNormal([100, 468 * 3]); // Simulated landmark data
    const ys = tf.oneHot(tf.randomUniform([100], 0, 8, 'int32'), 8); // 8 face shapes
    await model.fit(xs, ys, { epochs: 10, batchSize: 32 });
    
    tf.dispose([xs, ys]);
    return model;
  }
}

// Load pretrained eyewear recommendation model
async function loadPretrainedModel() {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 64, inputShape: [6], activation: 'relu' }));
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 16, activation: 'sigmoid' }));
  
  // In a real implementation, you would load actual weights
  // await model.loadWeights('path/to/model/weights');
  
  return model;
}

// Cache for measurements
let cachedMeasurements = null;
let lastMeasurementsRequest = null;

// Fetch measurements from the backend API
export async function getMeasurements() {
  // Check if we have a cached result and it's still recent (within 5 seconds)
  const now = Date.now();
  if (cachedMeasurements && lastMeasurementsRequest && (now - lastMeasurementsRequest < 5000)) {
    console.log('Using cached measurements');
    return cachedMeasurements;
  }
  
  try {
    const response = await fetch('/api/measurements');
    if (!response.ok) {
      throw new Error(`Failed to fetch measurements: ${response.status}`);
    }
    
    // Update cache and timestamp
    cachedMeasurements = await response.json();
    lastMeasurementsRequest = now;
    
    return cachedMeasurements;
  } catch (error) {
    console.error('Error fetching measurements:', error);
    // If we have a cached version, return it even if outdated
    if (cachedMeasurements) {
      console.warn('Returning outdated cached measurements due to fetch error');
      return cachedMeasurements;
    }
    throw error;
  }
}

// Cache for recommendations
let cachedRecommendations = {};

// Standalone function for getting eyewear recommendations
export async function getRecommendations(measurements) {
  // Create a cache key by stringifying the measurements object
  const cacheKey = JSON.stringify(measurements);
  
  // Check if we have this exact measurements cached
  if (cachedRecommendations[cacheKey]) {
    console.log('Using cached recommendations');
    return cachedRecommendations[cacheKey];
  }
  
  const model = await loadPretrainedModel();
  
  // Convert measurements to tensor
  const inputData = [
    measurements.pd || 0,
    measurements.bridgeHeight || 0,
    measurements.lensHeight || 0,
    measurements.faceWidth || 0,
    measurements.jawlineWidth || 0,
    measurements.foreheadHeight || 0
  ];
  
  const inputTensor = tf.tensor2d([inputData]);
  
  // Get raw predictions
  const rawPredictions = model.predict(inputTensor);
  const predictionArray = Array.from(await rawPredictions.data());
  
  // Clean up tensors
  tf.dispose([inputTensor, rawPredictions]);
  
  // Format recommendations based on existing frame database
  const frameDatabase = [
    { id: 'f1', name: 'Quantum Pulse', style: 'futuristic', pd: 65, bridge: 18, lensHeight: 40, aura: [0.8, 0.2, 0.5] },
    { id: 'f2', name: 'Ethereal Orbit', style: 'elegant', pd: 62, bridge: 17, lensHeight: 38, aura: [0.3, 0.9, 0.4] },
    { id: 'f3', name: 'Void Runner', style: 'sporty', pd: 66, bridge: 19, lensHeight: 42, aura: [0.6, 0.1, 0.8] },
  ];
  
  // Calculate recommendation scores
  const recommendations = frameDatabase.map((frame, index) => {
    const score = predictionArray[index % predictionArray.length]; // Use modulo to map predictions to frames
    return {
      ...frame,
      resonance: score,
      match: Math.round(score * 100)
    };
  }).sort((a, b) => b.resonance - a.resonance);
  
  const result = {
    recommendations: recommendations.slice(0, 3),
    faceShape: determineFaceShape(measurements),
    visualAura: [
      predictionArray[0] || 0.5, 
      predictionArray[1] || 0.5, 
      predictionArray[2] || 0.5
    ]
  };
  
  // Cache the result
  cachedRecommendations[cacheKey] = result;
  
  // Limit cache size to prevent memory issues (keep only last 10 unique measurements)
  const cacheKeys = Object.keys(cachedRecommendations);
  if (cacheKeys.length > 10) {
    delete cachedRecommendations[cacheKeys[0]];
  }
  
  return result;
}

// Helper function to determine face shape from measurements
function determineFaceShape(measurements) {
  const { faceWidth, jawlineWidth, foreheadHeight, lensHeight } = measurements;
  
  // Simple heuristic for face shape determination
  const ratio = faceWidth / lensHeight;
  const jawRatio = jawlineWidth / faceWidth;
  
  if (ratio > 0.85 && ratio < 1.15) return 'round';
  if (ratio < 0.8 && jawRatio < 0.8) return 'heart';
  if (ratio > 1.15 && jawRatio > 0.9) return 'square';
  if (ratio < 0.8 && jawRatio > 0.9) return 'diamond';
  return 'oval'; // Default face shape
}

class AIEyewearEngine {
  constructor(videoElement, canvasElement, isIOS = false) {
    this.video = videoElement;
    this.canvas = canvasElement;
    this.isIOS = isIOS; // Flag for platform-specific logic
    this.faceMesh = null;
    this.camera = null;
    this.resonanceModel = null;
    this.frameBuffer = []; // Store frames for dynamic analysis
    this.results = {};
    this.frameDatabase = [
      { id: 'f1', name: 'Quantum Pulse', style: 'futuristic', pd: 65, bridge: 18, lensHeight: 40, aura: [0.8, 0.2, 0.5] },
      { id: 'f2', name: 'Ethereal Orbit', style: 'elegant', pd: 62, bridge: 17, lensHeight: 38, aura: [0.3, 0.9, 0.4] },
      { id: 'f3', name: 'Void Runner', style: 'sporty', pd: 66, bridge: 19, lensHeight: 42, aura: [0.6, 0.1, 0.8] },
    ];
    
    // Cache for static measurements
    this.measurementsCache = {
      lastLandmarksHash: null,
      measurements: null
    };
  }

  async initialize() {
    if (this.isIOS) {
      // iOS: Assume ARKit bridge provides landmark data
      this.setupIOSFeed();
    } else {
      // Web: Use MediaPipe Face Mesh
      this.faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });
      
      // Add explicit initialization
      await this.faceMesh.initialize();
      
      this.faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });
      this.faceMesh.onResults(this.processResults.bind(this));

      this.camera = new Camera(this.video, {
        onFrame: async () => await this.faceMesh.send({ image: this.video }),
        width: 640,
        height: 480,
      });
      await this.camera.start();
    }

    await this.loadResonanceModel();
  }

  setupIOSFeed() {
    // Placeholder for iOS ARKit integration (e.g., via React Native bridge)
    // Assume a native module sends landmark data every frame
    window.addEventListener('arFrameUpdate', (event) => {
      this.processResults({ multiFaceLandmarks: [event.detail.landmarks] });
    });
  }

  async loadResonanceModel() {
    this.resonanceModel = tf.sequential();
    this.resonanceModel.add(tf.layers.dense({ units: 128, inputShape: [474], activation: 'relu' })); // Landmarks + dynamics
    this.resonanceModel.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    this.resonanceModel.add(tf.layers.dense({ units: 8, activation: 'sigmoid' })); // Aura (3) + Shape probs (5)
    this.resonanceModel.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
    console.log('QIFR Model Loaded');
  }

  processResults(results) {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      this.frameBuffer.push(landmarks);
      if (this.frameBuffer.length > 30) this.frameBuffer.shift(); // 1s buffer at 30 FPS

      this.calculateStaticMeasurements(landmarks);
      this.calculateDynamicMetrics();
      this.computeVisualAuraAndShape();
      this.recommendFramesWithResonance();

      this.renderCanvas();
    }
  }

  // Generate a simple hash code for the landmarks array to determine if they've changed
  hashLandmarks(landmarks) {
    // Sample key points that are most relevant for measurements
    const keyPoints = [1, 133, 159, 234, 377, 454, 468, 473];
    const sample = keyPoints.map(i => landmarks[i]).map(p => `${p.x.toFixed(4)},${p.y.toFixed(4)},${(p.z || 0).toFixed(4)}`).join('|');
    let hash = 0;
    for (let i = 0; i < sample.length; i++) {
      const char = sample.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  calculateStaticMeasurements(landmarks) {
    // Check if landmarks have changed enough to recompute measurements
    const landmarksHash = this.hashLandmarks(landmarks);
    
    // If hash matches cached version and we have a cache, return the cached measurements
    if (landmarksHash === this.measurementsCache.lastLandmarksHash && this.measurementsCache.measurements) {
      this.results.measurements = this.measurementsCache.measurements;
      return;
    }
    
    // Calculate measurements only if necessary
    const euclideanDistance = (p1, p2) => Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2 + ((p2.z || 0) - (p1.z || 0)) ** 2);
    const scaleFactor = this.isIOS ? 1 : 100; // iOS uses depth, web needs calibration

    const measurements = {
      pd: euclideanDistance(landmarks[473], landmarks[468]) * scaleFactor,
      bridgeHeight: euclideanDistance(landmarks[1], landmarks[133]) * scaleFactor,
      lensHeight: euclideanDistance(landmarks[468], landmarks[159]) * scaleFactor,
      faceWidth: euclideanDistance(landmarks[234], landmarks[454]) * scaleFactor,
      jawlineWidth: euclideanDistance(landmarks[152], landmarks[377]) * scaleFactor,
      foreheadHeight: euclideanDistance(landmarks[9], landmarks[10]) * scaleFactor,
    };
    
    // Update cache and results
    this.measurementsCache = {
      lastLandmarksHash: landmarksHash,
      measurements: measurements
    };
    
    this.results.measurements = measurements;
  }

  calculateDynamicMetrics() {
    if (this.frameBuffer.length < 2) return;

    let blinkCount = 0;
    let smileSum = 0;
    let tiltSum = 0;
    let energySum = 0;

    for (let i = 1; i < this.frameBuffer.length; i++) {
      const prev = this.frameBuffer[i - 1];
      const curr = this.frameBuffer[i];

      // Blink detection
      const eyeOpening = Math.abs(curr[159].y - curr[145].y);
      const prevEyeOpening = Math.abs(prev[159].y - prev[145].y);
      if (eyeOpening < 0.01 && prevEyeOpening > 0.02) blinkCount++;

      // Smile intensity
      const mouthWidth = Math.abs(curr[61].x - curr[291].x);
      smileSum += Math.min(1, mouthWidth / 0.1); // Normalize to 0-1

      // Head tilt
      const eyeLineAngle = Math.atan2(curr[468].y - curr[473].y, curr[468].x - curr[473].x) * (180 / Math.PI);
      tiltSum += Math.abs(eyeLineAngle);

      // Movement energy
      const noseMovement = euclideanDistance(prev[1], curr[1]);
      energySum += noseMovement;
    }

    const frameCount = this.frameBuffer.length - 1;
    this.results.dynamics = {
      blinkRate: blinkCount / (frameCount / 30), // Blinks per second
      smileIntensity: smileSum / frameCount,
      headTilt: tiltSum / frameCount,
      movementEnergy: Math.min(1, energySum / frameCount / 0.05), // Normalize
    };
  }

  async computeVisualAuraAndShape() {
    const landmarks = this.frameBuffer[this.frameBuffer.length - 1];
    
    // Ensure dynamics exists before accessing its properties
    if (!this.results.dynamics) {
      this.results.dynamics = {
        blinkRate: 0,
        smileIntensity: 0,
        headTilt: 0,
        movementEnergy: 0
      };
    }
    
    const input = [
      ...landmarks.map(p => [p.x, p.y, p.z || 0]).flat(),
      this.results.dynamics.blinkRate,
      this.results.dynamics.smileIntensity,
      this.results.dynamics.headTilt,
      this.results.dynamics.movementEnergy,
    ];
    const inputTensor = tf.tensor2d([input]);

    const prediction = this.resonanceModel.predict(inputTensor);
    const output = Array.from(prediction.dataSync());
    this.results.visualAura = output.slice(0, 3); // [energy, calm, vibrancy]
    this.results.faceShape = {
      oval: output[3],
      round: output[4],
      square: output[5],
      heart: output[6],
      diamond: output[7],
    };
    tf.dispose([inputTensor, prediction]);
  }

  recommendFramesWithResonance() {
    const aura = this.results.visualAura || [0, 0, 0];
    
    // Ensure faceShape exists before accessing it
    if (!this.results.faceShape) {
      this.results.faceShape = {
        oval: 0.2,
        round: 0.2,
        square: 0.2,
        heart: 0.2,
        diamond: 0.2
      };
    }
    
    const shapeProbs = Object.values(this.results.faceShape);

    const resonanceScore = (frame) => {
      const auraDiff = frame.aura.reduce((sum, val, i) => sum + Math.abs(val - aura[i]), 0);
      const fitDiff = Math.abs(frame.pd - this.results.measurements.pd) +
                      Math.abs(frame.bridge - this.results.measurements.bridgeHeight) +
                      Math.abs(frame.lensHeight - this.results.measurements.lensHeight);
      const shapeMatch = Math.max(...shapeProbs) * (frame.style === this.getDominantShape() ? 1 : 0.5);
      return 1 / (1 + auraDiff + fitDiff / 50) * shapeMatch;
    };

    this.results.recommendations = this.frameDatabase
      .map(frame => ({ ...frame, resonance: resonanceScore(frame) }))
      .sort((a, b) => b.resonance - a.resonance)
      .slice(0, 3);
  }

  getDominantShape() {
    if (!this.results.faceShape) return 'oval'; // Default shape if faceShape is undefined
    const shape = Object.entries(this.results.faceShape).reduce((a, b) => a[1] > b[1] ? a : b);
    return shape[0];
  }

  renderCanvas() {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, 640, 480);
    if (this.results.visualAura) {
      const [energy, calm, vibrancy] = this.results.visualAura;
      ctx.fillStyle = `rgba(${energy * 255}, ${calm * 255}, ${vibrancy * 255}, 0.3)`;
      ctx.beginPath();
      ctx.arc(320, 240, 200, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '20px Rajdhani';
      ctx.fillText(`Aura: E:${energy.toFixed(2)}, C:${calm.toFixed(2)}, V:${vibrancy.toFixed(2)}`, 10, 30);
    }
  }

  getResults() {
    return this.results;
  }

  stop() {
    if (!this.isIOS && this.camera) {
      this.camera.stop();
      if (this.faceMesh) {
        this.faceMesh.close();
        this.faceMesh = null;
      }
      this.camera = null;
    }
    
    // Clear any other resources
    this.frameBuffer = [];
    if (this.resonanceModel) {
      tf.dispose(this.resonanceModel);
      this.resonanceModel = null;
    }
  }

  // Web-specific: Process a clip
  async processClip(durationMs = 3000) {
    if (this.isIOS) return this.getResults(); // iOS handles live feed natively
    await new Promise(resolve => setTimeout(resolve, durationMs));
    return this.getResults();
  }
}

export default AIEyewearEngine; 