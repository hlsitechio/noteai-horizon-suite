import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import { Card } from '../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';

const PremiumTestimonials: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      content: "This platform has completely transformed how our team collaborates. The AI suggestions are eerily accurate, and the real-time collaboration feels like magic. We've increased our productivity by 300%.",
      author: "Sarah Chen",
      role: "Head of Product",
      company: "TechFlow Inc.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      content: "As a freelance writer, I've tried every note-taking app out there. Nothing comes close to this level of intelligence and intuitive design. It's like having a writing assistant that actually understands creativity.",
      author: "Marcus Rodriguez",
      role: "Senior Writer",
      company: "Independent",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      content: "The security features give us complete peace of mind. We handle sensitive client data, and the zero-knowledge encryption with enterprise compliance makes this the only tool we trust.",
      author: "Dr. Emily Watson",
      role: "Research Director",
      company: "NeuroTech Labs",
      avatar: "https://images.unsplash.com/photo-1559160550-a5f56d4d1b9d?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      content: "The mobile experience is phenomenal. I can capture ideas during my commute and they're instantly available everywhere. The voice-to-text with AI enhancement is incredibly accurate.",
      author: "James Park",
      role: "Creative Director",
      company: "Pixel Studios",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      content: "We migrated our entire knowledge base here. The search capabilities are incredible - it finds exactly what I'm looking for even when I can't remember the exact words I used.",
      author: "Lisa Thompson",
      role: "Operations Manager",
      company: "Global Dynamics",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      content: "The automation features save me hours every week. Templates, smart suggestions, and integrations with our existing tools make this feel like the future of productivity.",
      author: "Alex Kumar",
      role: "Engineering Lead",
      company: "DataCorp",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="testimonials" className="py-32 px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="max-w-7xl mx-auto relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Loved by Thousands
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join the community of creators, teams, and organizations who have 
            transformed their productivity with our platform.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20"
        >
          {[
            { value: "4.9/5", label: "Average Rating" },
            { value: "50K+", label: "Happy Users" },
            { value: "99.9%", label: "Satisfaction Rate" },
            { value: "24/7", label: "Support Available" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 relative group">
                <Quote className="absolute top-6 right-6 w-6 h-6 text-primary/30 group-hover:text-primary/50 transition-colors" />
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground/90 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                    <AvatarFallback>
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-muted-foreground mb-8">Trusted by teams at</p>
          <div className="flex items-center justify-center space-x-12 opacity-50">
            {['TechFlow', 'NeuroTech Labs', 'Pixel Studios', 'Global Dynamics', 'DataCorp'].map((company, index) => (
              <div key={index} className="text-lg font-semibold">
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumTestimonials;