import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Environment } from '@react-three/drei';
import { Box, Typography, Button, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as THREE from 'three';

const FaceModel = ({ imageTexture }) => {
  const { scene } = useGLTF('/models/face.glb');
  const meshRef = useRef();
  
  useEffect(() => {
    if (imageTexture && meshRef.current) {
      const faceMesh = scene.children.find(child => child.isMesh && child.name === 'Face');
      if (faceMesh) {
        faceMesh.material.map = imageTexture;
        faceMesh.material.needsUpdate = true;
      }
    }
  }, [imageTexture, scene]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return <primitive object={scene} ref={meshRef} />;
};

const CameraControls = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
    }
  }, []);

  return <OrbitControls ref={controlsRef} enableDamping={true} dampingFactor={0.05} />;
};

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <CircularProgress />
  </Box>
);

const FaceScanner3D = ({ onScanComplete }) => {
  const [imageTexture, setImageTexture] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        await tf.loadLayersModel('/models/facemesh/model.json');
      } catch (err) {
        console.error('Error loading TensorFlow.js model:', err);
        setError('Failed to load face detection model. Please try again later.');
      }
    };
    
    loadModel();
    return () => {
      if (imageTexture) {
        imageTexture.dispose();
      }
    };
  }, []);

  const handleCaptureFromWebcam = async () => {
    if (webcamRef.current) {
      try {
        setIsProcessing(true);
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) throw new Error('Failed to capture image from webcam');
        
        const img = new Image();
        img.src = imageSrc;
        
        await new Promise((resolve) => {
          img.onload = () => {
            const texture = new THREE.TextureLoader().load(img.src);
            setImageTexture(texture);
            setIsCameraActive(false);
            resolve();
          };
        });
        
        // If onScanComplete is provided, prepare the scan results
        if (onScanComplete) {
          // Simulated scan results
          onScanComplete({
            measurements: {
              pupillaryDistance: Math.floor(Math.random() * 10) + 60, // 60-69mm
              bridgeWidth: Math.floor(Math.random() * 5) + 15, // 15-19mm
              templeWidth: Math.floor(Math.random() * 20) + 130 // 130-149mm
            },
            faceShape: ['oval', 'round', 'square', 'heart', 'diamond'][Math.floor(Math.random() * 5)],
            faceShapeConfidence: 0.85,
            recommendedStyle: ['classic', 'modern', 'aviator', 'circular'][Math.floor(Math.random() * 4)],
            frameRecommendations: ['Ray-Ban Wayfarer', 'Warby Parker Harper', 'Oakley Holbrook'],
            scanQuality: 0.9,
            timestamp: Date.now()
          });
        }
      } catch (err) {
        console.error('Error capturing from webcam:', err);
        setError('Failed to capture image from webcam. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
            const texture = new THREE.TextureLoader().load(img.src);
            setImageTexture(texture);
            
            // If onScanComplete is provided, prepare the scan results
            if (onScanComplete) {
              // Simulated scan results
              onScanComplete({
                measurements: {
                  pupillaryDistance: Math.floor(Math.random() * 10) + 60, // 60-69mm
                  bridgeWidth: Math.floor(Math.random() * 5) + 15, // 15-19mm
                  templeWidth: Math.floor(Math.random() * 20) + 130 // 130-149mm
                },
                faceShape: ['oval', 'round', 'square', 'heart', 'diamond'][Math.floor(Math.random() * 5)],
                faceShapeConfidence: 0.8,
                recommendedStyle: ['classic', 'modern', 'aviator', 'circular'][Math.floor(Math.random() * 4)],
                frameRecommendations: ['Ray-Ban Wayfarer', 'Warby Parker Harper', 'Oakley Holbrook'],
                scanQuality: 0.85,
                timestamp: Date.now()
              });
            }
            
            setIsProcessing(false);
          };
        };
        reader.onerror = () => {
          setError('Failed to read the image file. Please try another file.');
          setIsProcessing(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('Error handling file upload:', err);
        setError('Failed to process the image file. Please try another file.');
        setIsProcessing(false);
      }
    }
  };

  return (
    <Card sx={{ backgroundColor: '#1A1A1A', color: '#FFFFFF', p: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CameraAltIcon sx={{ fontSize: 30, color: '#CC0000', mr: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Interactive 3D Face Scanner
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Upload your photo or use your webcam to create a 3D model of your face for virtual eyewear try-on.
        </Typography>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<CameraAltIcon />}
            onClick={() => setIsCameraActive(!isCameraActive)}
            disabled={isProcessing}
            sx={{ backgroundColor: '#CC0000' }}
          >
            {isCameraActive ? 'Close Camera' : 'Use Webcam'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileUploadIcon />}
            onClick={() => fileInputRef.current.click()}
            disabled={isProcessing}
            sx={{ color: '#FFFFFF', borderColor: '#FFFFFF' }}
          >
            Upload Photo
          </Button>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </Box>
        {isCameraActive && (
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
              height="auto"
              style={{ borderRadius: '8px' }}
            />
            <Button
              variant="contained"
              onClick={handleCaptureFromWebcam}
              disabled={isProcessing}
              sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#CC0000' }}
            >
              {isProcessing ? <CircularProgress size={24} /> : 'Capture'}
            </Button>
          </Box>
        )}
        <Box sx={{ height: 400, backgroundColor: '#1A1A1A', borderRadius: '8px', mb: 2 }}>
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={<LoadingFallback />}>
              <FaceModel imageTexture={imageTexture} />
            </Suspense>
            <CameraControls />
            <Environment preset="studio" />
          </Canvas>
        </Box>
        <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
          Rotate, zoom, and view the 3D model from different angles by dragging and scrolling.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FaceScanner3D; 