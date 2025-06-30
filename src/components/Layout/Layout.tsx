
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from '../../pages/Dashboard';
import DatabasePerformance from '../../pages/DatabasePerformance';
import { MockAuthProvider } from '../../contexts/MockAuthContext';

const Layout: React.FC = () => {
  return (
    <MockAuthProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 ml-[280px] overflow-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/db-performance" element={<DatabasePerformance />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </MockAuthProvider>
  );
};

export default Layout;
