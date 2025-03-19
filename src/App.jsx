import React, { useContext, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './main';
import Home from './components/Home';
import CustomerLogin from './components/CustomerLogin';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Analysis from './components/Analysis';
import VisionAILanding from './components/VisionAILanding';
import FaceScanVisualizer from './components/FaceScanVisualizer';
import AIFaceAnalysisDashboard from './components/AIFaceAnalysisDashboard';
import ThemeToggle from './components/ThemeToggle';
import AdminDashboard from './components/admin/AdminDashboard';

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  
  const handleScanComplete = () => {
    setIsScanning(false);
    setScanCompleted(true);
  };
  
  const startNewScan = () => {
    setIsScanning(true);
    setScanCompleted(false);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <Routes>
        <Route path="/" element={<VisionAILanding />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/login"
          element={!isLoggedIn ? <CustomerLogin /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!isLoggedIn ? <Register /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/analysis/:measurementId"
          element={isLoggedIn ? <Analysis /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route 
          path="/scan" 
          element={
            <div className="py-10 w-full">
              <FaceScanVisualizer 
                isScanning={isScanning} 
                onScanComplete={handleScanComplete} 
              />
              {scanCompleted && (
                <div className="mt-10">
                  <AIFaceAnalysisDashboard 
                    onAnalyze={startNewScan}
                  />
                </div>
              )}
              {!isScanning && !scanCompleted && (
                <div className="max-w-xl mx-auto mt-8 text-center">
                  <button 
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white"
                    onClick={startNewScan}
                  >
                    Start Face Scan
                  </button>
                </div>
              )}
            </div>
          } 
        />
        <Route 
          path="/analyze" 
          element={
            <div className="py-10 w-full">
              <AIFaceAnalysisDashboard 
                onAnalyze={startNewScan}
              />
            </div>
          } 
        />
      </Routes>
    </div>
  );
};

export default App; 