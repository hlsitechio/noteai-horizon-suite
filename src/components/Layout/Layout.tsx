
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from '../../pages/Dashboard';
import DatabasePerformance from '../../pages/DatabasePerformance';
import Notes from '../../pages/Notes';
import Editor from '../../pages/Editor';
import Settings from '../../pages/Settings';
import Analytics from '../../pages/Analytics';
import Chat from '../../pages/Chat';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-[280px] overflow-auto">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:noteId" element={<Editor />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/db-performance" element={<DatabasePerformance />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Layout;
