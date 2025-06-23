
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Calendar, Lock, Eye, Database, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This includes your name, email address, and any content you create using our platform."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send communications, and ensure the security of our platform."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Information Sharing",
      content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this privacy policy or as required by law."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Data Security",
      content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We use industry-standard encryption and security protocols."
    },
    {
      title: "Data Retention",
      content: "We retain your personal information only for as long as necessary to provide you with our services and as described in this privacy policy. You may request deletion of your account and associated data at any time."
    },
    {
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us. Contact us to exercise these rights."
    },
    {
      title: "Cookies and Tracking",
      content: "We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and personalize content. You can control cookie preferences through your browser settings."
    },
    {
      title: "Changes to Privacy Policy",
      content: "We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the effective date."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center text-slate-400 mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              Last updated: December 2024
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </div>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="glass backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-white text-xl flex items-center">
                      {section.icon && (
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                          {React.cloneElement(section.icon, { className: "w-5 h-5 text-white" })}
                        </div>
                      )}
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 leading-relaxed">{section.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-8 glass backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
            <p className="text-slate-300 mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="text-slate-300 space-y-2">
              <li>Email: privacy@onlinenoteai.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: San Francisco, CA, United States</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
