
import React from 'react';
import { Link } from 'react-router-dom';
import PageAICopilot from '../components/Global/PageAICopilot';

const Sitemap: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Full screen background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Content section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 z-10">
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              Sitemap
            </span>
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card/20 backdrop-blur-xl rounded-2xl p-6 border border-border/10">
              <h2 className="text-2xl font-semibold mb-4 text-cyan-300">Public Pages</h2>
              <ul className="space-y-2">
                <li><Link to="/" className="text-primary hover:underline hover:text-cyan-300 transition-colors">Home</Link></li>
                <li><Link to="/landing" className="text-primary hover:underline hover:text-cyan-300 transition-colors">Landing</Link></li>
                <li><Link to="/login" className="text-primary hover:underline hover:text-cyan-300 transition-colors">Login</Link></li>
                <li><Link to="/register" className="text-primary hover:underline hover:text-cyan-300 transition-colors">Register</Link></li>
                <li><Link to="/reset-password" className="text-primary hover:underline hover:text-cyan-300 transition-colors">Reset Password</Link></li>
                <li><Link to="/privacy" className="text-primary hover:underline hover:text-cyan-300 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-primary hover:underline hover:text-cyan-300 transition-colors">Terms of Service</Link></li>
                <li><Link to="/contact" className="text-primary hover:underline hover:text-cyan-300 transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div className="bg-card/20 backdrop-blur-xl rounded-2xl p-6 border border-border/10">
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">App Pages</h2>
              <ul className="space-y-2">
                <li><Link to="/app/dashboard" className="text-primary hover:underline hover:text-purple-300 transition-colors">Dashboard</Link></li>
                <li><Link to="/app/notes" className="text-primary hover:underline hover:text-purple-300 transition-colors">Notes</Link></li>
                <li><Link to="/app/editor" className="text-primary hover:underline hover:text-purple-300 transition-colors">Editor</Link></li>
                <li><Link to="/app/chat" className="text-primary hover:underline hover:text-purple-300 transition-colors">Chat</Link></li>
                <li><Link to="/app/calendar" className="text-primary hover:underline hover:text-purple-300 transition-colors">Calendar</Link></li>
                <li><Link to="/app/projects" className="text-primary hover:underline hover:text-purple-300 transition-colors">Projects</Link></li>
                <li><Link to="/app/settings" className="text-primary hover:underline hover:text-purple-300 transition-colors">Settings</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <PageAICopilot pageContext="sitemap" />
    </div>
  );
};

export default Sitemap;
