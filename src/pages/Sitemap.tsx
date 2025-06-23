
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Sitemap = () => {
  const navigate = useNavigate();

  const sitePages = [
    {
      category: "Main Pages",
      pages: [
        { name: "Home", path: "/", description: "Main landing page with features and pricing" },
        { name: "Dashboard", path: "/dashboard", description: "User dashboard and overview" },
        { name: "AI Chat", path: "/chat", description: "AI-powered chat interface" },
        { name: "Editor", path: "/editor", description: "Advanced note editing interface" },
        { name: "Calendar", path: "/calendar", description: "Calendar and scheduling features" },
        { name: "Settings", path: "/settings", description: "User settings and preferences" }
      ]
    },
    {
      category: "Authentication",
      pages: [
        { name: "Login", path: "/login", description: "User login page" },
        { name: "Register", path: "/register", description: "New user registration" }
      ]
    },
    {
      category: "Legal & Support",
      pages: [
        { name: "Terms of Service", path: "/terms", description: "Terms and conditions" },
        { name: "Privacy Policy", path: "/privacy", description: "Privacy policy and data handling" },
        { name: "Contact", path: "/contact", description: "Contact form and information" },
        { name: "Sitemap", path: "/sitemap", description: "Complete site structure" }
      ]
    },
    {
      category: "Coming Soon",
      pages: [
        { name: "API Documentation", path: "/coming-soon", description: "API docs and developer resources" },
        { name: "Blog", path: "/coming-soon", description: "Company blog and updates" },
        { name: "Help Center", path: "/coming-soon", description: "Help documentation and tutorials" },
        { name: "About Us", path: "/coming-soon", description: "Company information and team" },
        { name: "Careers", path: "/coming-soon", description: "Job opportunities and careers" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-8 text-slate-300 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Sitemap
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Navigate through all available pages and features of OnlineNote AI
            </p>
          </div>

          <div className="space-y-8">
            {sitePages.map((section, sectionIndex) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.2, duration: 0.6 }}
              >
                <Card className="glass backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/10">
                    <CardTitle className="text-2xl text-white">{section.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-white/10">
                      {section.pages.map((page, pageIndex) => (
                        <motion.div
                          key={page.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (sectionIndex * 0.2) + (pageIndex * 0.05), duration: 0.4 }}
                          className="p-6 hover:bg-white/5 transition-all duration-300 group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                                  {page.name}
                                </h3>
                                <span className="ml-3 text-sm text-slate-400 font-mono bg-slate-800/50 px-2 py-1 rounded">
                                  {page.path}
                                </span>
                              </div>
                              <p className="text-slate-300 text-sm">{page.description}</p>
                            </div>
                            <Button
                              onClick={() => navigate(page.path)}
                              variant="ghost"
                              size="sm"
                              className="ml-4 text-slate-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="glass backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Need Help?</h3>
              <p className="text-slate-300 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <Button
                onClick={() => navigate('/contact')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
              >
                Contact Support
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sitemap;
