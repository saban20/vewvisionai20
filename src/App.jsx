import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './main';
import Home from './components/Home';
import CustomerLogin from './components/CustomerLogin';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Analysis from './components/Analysis';
import FaceAnalysis from './components/FaceAnalysis';

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!isLoggedIn ? <CustomerLogin /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/analysis/:measurementId" element={isLoggedIn ? <Analysis /> : <Navigate to="/login" />} />
        <Route path="/analyze" element={isLoggedIn ? <FaceAnalysis /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App; 