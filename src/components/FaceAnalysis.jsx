import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

const FaceAnalysis = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState({
    pd: null, // Pupillary Distance (mm)
    symmetry: null, // Symmetry score (0-1)
    faceShape: null, // Estimated face shape
  });
  const [calibrated, setCalibrated] = useState(false);
  const [referenceWidth, setReferenceWidth] = useState(null); // For PD calibration

  // Load MediaPipe FaceMesh model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend('webgl');
        const loadedModel = await faceLandmarksDetection.load(
          faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
          { maxFaces: 1 }
        );
        setModel(loadedModel);
        setLoading(false);
      } catch (err) {
        setError('Failed to load FaceMesh model.');
        setLoading(false);
      }
    };
    loadModel();
  }, []);

  // Start webcam
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsAnalyzing(true);
          analyzeFace();
        };
      }
    } catch (err) {
      setError('Failed to access webcam.');
    }
  };

  // Stop webcam
  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsAnalyzing(false);
      setMetrics({ pd: null, symmetry: null, faceShape: null });
    }
  };

  // Calibrate PD using a reference object (e.g., credit card width = 85.6mm)
  const calibrate = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Placeholder: Assume user holds a credit card horizontally across forehead
    // Measure pixel width of card (manual input or detect edges in future)
    const cardPixelWidth = 200; // Example; replace with real detection
    const realCardWidthMm = 85.6; // Standard credit card width
    setReferenceWidth(cardPixelWidth / realCardWidthMm); // Pixels per mm
    setCalibrated(true);

    ctx.fillStyle = '#00FF00';
    ctx.fillRect(10, 10, 50, 20); // Visual feedback for calibration
    setTimeout(() => ctx.clearRect(10, 10, 50, 20), 1000);
  };

  // Analyze face and calculate metrics
  const analyzeFace = async () => {
    if (!model || !videoRef.current || !canvasRef.current || !isAnalyzing) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let lastFrameTime = 0;
    const fps = 30; // Throttle to 30 FPS

    const detect = async (timestamp) => {
      if (timestamp - lastFrameTime < 1000 / fps) {
        if (isAnalyzing) requestAnimationFrame(detect);
        return;
      }
      lastFrameTime = timestamp;

      const predictions = await model.estimateFaces({ input: video });
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (predictions.length > 0) {
        const landmarks = predictions[0].scaledMesh;

        // Draw landmarks
        landmarks.forEach(([x, y]) => {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, 2 * Math.PI);
          ctx.fillStyle = '#00D8FF';
          ctx.fill();
        });

        // Calculate Pupillary Distance
        const leftEye = landmarks[33]; // Left pupil
        const rightEye = landmarks[263]; // Right pupil
        const pixelDistance = Math.sqrt(
          Math.pow(rightEye[0] - leftEye[0], 2) + Math.pow(rightEye[1] - leftEye[1], 2)
        );
        const pdMm = calibrated && referenceWidth ? (pixelDistance / referenceWidth).toFixed(1) : pixelDistance.toFixed(1);
        const pdUnit = calibrated ? 'mm' : 'px';

        // Calculate Symmetry (simplified: compare left-right eye distances)
        const leftEyeOuter = landmarks[130];
        const rightEyeOuter = landmarks[359];
        const leftDist = Math.abs(leftEye[1] - leftEyeOuter[1]);
        const rightDist = Math.abs(rightEye[1] - rightEyeOuter[1]);
        const symmetryScore = Math.min(leftDist, rightDist) / Math.max(leftDist, rightDist);

        // Estimate Face Shape (simplified: width-to-height ratio)
        const jawLeft = landmarks[234];
        const jawRight = landmarks[454];
        const forehead = landmarks[10];
        const chin = landmarks[152];
        const faceWidth = Math.abs(jawRight[0] - jawLeft[0]);
        const faceHeight = Math.abs(chin[1] - forehead[1]);
        const ratio = faceWidth / faceHeight;
        const faceShape = ratio > 1.1 ? 'Oval' : ratio < 0.9 ? 'Round' : 'Square';

        setMetrics({
          pd: `${pdMm} ${pdUnit}`,
          symmetry: symmetryScore.toFixed(2),
          faceShape,
        });
      }

      if (isAnalyzing) requestAnimationFrame(detect);
    };

    requestAnimationFrame(detect);
  };

  // Sync canvas size
  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      const resizeCanvas = () => {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
      };
      videoRef.current.addEventListener('loadedmetadata', resizeCanvas);
      return () => videoRef.current?.removeEventListener('loadedmetadata', resizeCanvas);
    }
  }, [isAnalyzing]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress className="hologram" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
      <Typography variant="h4" className="hologram" sx={{ mb: 4 }}>
        Cutting-Edge Face Analysis
      </Typography>
      <Box sx={{ position: 'relative', mb: 4 }}>
        <video
          ref={videoRef}
          style={{ width: '100%', maxWidth: '640px', borderRadius: '8px' }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      </Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        {metrics.pd && (
          <Typography variant="h6">
            Pupillary Distance: {metrics.pd}
          </Typography>
        )}
        {metrics.symmetry && (
          <Typography variant="h6">
            Symmetry Score: {metrics.symmetry} (0-1)
          </Typography>
        )}
        {metrics.faceShape && (
          <Typography variant="h6">
            Face Shape: {metrics.faceShape}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          onClick={startVideo}
          disabled={isAnalyzing}
          className="hologram-button"
        >
          Start Analysis
        </Button>
        <Button
          onClick={calibrate}
          disabled={!isAnalyzing || calibrated}
          className="hologram-button"
        >
          Calibrate PD
        </Button>
        <Button
          onClick={stopVideo}
          disabled={!isAnalyzing}
          className="hologram-button"
        >
          Stop Analysis
        </Button>
      </Box>
      {!calibrated && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          For accurate PD in mm, calibrate by holding a credit card horizontally across your forehead.
        </Typography>
      )}
    </Box>
  );
};

export default FaceAnalysis; 