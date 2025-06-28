
import React from 'react';
import FullscreenToggle from '../components/Dashboard/FullscreenToggle';
import DashboardContent from '../components/Dashboard/DashboardContent';
import '../components/Dashboard/DragDropStyles.css';

const Dashboard: React.FC = () => {
  return (
    <div className="w-full h-screen flex flex-col bg-background">
      {/* Fullscreen Toggle Button */}
      <FullscreenToggle />
      
      {/* Main Dashboard Container - Full height, no extra spacing */}
      <DashboardContent />
    </div>
  );
};

export default Dashboard;
