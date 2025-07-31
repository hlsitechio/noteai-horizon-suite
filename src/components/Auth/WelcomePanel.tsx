
import React from 'react';
import { FileText, Sparkles, Zap } from 'lucide-react';

const WelcomePanel: React.FC = () => {
  return (
    <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
        <div className="max-w-md">
          {/* Logo/Icon */}
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Online Note AI</h1>
          </div>
          
          {/* Welcome Text */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Welcome to the Future of Note-Taking
              </h2>
              <p className="text-xl opacity-90 leading-relaxed">
                Transform your thoughts into organized, intelligent notes with the power of AI.
              </p>
            </div>
            
            {/* Features */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-lg">AI-powered organization</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-lg">Lightning-fast search</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-lg">Rich text editing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePanel;
