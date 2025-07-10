import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Verified } from 'lucide-react';
import { safeSendAnalyticsEvent } from '@/utils/safeAnalytics';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
  verified?: boolean;
}

interface SocialProofProps {
  variant?: 'testimonials' | 'stats' | 'logos';
  className?: string;
}

const SocialProof: React.FC<SocialProofProps> = ({ 
  variant = 'testimonials', 
  className = '' 
}) => {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'TechCorp',
      avatar: '/api/placeholder/48/48',
      rating: 5,
      content: 'Online Note AI has transformed how our team collaborates. The AI suggestions are incredibly helpful and save us hours each week.',
      verified: true
    },
    {
      id: '2',
      name: 'David Rodriguez',
      role: 'Freelance Writer',
      company: 'Independent',
      avatar: '/api/placeholder/48/48',
      rating: 5,
      content: 'The best note-taking app I\'ve ever used. The AI understands context perfectly and helps me organize my thoughts effortlessly.',
      verified: true
    },
    {
      id: '3',
      name: 'Emily Watson',
      role: 'Research Scientist',
      company: 'Stanford University',
      avatar: '/api/placeholder/48/48',
      rating: 5,
      content: 'As a researcher, I need to process vast amounts of information. This app makes it so much easier to capture and connect ideas.',
      verified: true
    }
  ];

  const stats = [
    { label: 'Active Users', value: '50K+', growth: '+127%' },
    { label: 'Notes Created', value: '2M+', growth: '+89%' },
    { label: 'Time Saved Daily', value: '3.2 hrs', growth: '+45%' },
    { label: 'User Satisfaction', value: '98%', growth: '+12%' }
  ];

  const companyLogos = [
    { name: 'Google', logo: '/api/placeholder/120/40' },
    { name: 'Microsoft', logo: '/api/placeholder/120/40' },
    { name: 'Apple', logo: '/api/placeholder/120/40' },
    { name: 'Amazon', logo: '/api/placeholder/120/40' },
    { name: 'Meta', logo: '/api/placeholder/120/40' },
    { name: 'Tesla', logo: '/api/placeholder/120/40' }
  ];

  const handleTestimonialView = (testimonialId: string) => {
    safeSendAnalyticsEvent('social_proof_testimonial_viewed', {
      testimonial_id: testimonialId,
      variant
    });
  };

  const handleStatsView = (statLabel: string) => {
    safeSendAnalyticsEvent('social_proof_stat_viewed', {
      stat_label: statLabel,
      variant
    });
  };

  if (variant === 'testimonials') {
    return (
      <section className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Trusted by 50,000+ Professionals
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See why leading professionals choose Online Note AI to supercharge their productivity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onViewportEnter={() => handleTestimonialView(testimonial.id)}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <Quote className="w-8 h-8 text-primary/30 mr-2" />
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <Verified className="w-4 h-4 text-blue-500 ml-1" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'stats') {
    return (
      <section className={`py-16 bg-gradient-to-b from-primary/5 to-transparent ${className}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Results That Speak for Themselves
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onViewportEnter={() => handleStatsView(stat.label)}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-green-600 font-medium">
                  {stat.growth} this year
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'logos') {
    return (
      <section className={`py-12 border-t border-b border-border/50 ${className}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-sm text-muted-foreground font-medium">
              Trusted by teams at leading companies
            </p>
          </motion.div>

          <div className="grid grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-60">
            {companyLogos.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-8 w-auto"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default SocialProof;