
import React from 'react';
import { Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-20 px-4 border-t border-white/10 bg-gradient-to-br from-slate-900/50 to-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl blur-xl opacity-30 animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                OnlineNote AI
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Revolutionizing productivity with next-generation AI-powered note-taking technology.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Product</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
              <li><a href="/coming-soon" className="hover:text-cyan-400 transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="/coming-soon" className="hover:text-cyan-400 transition-colors">About</a></li>
              <li><a href="/coming-soon" className="hover:text-cyan-400 transition-colors">Careers</a></li>
              <li><a href="/contact" className="hover:text-cyan-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Legal</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</a></li>
              <li><a href="/terms" className="hover:text-cyan-400 transition-colors">Terms</a></li>
              <li><a href="/sitemap" className="hover:text-cyan-400 transition-colors">Sitemap</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400">&copy; 2024 OnlineNote AI. All rights reserved. Crafted with innovation.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
