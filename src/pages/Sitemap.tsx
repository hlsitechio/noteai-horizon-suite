
import React from 'react';
import { Link } from 'react-router-dom';
import PageAICopilot from '../components/Global/PageAICopilot';

const Sitemap: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Sitemap</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Public Pages</h2>
            <ul className="space-y-2">
              <li><Link to="/" className="text-primary hover:underline">Home</Link></li>
              <li><Link to="/landing" className="text-primary hover:underline">Landing</Link></li>
              <li><Link to="/login" className="text-primary hover:underline">Login</Link></li>
              <li><Link to="/register" className="text-primary hover:underline">Register</Link></li>
              <li><Link to="/reset-password" className="text-primary hover:underline">Reset Password</Link></li>
              <li><Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-primary hover:underline">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-primary hover:underline">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">App Pages</h2>
            <ul className="space-y-2">
              <li><Link to="/app/dashboard" className="text-primary hover:underline">Dashboard</Link></li>
              <li><Link to="/app/notes" className="text-primary hover:underline">Notes</Link></li>
              <li><Link to="/app/editor" className="text-primary hover:underline">Editor</Link></li>
              <li><Link to="/app/chat" className="text-primary hover:underline">Chat</Link></li>
              <li><Link to="/app/calendar" className="text-primary hover:underline">Calendar</Link></li>
              <li><Link to="/app/projects" className="text-primary hover:underline">Projects</Link></li>
              <li><Link to="/app/settings" className="text-primary hover:underline">Settings</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <PageAICopilot pageContext="sitemap" />
    </div>
  );
};

export default Sitemap;
