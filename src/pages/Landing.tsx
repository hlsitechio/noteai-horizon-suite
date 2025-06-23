
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Menu, X, Sparkles, Zap, Shield, Users, Check, Mail, Phone, MapPin, Star, Rocket, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      setShowScrollTop(scrollPosition > 400);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigationItems = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI-Powered Intelligence',
      description: 'Advanced AI assistance to enhance your productivity and streamline your workflow with intelligent suggestions.',
      gradient: 'from-cyan-400 via-blue-500 to-purple-600',
      glow: 'shadow-[0_0_50px_rgba(6,182,212,0.3)]'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast Performance',
      description: 'Optimized for speed with instant responses and real-time collaboration across all your devices.',
      gradient: 'from-yellow-400 via-orange-500 to-red-600',
      glow: 'shadow-[0_0_50px_rgba(251,191,36,0.3)]'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security protocols to keep your data safe and protected at all times.',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      glow: 'shadow-[0_0_50px_rgba(16,185,129,0.3)]'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Team Collaboration',
      description: 'Seamless collaboration tools that bring your team together for maximum productivity.',
      gradient: 'from-pink-400 via-rose-500 to-red-600',
      glow: 'shadow-[0_0_50px_rgba(236,72,153,0.3)]'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$9',
      period: '/month',
      description: 'Perfect for individuals getting started',
      features: ['5 Projects', 'Basic AI Features', 'Cloud Storage', 'Email Support'],
      popular: false,
      gradient: 'from-slate-800 to-slate-900',
      border: 'border-slate-700/50'
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'Ideal for growing teams and businesses',
      features: ['Unlimited Projects', 'Advanced AI Features', 'Priority Support', 'Team Collaboration', 'Advanced Analytics'],
      popular: true,
      gradient: 'from-blue-900/50 via-purple-900/50 to-pink-900/50',
      border: 'border-blue-500/50'
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For large organizations with custom needs',
      features: ['Everything in Pro', 'Custom Integrations', 'Dedicated Support', 'SLA Guarantee', 'Advanced Security'],
      popular: false,
      gradient: 'from-slate-800 to-slate-900',
      border: 'border-slate-700/50'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Dynamic Background with Mouse Following Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 40%)`
        }}
      />
      
      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Navigation Header */}
      <AnimatePresence>
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled 
              ? 'bg-black/80 backdrop-blur-2xl border-b border-white/10' 
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl blur-xl opacity-30 animate-pulse" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  OnlineNote AI
                </span>
              </motion.div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                {navigationItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    href={item.href}
                    className="relative text-gray-300 hover:text-white transition-all duration-300 font-medium px-4 py-2 group"
                  >
                    {item.name}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-500" />
                  </motion.a>
                ))}
              </nav>

              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => navigate('/login')}
                  variant="ghost"
                  className="hidden md:inline-flex text-gray-300 hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/40 transition-all duration-300"
                >
                  Sign In
                </Button>
                <div className="relative group">
                  <Button
                    onClick={() => navigate('/register')}
                    className="hidden md:inline-flex bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white font-semibold px-6 py-2.5 rounded-xl border border-white/20 hover:border-white/40 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started
                  </Button>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-black/95 backdrop-blur-2xl border-t border-white/10"
              >
                <div className="px-4 py-6 space-y-4">
                  {navigationItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-gray-300 hover:text-white transition-colors py-2"
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
                    <Button
                      onClick={() => {
                        navigate('/login');
                        setMobileMenuOpen(false);
                      }}
                      variant="ghost"
                      className="justify-start text-gray-300 hover:text-white border border-white/20"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        navigate('/register');
                        setMobileMenuOpen(false);
                      }}
                      className="justify-start bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white border border-white/20"
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative max-w-6xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 rounded-full px-6 py-3 backdrop-blur-xl"
            >
              <Star className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">Next-Gen AI Technology</span>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                The Future of
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Smart Productivity
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Experience the revolution in AI-driven note-taking and productivity.
              <br />
              <span className="text-cyan-300 font-semibold">Create, collaborate, and innovate</span> with unprecedented intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <div className="relative group">
                <Button
                  onClick={() => navigate('/register')}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white px-10 py-6 text-xl font-bold rounded-2xl border-2 border-white/30 hover:border-white/50 shadow-[0_0_50px_rgba(59,130,246,0.4)] hover:shadow-[0_0_80px_rgba(59,130,246,0.6)] transition-all duration-500 transform hover:scale-105"
                >
                  <Rocket className="mr-3 w-6 h-6" />
                  Start Free Trial
                </Button>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              </div>
              
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-6 text-xl font-semibold rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-xl transition-all duration-300 transform hover:scale-105"
              >
                <Globe className="mr-3 w-6 h-6" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto"
            >
              {[
                { number: '50K+', label: 'Active Users' },
                { number: '99.9%', label: 'Uptime' },
                { number: '24/7', label: 'Support' }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the powerful capabilities that make our platform the ultimate choice for modern professionals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="group relative"
              >
                <Card className={`h-full bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-2 border-white/10 hover:border-white/30 backdrop-blur-xl transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden ${feature.glow} hover:shadow-2xl`}>
                  <CardContent className="p-10">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                      {React.cloneElement(feature.icon, { className: "w-10 h-10 text-white" })}
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-6">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-lg">{feature.description}</p>
                  </CardContent>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
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
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-white/20">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <Card className={`h-full bg-gradient-to-br ${plan.gradient} border-2 ${plan.border} hover:border-white/50 backdrop-blur-xl transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden ${plan.popular ? 'shadow-[0_0_50px_rgba(59,130,246,0.3)]' : 'shadow-xl'} hover:shadow-2xl`}>
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
                            ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white border-2 border-white/30 hover:border-white/50 shadow-[0_0_30px_rgba(59,130,246,0.4)]'
                            : 'border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-xl'
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

      {/* Contact Section */}
      <section id="contact" className="py-32 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-300">
              Ready to transform your productivity? Let's start the conversation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Mail className="w-8 h-8" />, title: 'Email', info: 'hello@onlinenoteai.com', gradient: 'from-cyan-500 to-blue-500' },
              { icon: <Phone className="w-8 h-8" />, title: 'Phone', info: '+1 (555) 123-4567', gradient: 'from-blue-500 to-purple-500' },
              { icon: <MapPin className="w-8 h-8" />, title: 'Office', info: 'San Francisco, CA', gradient: 'from-purple-500 to-pink-500' }
            ].map((contact, index) => (
              <motion.div
                key={contact.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center p-8 rounded-3xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-2 border-white/10 hover:border-white/30 backdrop-blur-xl transition-all duration-500 hover:scale-105 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${contact.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                  {React.cloneElement(contact.icon, { className: "w-8 h-8 text-white" })}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{contact.title}</h3>
                <p className="text-gray-300 text-lg">{contact.info}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-white/10 bg-gradient-to-br from-slate-900/50 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl blur-xl opacity-30 animate-pulse" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  OnlineNote AI
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Revolutionizing productivity with next-generation AI-powered note-taking technology.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className="hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
                <li><a href="/coming-soon" className="hover:text-cyan-400 transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/coming-soon" className="hover:text-cyan-400 transition-colors">About</a></li>
                <li><a href="/coming-soon" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                <li><a href="/contact" className="hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-cyan-400 transition-colors">Terms</a></li>
                <li><a href="/sitemap" className="hover:text-cyan-400 transition-colors">Sitemap</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400">&copy; 2024 OnlineNote AI. All rights reserved. Crafted with innovation.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] transition-all duration-300 hover:scale-110 z-50 border border-white/20"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;
