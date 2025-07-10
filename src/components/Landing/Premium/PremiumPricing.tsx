import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

const PremiumPricing: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals getting started",
      price: "$9",
      period: "/month",
      icon: Sparkles,
      features: [
        "5,000 AI-enhanced notes",
        "Basic collaboration tools",
        "Mobile & desktop apps",
        "Standard support",
        "5GB storage",
        "Basic templates"
      ],
      cta: "Start Free Trial",
      highlight: false
    },
    {
      name: "Professional",
      description: "Advanced features for power users",
      price: "$29",
      period: "/month",
      icon: Crown,
      badge: "Most Popular",
      features: [
        "Unlimited AI-enhanced notes",
        "Advanced collaboration",
        "Priority support",
        "50GB storage",
        "Custom templates",
        "Advanced integrations",
        "Analytics dashboard",
        "Version history"
      ],
      cta: "Start Free Trial",
      highlight: true
    },
    {
      name: "Enterprise",
      description: "Complete solution for teams",
      price: "$99",
      period: "/month",
      icon: Zap,
      features: [
        "Everything in Professional",
        "Unlimited storage",
        "Custom AI training",
        "24/7 priority support",
        "Advanced security",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantee"
      ],
      cta: "Contact Sales",
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="py-32 px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your needs. All plans include a 14-day free trial 
            with no credit card required.
          </p>
          
          {/* Money-back guarantee */}
          <div className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-6 py-3">
            <Check className="w-5 h-5 text-primary mr-2" />
            <span className="text-sm font-medium">30-day money-back guarantee</span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative ${plan.highlight ? 'md:-mt-8' : ''}`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <Card className={`p-8 h-full relative overflow-hidden transition-all duration-500 group ${
                  plan.highlight 
                    ? 'border-primary/50 bg-gradient-to-b from-primary/5 to-background hover:shadow-[var(--shadow-premium)] scale-105' 
                    : 'bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-[var(--shadow-elegant)]'
                } hover:-translate-y-2`}>
                  
                  {plan.highlight && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50" />
                  )}
                  
                  <div className="relative z-10">
                    {/* Plan Header */}
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-xl ${
                        plan.highlight 
                          ? 'bg-gradient-to-r from-primary to-accent' 
                          : 'bg-gradient-to-r from-muted to-muted-foreground'
                      } shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-6">{plan.description}</p>
                    
                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground ml-2">{plan.period}</span>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* CTA Button */}
                    <Link to="/register" className="block">
                      <Button 
                        className={`w-full py-6 text-lg transition-all duration-300 ${
                          plan.highlight
                            ? 'bg-[var(--gradient-primary)] hover:shadow-[var(--shadow-glow)] hover:scale-105'
                            : 'bg-secondary hover:bg-primary hover:text-primary-foreground'
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ or Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Can I change plans anytime?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "Is there a free trial?",
                answer: "Absolutely! All plans come with a 14-day free trial, no credit card required."
              },
              {
                question: "What about data security?",
                answer: "We use enterprise-grade encryption and zero-knowledge architecture to keep your data secure."
              },
              {
                question: "Do you offer enterprise discounts?",
                answer: "Yes, we offer custom pricing for large teams and organizations. Contact our sales team."
              }
            ].map((faq, index) => (
              <div key={index} className="text-left">
                <h4 className="font-semibold mb-2">{faq.question}</h4>
                <p className="text-muted-foreground text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumPricing;