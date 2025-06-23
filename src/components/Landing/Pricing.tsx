
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Pricing = () => {
  const pricingPlans = [
    {
      name: 'Starter',
      price: '$9',
      period: '/month',
      description: 'Perfect for individuals getting started',
      features: ['5 Projects', 'Basic AI Features', 'Cloud Storage', 'Email Support'],
      popular: false,
      gradient: 'from-slate-800/50 to-slate-900/30'
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'Ideal for growing teams and businesses',
      features: ['Unlimited Projects', 'Advanced AI Features', 'Priority Support', 'Team Collaboration', 'Advanced Analytics'],
      popular: true,
      gradient: 'from-blue-900/40 via-purple-900/40 to-pink-900/30'
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For large organizations with custom needs',
      features: ['Everything in Pro', 'Custom Integrations', 'Dedicated Support', 'SLA Guarantee', 'Advanced Security'],
      popular: false,
      gradient: 'from-slate-800/50 to-slate-900/30'
    }
  ];

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
            Premium Pricing
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. Transparent pricing, premium quality.
          </p>
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
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                    Most Popular
                  </div>
                </div>
              )}
              
              <Card className={`h-full bg-gradient-to-br ${plan.gradient} backdrop-blur-xl transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden ${plan.popular ? 'shadow-[0_0_50px_rgba(59,130,246,0.3)]' : 'shadow-xl'} hover:shadow-2xl`}>
                <CardContent className="p-10 text-center relative">
                  <h3 className="text-3xl font-bold text-white mb-4">{plan.name}</h3>
                  <p className="text-gray-300 mb-8 text-lg">{plan.description}</p>
                  <div className="mb-10">
                    <span className="text-6xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-300 text-xl">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-300 text-lg">
                        <Check className="w-6 h-6 text-cyan-400 mr-4 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="relative group/button">
                    <Button
                      className={`w-full py-4 text-lg font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.4)]'
                          : 'text-white hover:bg-white/10 backdrop-blur-xl'
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Get Started
                    </Button>
                    {plan.popular && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover/button:opacity-40 transition-opacity duration-500" />
                    )}
                  </div>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
