import React from 'react';
import { Typography } from '@mui/material';

const FrontPage = () => {
  console.log('FrontPage rendering');
  return (
    <div className="hologram-card max-w-4xl w-full mb-8">
      <Typography variant="h2" className="text-center mb-6 hologram">
        NewVision AI - Precision Eyewear Measurement System
      </Typography>
      <Typography className="text-center mb-8 text-lg">
        NewVision AI is an innovative application that uses augmented reality and artificial intelligence to provide accurate eye measurements and personalized eyewear recommendations.
      </Typography>

      <div className="space-y-8">
        {/* Project Overview */}
        <div>
          <Typography className="section-title">Project Overview</Typography>
          <Typography className="mb-4">
            The NewVision AI system consists of three main components:
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="info-box">
              <Typography variant="h6">iOS Mobile App</Typography>
              <Typography>Uses ARKit for face tracking to capture precise facial measurements.</Typography>
            </div>
            <div className="info-box">
              <Typography variant="h6">Backend API</Typography>
              <Typography>Processes measurements, runs AI analysis, and provides product recommendations.</Typography>
            </div>
            <div className="info-box">
              <Typography variant="h6">Web Dashboard</Typography>
              <Typography>Allows users to view their measurements, analysis results, and shop for recommended eyewear.</Typography>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <Typography className="section-title">Features</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="info-box">
              <Typography>Accurate Eye Measurements: Capture pupillary distance (PD) and vertical alignment with AR technology</Typography>
            </div>
            <div className="info-box">
              <Typography>AI-Powered Analysis: Analyze measurements to detect potential issues and provide insights</Typography>
            </div>
            <div className="info-box">
              <Typography>Personalized Recommendations: Get eyewear recommendations based on facial measurements and style preferences</Typography>
            </div>
            <div className="info-box">
              <Typography>Secure User Accounts: Store measurement history and preferences securely</Typography>
            </div>
            <div className="info-box">
              <Typography>Virtual Try-On: (Planned) Try on glasses virtually using AR</Typography>
            </div>
          </div>
        </div>

        {/* Eyewear Recommendation System */}
        <div>
          <Typography className="section-title">Eyewear Recommendation System</Typography>
          <Typography className="mb-4">
            The NewVision AI system now includes an advanced eyewear recommendation feature that processes 3D facial landmarks from ARKit to provide personalized eyewear suggestions.
          </Typography>
          <Typography className="mb-2 font-semibold">Recommendation Features:</Typography>
          <div className="space-y-2">
            <Typography className="info-box">Accurate Facial Measurements: Extracts key measurements including pupillary distance (PD), face width, nose bridge width, and more from ARKit face tracking data.</Typography>
            <Typography className="info-box">Face Shape Detection: Analyzes facial proportions to determine face shape (oval, round, square, heart, diamond).</Typography>
            <Typography className="info-box">Size Recommendations: Suggests ideal eyewear dimensions (lens width, bridge width, temple length) based on facial measurements.</Typography>
            <Typography className="info-box">Style Recommendations: Recommends frame styles that best complement the user's face shape.</Typography>
            <Typography className="info-box">Product Matching: Matches user measurements with products in the eyewear database for personalized shopping recommendations.</Typography>
          </div>
        </div>

        {/* Project Structure */}
        <div>
          <Typography className="section-title">Project Structure</Typography>
          <Typography className="mb-4">
            This repository contains the complete NewVision AI system with the following components:
          </Typography>
          <div className="space-y-2">
            <Typography className="info-box">NewVisionAI/web/ - React-based web application</Typography>
            <Typography className="info-box">NewVisionAI/backend/ - Python Flask backend and AI engine</Typography>
            <Typography className="info-box">NewVisionAI/iOS/ - Swift-based iOS application</Typography>
            <Typography className="info-box">NewVisionAI/shared/ - Shared libraries and utilities</Typography>
            <Typography className="info-box">NewVisionAI/docs/ - Documentation</Typography>
          </div>
        </div>

        {/* Prerequisites */}
        <div>
          <Typography className="section-title">Prerequisites</Typography>
          <Typography className="mb-4">
            To run this project, you'll need:
          </Typography>
          <div className="space-y-2">
            <Typography className="info-box">Node.js (v14 or later)</Typography>
            <Typography className="info-box">npm (v6 or later)</Typography>
            <Typography className="info-box">Python (v3.8 or later)</Typography>
            <Typography className="info-box">Flask Backend: Main AI processing backend with face analysis capabilities</Typography>
            <Typography className="info-box">Node.js Backend: Supporting backend with additional API endpoints</Typography>
            <Typography className="info-box">iOS FaceTracker: AR-enabled iOS module for facial tracking</Typography>
            <Typography className="info-box">React Frontend: User interface for measurements and try-on features</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontPage; 