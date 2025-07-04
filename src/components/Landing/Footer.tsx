
import React from 'react';
import { Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-[100] py-20 px-4 border-t border-white/10 bg-gradient-to-br from-slate-900/50 to-black">
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
              <li><button type="button" onClick={() => { console.log('Features clicked'); window.location.href = '/features'; }} className="text-left hover:text-cyan-400 transition-colors cursor-pointer">Features</button></li>
              <li><button type="button" onClick={() => { console.log('Pricing clicked'); window.location.href = '/pricing'; }} className="text-left hover:text-cyan-400 transition-colors cursor-pointer">Pricing</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li><button type="button" onClick={() => { console.log('About clicked'); window.location.href = '/about'; }} className="text-left hover:text-cyan-400 transition-colors cursor-pointer">About</button></li>
              <li><button type="button" onClick={() => { console.log('Contact clicked'); window.location.href = '/contact'; }} className="text-left hover:text-cyan-400 transition-colors cursor-pointer">Contact</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Legal</h4>
            <ul className="space-y-3 text-gray-400">
              <li><button type="button" onClick={() => { console.log('Privacy clicked'); window.location.href = '/privacy'; }} className="text-left hover:text-cyan-400 transition-colors cursor-pointer">Privacy</button></li>
              <li><button type="button" onClick={() => { console.log('Terms clicked'); window.location.href = '/terms'; }} className="text-left hover:text-cyan-400 transition-colors cursor-pointer">Terms</button></li>
              <li><button type="button" onClick={() => { console.log('Sitemap clicked'); window.location.href = '/sitemap'; }} className="text-left hover:text-cyan-400 transition-colors cursor-pointer">Sitemap</button></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">&copy; 2024 OnlineNote AI. All rights reserved. Crafted with innovation.</p>
          <button 
            type="button"
            onClick={() => { console.log('Get Started clicked'); window.location.href = '/register'; }}
            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            Get Started Free
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
