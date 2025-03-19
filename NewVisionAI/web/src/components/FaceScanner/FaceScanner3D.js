import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera, Environment } from '@react-three/drei';
import { Box, Typography, Button, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Webcam from 'react-webcam';
import * as THREE from 'three';
import aiService from '../../utils/aiService';
import { theme } from '../../theme';

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
  const cancelTokenRef = useRef(null);
  
  // Add cleanup effect to dispose textures
  useEffect(() => {
    // Cleanup function to dispose textures when component unmounts
    // or when a new texture is set
    return () => {
      if (imageTexture) {
        imageTexture.dispose();
      }
    };
  }, [imageTexture]);
  
  // Add effect to cancel any pending requests when component unmounts
  useEffect(() => {
    return () => {
      // Cancel any pending requests when component unmounts
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }
    };
  }, []);
  
  const handleCaptureFromWebcam = async () => {
    if (webcamRef.current) {
      try {
        // Cancel any previous request
        if (cancelTokenRef.current) {
          cancelTokenRef.current.cancel();
        }
        
        // Create a new cancelable request
        cancelTokenRef.current = aiService.createCancelableRequest();
        
        setIsProcessing(true);
        setError(null);
        
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) throw new Error('Failed to capture image from webcam');
        
        // Create texture for 3D model
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
        
        // Process face with backend AI service instead of client-side TensorFlow
        if (onScanComplete) {
          // Remove the base64 prefix for the API call
          const base64Image = imageSrc.split(',')[1];
          
          // Use the AI service to process the face with cancelation support
          const scanResults = await aiService.processFace(
            base64Image, 
            { cancelToken: cancelTokenRef.current.cancelToken }
          );
          
          // Check if request was canceled
          if (scanResults && scanResults.canceled) {
            return;
          }
          
          // Pass the results to the callback
          onScanComplete(scanResults);
        }
      } catch (err) {
        console.error('Error capturing from webcam:', err);
        setError('Failed to process face: ' + (err.message || 'Unknown error'));
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Cancel any previous request
        if (cancelTokenRef.current) {
          cancelTokenRef.current.cancel();
        }
        
        // Create a new cancelable request
        cancelTokenRef.current = aiService.createCancelableRequest();
        
        setIsProcessing(true);
        setError(null);
        
        const reader = new FileReader();
        reader.onload = async (e) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = async () => {
            const texture = new THREE.TextureLoader().load(img.src);
            setImageTexture(texture);
            
            // Process face with backend AI service instead of client-side TensorFlow
            if (onScanComplete) {
              try {
                // Remove the base64 prefix for the API call
                const base64Image = e.target.result.split(',')[1];
                
                // Use the AI service to process the face with cancelation support
                const scanResults = await aiService.processFace(
                  base64Image,
                  { cancelToken: cancelTokenRef.current.cancelToken }
                );
                
                // Check if request was canceled
                if (scanResults && scanResults.canceled) {
                  setIsProcessing(false);
                  return;
                }
                
                // Pass the results to the callback
                onScanComplete(scanResults);
              } catch (err) {
                console.error('Error processing face:', err);
                setError('Failed to process face: ' + (err.message || 'Unknown error'));
              }
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
    <Card sx={{ 
      backgroundColor: theme.colors.cardDark, 
      color: theme.colors.lightText, 
      p: theme.spacing.md,
      borderRadius: theme.borderRadius.md
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: theme.spacing.md }}>
          <CameraAltIcon sx={{ fontSize: 30, color: theme.colors.primary, mr: theme.spacing.sm }} />
          <Typography variant="h5" sx={{ fontWeight: theme.typography.fontWeights.semiBold }}>
            Interactive 3D Face Scanner
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: theme.spacing.md }}>
          Upload your photo or use your webcam to create a 3D model of your face for virtual eyewear try-on.
        </Typography>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: theme.spacing.md }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: 'flex', gap: theme.spacing.md, mb: theme.spacing.md }}>
          <Button
            variant="contained"
            startIcon={<CameraAltIcon />}
            onClick={() => setIsCameraActive(!isCameraActive)}
            disabled={isProcessing}
            sx={{ backgroundColor: theme.colors.primary }}
          >
            {isCameraActive ? 'Close Camera' : 'Use Webcam'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileUploadIcon />}
            onClick={() => fileInputRef.current.click()}
            disabled={isProcessing}
            sx={{ color: theme.colors.lightText, borderColor: theme.colors.lightText }}
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
          <Box sx={{ position: 'relative', mb: theme.spacing.md }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
              height="auto"
              style={{ borderRadius: theme.borderRadius.md }}
            />
            <Button
              variant="contained"
              onClick={handleCaptureFromWebcam}
              disabled={isProcessing}
              sx={{ 
                position: 'absolute', 
                bottom: theme.spacing.sm, 
                left: '50%', 
                transform: 'translateX(-50%)', 
                backgroundColor: theme.colors.primary 
              }}
            >
              {isProcessing ? <CircularProgress size={24} /> : 'Capture'}
            </Button>
          </Box>
        )}
        <Box sx={{ 
          height: 400, 
          backgroundColor: theme.colors.cardDark, 
          borderRadius: theme.borderRadius.md, 
          mb: theme.spacing.md 
        }}>
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
        <Typography variant="body2" sx={{ color: theme.colors.mutedText }}>
          Rotate, zoom, and view the 3D model from different angles by dragging and scrolling.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FaceScanner3D; 