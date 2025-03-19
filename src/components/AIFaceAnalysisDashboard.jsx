import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AIFaceAnalysisDashboard = ({ faceData, onAnalyze }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'measurements', label: 'Measurements' },
    { id: 'recommendations', label: 'Recommendations' },
    { id: 'faceShape', label: 'Face Shape' },
  ];

  // Mock data - replace with actual data from your API
  const mockFaceData = faceData || {
    faceShape: 'Oval',
    confidence: 92,
    metrics: {
      faceWidth: 142,
      faceHeight: 195,
      jawWidth: 128,
      eyeDistance: 68,
      noseLength: 52,
    },
    recommendations: [
      { id: 1, name: 'Classic Round', match: 95, imageUrl: '/eyewear/round-classic.jpg' },
      { id: 2, name: 'Modern Square', match: 87, imageUrl: '/eyewear/square-modern.jpg' },
      { id: 3, name: 'Aviator Silver', match: 82, imageUrl: '/eyewear/aviator-silver.jpg' },
    ],
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-xl p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          AI Face Analysis Dashboard
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-2"
          onClick={onAnalyze}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span>New Scan</span>
        </motion.button>
      </div>

      {/* Confidence meter */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-slate-300">Analysis Confidence</span>
          <span className="text-sm font-medium">{mockFaceData.confidence}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full" 
            style={{ width: `${mockFaceData.confidence}%` }}
          ></div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex space-x-1 mb-6 border-b border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-800 text-blue-400 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-2">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-4">Face Shape Analysis</h3>
              <div className="flex items-center justify-center mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 flex items-center justify-center">
                  <span className="text-xl font-bold">{mockFaceData.faceShape}</span>
                </div>
              </div>
              <p className="text-sm text-slate-300 text-center">
                Your face shape is {mockFaceData.faceShape.toLowerCase()}, which is characterized by balanced proportions 
                and a gradual taper from forehead to chin.
              </p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-4">Key Metrics</h3>
              <div className="space-y-4">
                {Object.entries(mockFaceData.metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-slate-300">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
                    <span className="font-medium">{value} mm</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockFaceData.recommendations.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.1)' }}
                className="bg-slate-800/50 rounded-lg overflow-hidden"
              >
                <div className="h-48 bg-slate-700 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">{item.name}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-blue-400">{item.match}% match</span>
                  </div>
                  <button className="w-full py-2 mt-2 text-sm bg-blue-600 hover:bg-blue-700 rounded">
                    Try On
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'measurements' && (
          <div className="bg-slate-800/50 p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-6">Detailed Measurements</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6">
              {Object.entries(mockFaceData.metrics).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-700 mb-2 flex items-center justify-center">
                    <span className="text-xl font-medium">{value}</span>
                  </div>
                  <span className="text-sm text-slate-300">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faceShape' && (
          <div className="bg-slate-800/50 p-6 rounded-xl">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-4">Your Face Shape</h3>
                <p className="text-slate-300 mb-4">
                  Your face analysis shows you have an {mockFaceData.faceShape.toLowerCase()} face shape. This shape is characterized by:
                </p>
                <ul className="list-disc pl-5 text-slate-300 space-y-2">
                  <li>Balanced proportions across the face</li>
                  <li>A slightly curved jawline</li>
                  <li>Cheekbones that are about the same width as the forehead</li>
                  <li>A rounded chin</li>
                </ul>
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Recommended Styles</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs">Aviator</span>
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs">Cat Eye</span>
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs">Round</span>
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs">Rectangle</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-600/30 flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-700/20 flex items-center justify-center text-center">
                    <span className="text-xl font-bold">{mockFaceData.faceShape}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIFaceAnalysisDashboard; 