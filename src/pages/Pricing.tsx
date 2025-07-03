import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';


const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for personal use",
      icon: Sparkles,
      features: [
        "Up to 100 notes",
        "Basic AI assistance",
        "5GB storage",
        "Web access",
        "Basic encryption"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      description: "For power users and professionals",
      icon: Zap,
      features: [
        "Unlimited notes",
        "Advanced AI features",
        "100GB storage",
        "All device access",
        "Priority support",
        "Real-time collaboration",
        "Advanced encryption"
      ],
      cta: "Start Pro Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$29",
      period: "per user/month",
      description: "For teams and organizations",
      icon: Crown,
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "Team management",
        "SSO integration",
        "Custom AI models",
        "Dedicated support",
        "Compliance tools",
        "API access"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              OnlineNote AI
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="/landing" className="text-gray-300 hover:text-white transition-colors">Back to Home</a>
            <a href="/login" className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all">
              Sign In
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-8"
          >
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              Simple Pricing
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-12"
          >
            Choose the perfect plan for your needs. Start free and upgrade as you grow.
          </motion.p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative z-10 px-4 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-card/20 backdrop-blur-xl rounded-2xl p-8 border ${
                  plan.popular 
                    ? 'border-primary/50 scale-105' 
                    : 'border-border/10'
                } hover:border-primary/20 transition-all group`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className="w-14 h-14 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">/{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  } py-3 font-semibold transition-all`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Pricing;