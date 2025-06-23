
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using OnlineNote AI, you accept and agree to be bound by the terms and provision of this agreement."
    },
    {
      title: "2. Use License",
      content: "Permission is granted to temporarily use OnlineNote AI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title."
    },
    {
      title: "3. User Account",
      content: "You are responsible for safeguarding the password and for all activities that occur under your account. You agree to notify us immediately upon becoming aware of any breach of security."
    },
    {
      title: "4. Privacy Policy",
      content: "Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices."
    },
    {
      title: "5. Prohibited Uses",
      content: "You may not use our service for any illegal or unauthorized purpose nor may you, in the use of the service, violate any laws in your jurisdiction."
    },
    {
      title: "6. Service Modifications",
      content: "We reserve the right to modify or discontinue the service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service."
    },
    {
      title: "7. Limitation of Liability",
      content: "In no case shall OnlineNote AI, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers, or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind."
    },
    {
      title: "8. Governing Law",
      content: "These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location."
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Terms of Service
            </h1>
            <div className="flex items-center justify-center text-slate-400 mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              Last updated: December 2024
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Please read these terms of service carefully before using OnlineNote AI.
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
                    <CardTitle className="text-white text-xl">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 leading-relaxed">{section.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-8 glass backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
            <p className="text-slate-300 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <ul className="text-slate-300 space-y-2">
              <li>Email: legal@onlinenoteai.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: San Francisco, CA, United States</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
