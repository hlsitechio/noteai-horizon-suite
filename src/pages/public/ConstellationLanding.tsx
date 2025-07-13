import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import ConstellationNetwork from '../components/Landing/Constellation/ConstellationNetwork';
import DataFlowBackground from '../components/Landing/Constellation/DataFlowBackground';
import ParallaxSection from '../components/Landing/Constellation/ParallaxSection';
import ScrollTrailStars from '../components/Landing/Constellation/ScrollTrailStars';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Sparkles, Network, TrendingUp, Eye, Shield, Zap, Globe, Star, CheckCircle, Users, Award } from 'lucide-react';

const ConstellationLanding: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth parallax values
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 0.8, 0.8, 0.6]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(progress);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 text-foreground overflow-hidden">
      {/* Scroll Trail Stars Effect */}
      <ScrollTrailStars mousePosition={mousePosition} />
      
      {/* Constellation Data Flow Background with Parallax */}
      <motion.div style={{ y: y1, scale, opacity }}>
        <DataFlowBackground 
          mousePosition={mousePosition} 
          scrollProgress={scrollProgress}
        />
      </motion.div>
      
      {/* Navigation with 3D parallax */}
      <motion.nav 
        className="relative z-50 flex items-center justify-between p-6 lg:px-12"
        style={{ y: y2 }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05, rotateY: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Network className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            DataFlow
          </span>
        </motion.div>

        <motion.div 
          className="hidden md:flex items-center space-x-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {['Insights', 'Solutions', 'Pricing', 'Contact'].map((item, index) => (
            <motion.a 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className="text-foreground/80 hover:text-foreground transition-colors relative"
              whileHover={{ scale: 1.1, y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {item}
              <motion.div 
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.05, rotateY: -5 }}
        >
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Request Demo
          </Button>
        </motion.div>
      </motion.nav>

      {/* Hero Section with 3D Parallax */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[100vh] px-6 lg:px-12 text-center">
        <motion.div
          className="max-w-4xl mx-auto space-y-8"
          style={{ y: y3 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Floating Badge with 3D effect */}
          <motion.div
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm text-primary"
            initial={{ opacity: 0, scale: 0.9, rotateX: -30 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              boxShadow: "0 10px 30px rgba(var(--primary), 0.3)" 
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Unveiling Hidden Data Patterns</span>
          </motion.div>

          {/* Main Heading with 3D text effect */}
          <motion.h1 
            className="text-5xl lg:text-7xl font-bold leading-tight"
            style={{ rotateX: useTransform(scrollYProgress, [0, 0.5], [0, 5]) }}
          >
            <motion.span 
              className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Unlock insights.
            </motion.span>
            <br />
            <motion.span 
              className="bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Visualize your data.
            </motion.span>
          </motion.h1>

          {/* Subtitle with parallax */}
          <motion.p 
            className="text-xl lg:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            style={{ y: useTransform(scrollYProgress, [0, 0.5], [0, 20]) }}
          >
            Transform raw data into compelling stories with our cutting-edge visualization tools.
            Discover patterns, connections, and insights hidden in your data constellation.
          </motion.p>

          {/* CTA Buttons with 3D hover effects */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div whileHover={{ scale: 1.05, rotateY: 5, z: 10 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg shadow-lg"
              >
                Explore the Universe
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05, rotateY: -5, z: 10 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-primary/30 hover:border-primary/50 px-8 py-4 text-lg shadow-lg"
              >
                Watch Demo
                <TrendingUp className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Constellation Network Overlay with Parallax */}
        <motion.div style={{ y: y2, rotateZ: rotate }}>
          <ConstellationNetwork 
            mousePosition={mousePosition}
            scrollProgress={scrollProgress}
          />
        </motion.div>
      </section>

      {/* 3D Parallax Features Section */}
      <ParallaxSection className="py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl lg:text-6xl font-bold mb-8"
              whileInView={{ rotateY: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Interactive Data Exploration
              </span>
            </motion.h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Navigate through complex data relationships with our intuitive constellation engine
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Network,
                title: "Connected Insights",
                description: "Visualize complex data relationships through interactive network maps",
                color: "hsl(200, 80%, 60%)"
              },
              {
                icon: Sparkles,
                title: "Pattern Recognition", 
                description: "AI-powered analysis reveals hidden patterns in your data streams",
                color: "hsl(280, 80%, 70%)"
              },
              {
                icon: TrendingUp,
                title: "Real-time Analytics",
                description: "Monitor data flows and trends as they happen in real-time",
                color: "hsl(320, 80%, 65%)"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  z: 50,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 h-full relative overflow-hidden group-hover:shadow-2xl transition-all duration-500">
                  {/* Animated background gradient */}
                  <motion.div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${feature.color}, transparent 70%)`
                    }}
                  />
                  
                  <motion.div
                    whileHover={{ rotateY: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-16 h-16 text-primary mb-6 relative z-10" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4 relative z-10">{feature.title}</h3>
                  <p className="text-foreground/70 leading-relaxed relative z-10">{feature.description}</p>
                  
                  {/* Floating particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full opacity-0 group-hover:opacity-60"
                        style={{
                          background: feature.color,
                          left: `${20 + i * 15}%`,
                          top: `${30 + i * 10}%`,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                          duration: 3,
                          delay: i * 0.2,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Statistics Section with 3D counters */}
      <ParallaxSection className="py-32 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Trusted by Data Leaders Worldwide
          </motion.h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "10M+", label: "Data Points Analyzed", icon: Globe },
              { number: "500+", label: "Enterprise Clients", icon: Users },
              { number: "99.9%", label: "Uptime Guarantee", icon: Shield },
              { number: "24/7", label: "Expert Support", icon: Award }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, scale: 0.5, rotateY: -30 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.1, 
                  rotateY: 10,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <Card className="p-8 bg-card/80 backdrop-blur border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <motion.div
                    whileHover={{ rotateY: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  </motion.div>
                  
                  <motion.div
                    className="text-4xl font-bold text-primary mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    {stat.number}
                  </motion.div>
                  
                  <p className="text-foreground/70">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Testimonials with 3D cards */}
      <ParallaxSection className="py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                What Our Clients Say
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Data Science Director",
                company: "TechCorp",
                content: "This platform revolutionized how we visualize complex datasets. The constellation view helped us discover patterns we never knew existed.",
                avatar: "SC"
              },
              {
                name: "Marcus Johnson", 
                role: "Analytics Lead",
                company: "DataFlow Inc",
                content: "The real-time analytics capabilities are game-changing. We can now make data-driven decisions faster than ever before.",
                avatar: "MJ"
              },
              {
                name: "Elena Rodriguez",
                role: "Research Manager", 
                company: "InnovateLab",
                content: "The interactive network maps made it so easy to present complex relationships to our stakeholders. Truly impressive!",
                avatar: "ER"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateY: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  rotateY: -5,
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <Card className="p-8 bg-card/70 backdrop-blur border border-border/50 hover:border-primary/30 transition-all duration-300 h-full">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-foreground/60">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-foreground/80 italic">"{testimonial.content}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Pricing Section with 3D cards */}
      <ParallaxSection className="py-32 bg-gradient-to-r from-accent/5 to-primary/5" id="pricing">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Choose Your Plan
              </span>
            </h2>
            <p className="text-xl text-foreground/70">Flexible pricing for teams of all sizes</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$29",
                period: "/month",
                description: "Perfect for small teams getting started",
                features: ["Up to 1M data points", "Basic visualizations", "Email support", "5 team members"],
                popular: false
              },
              {
                name: "Professional", 
                price: "$99",
                period: "/month",
                description: "Advanced features for growing teams",
                features: ["Up to 10M data points", "Advanced analytics", "Priority support", "Unlimited team members", "Custom integrations"],
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                description: "Tailored solutions for large organizations",
                features: ["Unlimited data points", "White-label solution", "Dedicated support", "Custom development", "SLA guarantee"],
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 50, rotateY: plan.popular ? 0 : 15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: plan.popular ? 0 : 5,
                  z: plan.popular ? 20 : 10,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <Card className={`p-8 h-full relative overflow-hidden ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/30 shadow-2xl' 
                    : 'bg-card/70 backdrop-blur border border-border/50'
                } hover:shadow-xl transition-all duration-300`}>
                  
                  {plan.popular && (
                    <motion.div 
                      className="absolute inset-0 opacity-10"
                      animate={{
                        background: [
                          "radial-gradient(circle at 0% 0%, hsl(var(--primary)), transparent 50%)",
                          "radial-gradient(circle at 100% 100%, hsl(var(--accent)), transparent 50%)",
                          "radial-gradient(circle at 0% 0%, hsl(var(--primary)), transparent 50%)"
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                  )}
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-primary">{plan.price}</span>
                      <span className="text-foreground/60">{plan.period}</span>
                    </div>
                    <p className="text-foreground/70 mb-8">{plan.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex}
                          className="flex items-center"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: featureIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <CheckCircle className="w-5 h-5 text-primary mr-3" />
                          <span className="text-foreground/80">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <motion.div
                      whileHover={{ scale: 1.02, rotateY: plan.popular ? 0 : 3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                            : 'border-2 border-primary/30 hover:border-primary/50'
                        }`}
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        Get Started
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Footer with 3D hover effects */}
      <footer className="relative z-10 border-t border-border/50 py-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="col-span-2"
            >
              <div className="flex items-center space-x-2 mb-6">
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center"
                  whileHover={{ rotateY: 180, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Network className="w-5 h-5 text-primary-foreground" />
                </motion.div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  DataFlow
                </span>
              </div>
              <p className="text-foreground/70 mb-6 max-w-md">
                Illuminating the data universe with cutting-edge visualization tools and constellation analytics.
              </p>
              <div className="flex space-x-4">
                {['Features', 'Pricing', 'Contact', 'About'].map((link, index) => (
                  <motion.a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                    whileHover={{ y: -2, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {link}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {[
              {
                title: "Solutions",
                links: ["Data Analytics", "Visualization", "AI Insights", "Real-time Monitoring"]
              },
              {
                title: "Resources", 
                links: ["Documentation", "API Reference", "Tutorials", "Community"]
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Press", "Partners"]
              }
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-bold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <motion.li key={link}>
                      <motion.a
                        href="#"
                        className="text-foreground/60 hover:text-foreground transition-colors block"
                        whileHover={{ x: 5, color: "hsl(var(--primary))" }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {link}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="border-t border-border/30 pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-foreground/60">
              © 2024 DataFlow. Illuminating the data universe. All rights reserved.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default ConstellationLanding;