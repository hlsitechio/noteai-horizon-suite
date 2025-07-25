import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import SpotlightCard from '@/components/ui/spotlight-card';
import { usePublicPageTheme } from '@/hooks/usePublicPageTheme';

const Pricing: React.FC = () => {
  // Ensure clean theme for public pricing page
  usePublicPageTheme();
  
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Perfect for personal use",
      icon: Sparkles,
      popular: false
    },
    {
      name: "Pro",
      monthlyPrice: 9,
      yearlyPrice: 90, // 2 months free
      description: "For power users and professionals",
      icon: Zap,
      popular: true
    },
    {
      name: "Premium",
      monthlyPrice: 19,
      yearlyPrice: 190, // 2 months free
      description: "For teams and advanced users",
      icon: Crown,
      popular: false
    }
  ];

  const features = [
    { name: "Notes limit", free: "10 notes", pro: "Unlimited", premium: "Unlimited" },
    { name: "AI Writing Assistant", free: "Basic", pro: "Advanced", premium: "Advanced + Custom Models" },
    { name: "Storage", free: "1 GB", pro: "50 GB", premium: "500 GB" },
    { name: "Device Access", free: "Web only", pro: "All devices", premium: "All devices" },
    { name: "Real-time Sync", free: false, pro: true, premium: true },
    { name: "Focus Mode", free: false, pro: true, premium: true },
    { name: "Folders & Organization", free: false, pro: true, premium: true },
    { name: "Advanced Analytics", free: false, pro: true, premium: true },
    { name: "Project Realms", free: false, pro: false, premium: true },
    { name: "Team Collaboration", free: false, pro: false, premium: true },
    { name: "API Access", free: false, pro: false, premium: true },
    { name: "Custom AI Training", free: false, pro: false, premium: true },
    { name: "Advanced Security", free: "Basic", pro: "Enhanced", premium: "Enterprise Grade" },
    { name: "Support", free: "Email", pro: "Priority", premium: "Dedicated" },
    { name: "Free Trial", free: "N/A", pro: "14 days", premium: "14 days" }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return '$0';
    const price = isYearly ? plan.yearlyPrice / 12 : plan.monthlyPrice;
    return `$${Math.round(price)}`;
  };

  const getOriginalPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0 || !isYearly) return null;
    return `$${plan.monthlyPrice}`;
  };

  const getFeatureValue = (feature: typeof features[0], plan: string) => {
    const value = feature[plan as keyof typeof feature];
    if (typeof value === 'boolean') {
      return value ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />;
    }
    return <span className="text-sm">{value}</span>;
  };

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
            <Link to="/landing" className="text-gray-300 hover:text-white transition-colors">Back to Home</Link>
            <Link to="/login" className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all">
              Sign In
            </Link>
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
            Choose the perfect plan for your needs. Start with a 14-day free trial.
          </motion.p>
          
          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 mb-16"
          >
            <span className={`text-lg ${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
              aria-label="Switch between monthly and yearly billing"
            />
            <span className={`text-lg ${isYearly ? 'text-white' : 'text-gray-400'}`}>Yearly</span>
            {isYearly && (
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium ml-2">
                Save 17%
              </span>
            )}
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative transition-all group ${
                  plan.popular 
                    ? 'scale-105' 
                    : ''
                }`}
              >
                <SpotlightCard 
                  className="p-8"
                  spotlightColor={plan.popular ? "rgba(59, 130, 246, 0.2)" : "rgba(139, 92, 246, 0.15)"}
                >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white px-8 py-2 rounded-full text-sm font-bold shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-white/20">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className="w-14 h-14 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-bold text-white">{getPrice(plan)}</span>
                      <div className="flex flex-col">
                        {getOriginalPrice(plan) && (
                          <span className="text-gray-400 text-sm line-through">{getOriginalPrice(plan)}</span>
                        )}
                        <span className="text-gray-400 text-sm">
                          {plan.monthlyPrice === 0 ? 'forever' : '/month'}
                        </span>
                      </div>
                    </div>
                    {isYearly && plan.monthlyPrice > 0 && (
                      <p className="text-cyan-400 text-sm mt-1">Billed annually</p>
                    )}
                  </div>
                </div>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    } py-3 font-semibold transition-all`}
                  >
                    {plan.monthlyPrice === 0 ? 'Get Started Free' : 'Start 14-Day Free Trial'}
                  </Button>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <SpotlightCard className="overflow-hidden" spotlightColor="rgba(59, 130, 246, 0.1)">
              <div className="p-8">
                <h3 className="text-3xl font-bold text-white text-center mb-8">Feature Comparison</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/20">
                        <th className="text-left py-4 px-6 text-gray-300 font-medium">Features</th>
                        <th className="text-center py-4 px-6 text-white font-semibold">Free</th>
                        <th className="text-center py-4 px-6 text-white font-semibold">Pro</th>
                        <th className="text-center py-4 px-6 text-white font-semibold">Premium</th>
                      </tr>
                    </thead>
                    <tbody>
                      {features.map((feature, index) => (
                        <tr key={feature.name} className={`border-b border-border/10 ${index % 2 === 0 ? 'bg-white/5' : ''}`}>
                          <td className="py-4 px-6 text-gray-300 font-medium">{feature.name}</td>
                          <td className="py-4 px-6 text-center">{getFeatureValue(feature, 'free')}</td>
                          <td className="py-4 px-6 text-center">{getFeatureValue(feature, 'pro')}</td>
                          <td className="py-4 px-6 text-center">{getFeatureValue(feature, 'premium')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16"
          >
            <p className="text-gray-300 mb-4">
              All plans include bank-level security, instant sync, and mobile apps
            </p>
            <p className="text-gray-400 text-sm">
              Cancel anytime • No hidden fees • 30-day money-back guarantee
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;