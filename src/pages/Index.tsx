
import React from 'react';
import { Navigate } from 'react-router-dom';

// This component now just redirects to the main app
// All routing logic has been moved to App.tsx
const Index = () => {
  return <Navigate to="/app/dashboard" replace />;
};

export default Index;
