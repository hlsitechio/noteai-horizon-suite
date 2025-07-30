import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import SpotlightCard from '@/components/ui/spotlight-card';

const Pricing = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  const pricingPlans = [
    {
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Perfect for personal use',
      icon: Sparkles,
      features: [
        '10 notes maximum',
        'Basic AI writing assistance',
        '1 GB storage',
        'Web access only',
        'Basic security',
        'Email support'
      ],
      popular: false,
      gradient: 'from-white/5 to-white/3',
      cta: 'Get Started Free'
    },
    {
      name: 'Pro',
      monthlyPrice: 9,
      yearlyPrice: 90, // 2 months free
      description: 'For power users and professionals',
      icon: Zap,
      features: [
        'Unlimited notes',
        'Advanced AI features',
        'Focus Mode',
        '50 GB storage', 
        'All device access',
        'Real-time sync',
        'Folders & organization',
        'Advanced analytics',
        'Enhanced security',
        'Priority support'
      ],
      popular: true,
      gradient: 'from-white/8 to-white/4',
      cta: 'Start 14-Day Free Trial'
    },
    {
      name: 'Premium',
      monthlyPrice: 19,
      yearlyPrice: 190, // 2 months free
      description: 'For teams and advanced users',
      icon: Crown,
      features: [
        'Everything in Pro',
        'Project Realms',
        'Team collaboration',
        'Custom AI models',
        'Enterprise security',
        'Dedicated support'
      ],
      popular: false,
      gradient: 'from-white/5 to-white/3',
      cta: 'Start 14-Day Free Trial'
    }
  ];

  const getPrice = (plan: typeof pricingPlans[0]) => {
    if (plan.monthlyPrice === 0) return '$0';
    const price = isYearly ? plan.yearlyPrice / 12 : plan.monthlyPrice;
    return `$${Math.round(price)}`;
  };

  const getOriginalPrice = (plan: typeof pricingPlans[0]) => {
    if (plan.monthlyPrice === 0 || !isYearly) return null;
    return `$${plan.monthlyPrice}`;
  };

  return (
    <section id="pricing" className="py-32 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
            Simple Pricing
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your needs. Start with a 14-day free trial.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
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
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="relative group"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white px-8 py-2 rounded-full text-sm font-bold shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-white/20">
                    Most Popular
                  </div>
                </div>
              )}
              
              <SpotlightCard 
                className={`h-full transition-all duration-500 hover:scale-105 ${plan.popular ? 'shadow-[0_0_50px_rgba(59,130,246,0.3)]' : 'shadow-xl'} hover:shadow-2xl`}
                spotlightColor={plan.popular ? "rgba(59, 130, 246, 0.2)" : "rgba(139, 92, 246, 0.15)"}
              >
                <div className="p-10 text-center relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <plan.icon className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">{plan.name}</h3>
                  <p className="text-gray-300 mb-8 text-lg">{plan.description}</p>
                  <div className="mb-10">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-6xl font-bold text-white">{getPrice(plan)}</span>
                      <div className="flex flex-col">
                        {getOriginalPrice(plan) && (
                          <span className="text-gray-400 text-lg line-through">{getOriginalPrice(plan)}</span>
                        )}
                        <span className="text-gray-300 text-xl">
                          {plan.monthlyPrice === 0 ? 'forever' : isYearly ? '/month' : '/month'}
                        </span>
                      </div>
                    </div>
                    {isYearly && plan.monthlyPrice > 0 && (
                      <p className="text-cyan-400 text-sm">Billed annually ({isYearly ? `$${plan.yearlyPrice}` : `$${plan.monthlyPrice * 12}`}/year)</p>
                    )}
                  </div>
                  <ul className="space-y-4 mb-10 text-left">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-300 text-lg">
                        <Check className="w-6 h-6 text-cyan-400 mr-4 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="relative group/button">
                    <Button onClick={() => navigate('/register')}
                      className={`w-full py-4 text-lg font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.4)]'
                          : 'text-white hover:bg-white/10 backdrop-blur-xl border-0'
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                    {plan.popular && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover/button:opacity-40 transition-opacity duration-500" />
                    )}
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
        
        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
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
  );
};

export default Pricing;