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
  const testimonials: Testimonial[] = [{
    id: '1',
    name: 'Sarah Chen',
    role: 'Senior Product Manager',
    company: 'Microsoft',
    avatar: '/api/placeholder/48/48',
    rating: 5,
    content: 'OnlineNote.ai reduced my meeting prep time by 70%. The AI automatically organizes my thoughts and suggests relevant past notes. It\'s like having a personal knowledge assistant that never forgets.',
    verified: true
  }, {
    id: '2',
    name: 'Dr. Marcus Rodriguez',
    role: 'Research Director',
    company: 'Stanford University',
    avatar: '/api/placeholder/48/48',
    rating: 5,
    content: 'As a researcher managing hundreds of papers and notes, OnlineNote.ai\'s intelligent linking and search capabilities are game-changing. I can find any information in seconds.',
    verified: true
  }, {
    id: '3',
    name: 'Emily Watson',
    role: 'Content Strategy Lead',
    company: 'HubSpot',
    avatar: '/api/placeholder/48/48',
    rating: 5,
    content: 'Our content team increased productivity by 45% after switching to OnlineNote.ai. The collaborative features and AI insights help us create better content faster.',
    verified: true
  }, {
    id: '4',
    name: 'James Liu',
    role: 'Engineering Manager',
    company: 'Stripe',
    avatar: '/api/placeholder/48/48',
    rating: 5,
    content: 'OnlineNote.ai seamlessly integrates into our engineering workflow. The AI-powered organization helps track technical decisions and project knowledge effortlessly.',
    verified: true
  }, {
    id: '5',
    name: 'Dr. Priya Patel',
    role: 'Clinical Researcher',
    company: 'Johns Hopkins',
    avatar: '/api/placeholder/48/48',
    rating: 5,
    content: 'Managing patient data and research notes has never been easier. The security and intelligent organization features are exactly what healthcare professionals need.',
    verified: true
  }, {
    id: '6',
    name: 'Alex Thompson',
    role: 'Startup Founder',
    company: 'TechVenture',
    avatar: '/api/placeholder/48/48',
    rating: 5,
    content: 'OnlineNote.ai helped me organize my entire business strategy. The AI suggestions often reveal connections I miss, leading to breakthrough insights.',
    verified: true
  }];
  const stats = [{
    label: 'Active Users',
    value: '75K+',
    growth: '+247%'
  }, {
    label: 'Notes Created',
    value: '4.2M+',
    growth: '+156%'
  }, {
    label: 'Avg. Time Saved Daily',
    value: '4.7 hrs',
    growth: '+73%'
  }, {
    label: 'User Satisfaction',
    value: '99.2%',
    growth: '+8%'
  }];
  const companyLogos = [{
    name: 'Microsoft',
    logo: 'https://img.icons8.com/color/96/microsoft.png'
  }, {
    name: 'Google',
    logo: 'https://img.icons8.com/color/96/google-logo.png'
  }, {
    name: 'Stanford',
    logo: 'https://identity.stanford.edu/wp-content/uploads/sites/3/2020/07/block-s-right.png'
  }, {
    name: 'HubSpot',
    logo: 'https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png'
  }, {
    name: 'Stripe',
    logo: 'https://img.icons8.com/color/96/stripe.png'
  }];
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
    return <section className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Trusted by 75,000+ Professionals Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See why leading professionals at Microsoft, Stanford, HubSpot, and Stripe choose OnlineNote.ai to transform their productivity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <motion.div key={testimonial.id} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: index * 0.1
          }} viewport={{
            once: true
          }} onViewportEnter={() => handleTestimonialView(testimonial.id)} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <Quote className="w-8 h-8 text-primary/30 mr-2" />
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>

                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      {testimonial.verified && <Verified className="w-4 h-4 text-blue-500 ml-1" />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>;
  }
  if (variant === 'stats') {
    return <section className={`py-16 bg-gradient-to-b from-primary/5 to-transparent ${className}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Results That Speak for Themselves
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => <motion.div key={stat.label} initial={{
            opacity: 0,
            scale: 0.8
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.6,
            delay: index * 0.1
          }} viewport={{
            once: true
          }} onViewportEnter={() => handleStatsView(stat.label)} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-green-600 font-medium">
                  {stat.growth} this year
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>;
  }
  if (variant === 'logos') {
    return <section className={`py-12 border-t border-b border-border/50 ${className}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }} className="text-center mb-8">
            <p className="text-sm text-muted-foreground font-medium">
              Trusted by teams at leading companies
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center opacity-60">
            {companyLogos.map((company, index) => {})}
          </div>
        </div>
      </section>;
  }
  return null;
};
export default SocialProof;