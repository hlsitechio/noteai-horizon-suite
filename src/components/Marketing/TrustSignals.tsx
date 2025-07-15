import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Award, Users, Clock, CheckCircle } from 'lucide-react';

interface TrustSignalsProps {
  variant?: 'compact' | 'detailed';
  className?: string;
}

const TrustSignals: React.FC<TrustSignalsProps> = ({ 
  variant = 'compact', 
  className = '' 
}) => {
  const signals = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 Type II certified with end-to-end encryption'
    },
    {
      icon: Users,
      title: '75K+ Active Users',
      description: 'Trusted by professionals at Fortune 500 companies'
    },
    {
      icon: Award,
      title: '99.9% Uptime',
      description: 'Enterprise-grade reliability you can count on'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Expert help whenever you need it'
    },
    {
      icon: CheckCircle,
      title: 'GDPR Compliant',
      description: 'Full compliance with global data protection standards'
    },
    {
      icon: Lock,
      title: 'Zero-Knowledge',
      description: 'Your data is encrypted and only you have access'
    }
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground ${className}`}>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-500" />
          <span>Enterprise Security</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <span>75K+ Users</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-yellow-500" />
          <span>99.9% Uptime</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>GDPR Compliant</span>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-bold mb-4">
            Trusted by Leading Organizations
          </h3>
          <p className="text-muted-foreground">
            Enterprise-grade security and reliability you can count on
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {signals.map((signal, index) => (
            <motion.div
              key={signal.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <signal.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h4 className="font-semibold mb-2">{signal.title}</h4>
              <p className="text-sm text-muted-foreground">{signal.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;