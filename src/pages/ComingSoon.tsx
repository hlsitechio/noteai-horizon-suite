
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, Bell, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Clock className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Coming Soon
          </h1>
          
          <p className="text-xl text-slate-300 leading-relaxed mb-8">
            We're working hard to bring you something amazing. This feature is currently under development 
            and will be available soon. Stay tuned for updates!
          </p>

          <div className="glass backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center justify-center">
              <Bell className="w-5 h-5 mr-2" />
              Get Notified
            </h3>
            <p className="text-slate-300 mb-6">
              Be the first to know when this feature launches. Enter your email below.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-blue-400"
              />
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                <Mail className="w-4 h-4 mr-2" />
                Notify Me
              </Button>
            </div>
          </div>

          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ComingSoon;
