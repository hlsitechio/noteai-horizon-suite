import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
const Footer = () => {
  return <footer className="relative z-[100] py-20 px-4 border-t border-white/10 bg-gradient-to-br from-slate-900/50 to-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
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
              <li><Link to="/features" className="text-left hover:text-cyan-400 transition-colors cursor-pointer">Features</Link></li>
              <li><Link to="/pricing" className="text-left hover:text-cyan-400 transition-colors cursor-pointer">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/about" className="text-left hover:text-cyan-400 transition-colors cursor-pointer">About</Link></li>
              <li><Link to="/contact" className="text-left hover:text-cyan-400 transition-colors cursor-pointer">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Legal</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/privacy" className="text-left hover:text-cyan-400 transition-colors cursor-pointer">Privacy</Link></li>
              <li><Link to="/terms" className="text-left hover:text-cyan-400 transition-colors cursor-pointer">Terms</Link></li>
              <li><Link to="/sitemap" className="text-left hover:text-cyan-400 transition-colors cursor-pointer">Sitemap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Connect</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="https://x.com/Online_Note_AI" target="_blank" rel="noopener noreferrer" className="text-left hover:text-cyan-400 transition-colors cursor-pointer">X (Twitter)</a></li>
              <li><a href="https://www.instagram.com/onlinenoteai/" target="_blank" rel="noopener noreferrer" className="text-left hover:text-cyan-400 transition-colors cursor-pointer">Instagram</a></li>
              <li><a href="https://bsky.app/profile/onlinenoteai.bsky.social" target="_blank" rel="noopener noreferrer" className="text-left hover:text-cyan-400 transition-colors cursor-pointer">Bluesky</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">© 2025 OnlineNote AI. All rights reserved. Crafted with innovation.</p>
          <div className="flex items-center space-x-4 text-gray-400">
            <a href="mailto:info@onlinenote.ai" className="hover:text-cyan-400 transition-colors">info@onlinenote.ai</a>
            <span>•</span>
            <a href="mailto:onlinenoteai@gmail.com" className="hover:text-cyan-400 transition-colors">onlinenoteai@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;