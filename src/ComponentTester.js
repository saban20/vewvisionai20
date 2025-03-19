import React, { useState } from 'react';
import { Box, Typography, Tab, Tabs, Button } from '@mui/material';
import { ComponentTestSuite } from './utils/TestUtils';

// Import components to test
import ComponentLoader from './components/eyewear/ComponentLoader';
import FaceShapeInfo from './components/eyewear/FaceShapeInfo';
import ProductFilters from './components/eyewear/ProductFilters';
import ProductGrid from './components/eyewear/ProductGrid';
import ProductRecommendations from './components/eyewear/ProductRecommendations';
import MeasurementInstructions from './components/FaceScanner/measurement/MeasurementInstructions';
import MeasurementResults from './components/FaceScanner/measurement/MeasurementResults';
import HelpDialog from './components/FaceScanner/measurement/HelpDialog';
import RewardSystem from './components/FaceScanner/measurement/RewardSystem';
import ThemeToggle from './components/ThemeToggle';

// Mock data for testing
const mockProducts = [
  {
    id: '1',
    name: 'Premium Sunglasses',
    price: 129.99,
    image: 'https://via.placeholder.com/300x200',
    colors: ['Black', 'Tortoise', 'Red'],
    rating: 4.5,
    reviews: 28,
    category: 'Sunglasses',
    brand: 'RayBan',
    faceShapeMatch: 'oval',
    matchScore: 0.92
  },
  {
    id: '2',
    name: 'Classic Frames',
    price: 159.99,
    image: 'https://via.placeholder.com/300x200',
    colors: ['Black', 'Blue', 'Gray'],
    rating: 4.2,
    reviews: 12,
    category: 'Eyeglasses',
    brand: 'Oakley',
    faceShapeMatch: 'square',
    matchScore: 0.85
  },
  {
    id: '3',
    name: 'Modern Aviators',
    price: 179.99,
    image: 'https://via.placeholder.com/300x200',
    colors: ['Gold', 'Silver', 'Black'],
    rating: 4.8,
    reviews: 42,
    category: 'Sunglasses',
    brand: 'Gucci',
    faceShapeMatch: 'heart',
    matchScore: 0.78
  }
];

const mockMeasurements = {
  faceBreadth: 145, // mm
  templeWidth: 134, // mm
  browToNose: 42, // mm
  noseToMouth: 38, // mm
  eyeSize: 'medium',
  ipd: 62, // mm
  noseBridge: 'medium',
  faceShape: 'oval'
};

const ComponentTester = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h3" gutterBottom>Component Tester</Typography>
      <Typography variant="subtitle1" gutterBottom>
        Test components with light/dark themes and responsive layouts
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="component tabs">
          <Tab label="ComponentLoader" />
          <Tab label="FaceShapeInfo" />
          <Tab label="ProductFilters" />
          <Tab label="ProductGrid" />
          <Tab label="ProductRecommendations" />
          <Tab label="MeasurementInstructions" />
          <Tab label="MeasurementResults" />
          <Tab label="ThemeToggle" />
          <Tab label="Dialog Components" />
        </Tabs>
      </Box>
      
      {currentTab === 0 && (
        <ComponentTestSuite title="ComponentLoader Test">
          <ComponentLoader darkMode={false} />
        </ComponentTestSuite>
      )}
      
      {currentTab === 1 && (
        <ComponentTestSuite title="FaceShapeInfo Test">
          <FaceShapeInfo userFaceShape="oval" darkMode={false} />
        </ComponentTestSuite>
      )}
      
      {currentTab === 2 && (
        <ComponentTestSuite title="ProductFilters Test">
          <ProductFilters 
            categories={['Sunglasses', 'Eyeglasses', 'Sports']} 
            brands={['RayBan', 'Oakley', 'Gucci', 'Prada']} 
            priceRange={[20, 500]} 
            darkMode={false}
            onFilterChange={() => {}}
          />
        </ComponentTestSuite>
      )}
      
      {currentTab === 3 && (
        <ComponentTestSuite title="ProductGrid Test">
          <ProductGrid 
            products={mockProducts} 
            loading={false} 
            darkMode={false}
            onProductSelect={() => {}}
          />
        </ComponentTestSuite>
      )}
      
      {currentTab === 4 && (
        <ComponentTestSuite title="ProductRecommendations Test">
          <ProductRecommendations 
            recommendations={mockProducts} 
            loading={false} 
            faceShape="oval" 
            measurements={mockMeasurements} 
            darkMode={false}
          />
        </ComponentTestSuite>
      )}
      
      {currentTab === 5 && (
        <ComponentTestSuite title="MeasurementInstructions Test">
          <MeasurementInstructions darkMode={false} />
        </ComponentTestSuite>
      )}
      
      {currentTab === 6 && (
        <ComponentTestSuite title="MeasurementResults Test">
          <MeasurementResults measurements={mockMeasurements} darkMode={false} />
        </ComponentTestSuite>
      )}
      
      {currentTab === 7 && (
        <ComponentTestSuite title="ThemeToggle Test">
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <ThemeToggle size="large" />
          </Box>
        </ComponentTestSuite>
      )}
      
      {currentTab === 8 && (
        <ComponentTestSuite title="Dialog Components Test">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={() => setHelpDialogOpen(true)}
            >
              Open Help Dialog
            </Button>
            
            <Button 
              variant="contained" 
              onClick={() => setRewardDialogOpen(true)}
            >
              Open Reward System Dialog
            </Button>
            
            <HelpDialog 
              open={helpDialogOpen} 
              onClose={() => setHelpDialogOpen(false)} 
              darkMode={false}
            />
            
            <RewardSystem 
              open={rewardDialogOpen} 
              onClose={() => setRewardDialogOpen(false)} 
              darkMode={false}
              achievements={[
                { id: 1, title: 'First Scan', description: 'Completed your first face scan', unlocked: true },
                { id: 2, title: 'Precision Maestro', description: 'Achieve 99% measurement accuracy', unlocked: false }
              ]}
              points={120}
            />
          </Box>
        </ComponentTestSuite>
      )}
    </Box>
  );
};

export default ComponentTester; 