
import React from 'react';
import FullscreenToggle from '../components/Dashboard/FullscreenToggle';
import DashboardContent from '../components/Dashboard/DashboardContent';
import '../components/Dashboard/DragDropStyles.css';

const Dashboard: React.FC = () => {
  return (
    <div className="w-full h-screen max-h-screen flex flex-col bg-background overflow-hidden">
      {/* Fullscreen Toggle Button */}
      <FullscreenToggle />
      
      {/* Main Dashboard Container - Exact 1920x1080 fit */}
      <DashboardContent />
    </div>
  );
};

export default Dashboard;
