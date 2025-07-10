import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Phone, MapPin, Twitter, Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumFooter: React.FC = () => {
  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Security", href: "/security" },
        { label: "Integrations", href: "/integrations" },
        { label: "API", href: "/api" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
        { label: "Press", href: "/press" },
        { label: "Contact", href: "/contact" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "Help Center", href: "/help" },
        { label: "Community", href: "/community" },
        { label: "Tutorials", href: "/tutorials" },
        { label: "Templates", href: "/templates" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "GDPR", href: "/gdpr" },
        { label: "Compliance", href: "/compliance" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/onlinenote_ai", label: "Twitter" },
    { icon: Github, href: "https://github.com/onlinenote-ai", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/company/onlinenote-ai", label: "LinkedIn" }
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 border-t border-border/50">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-30" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand section */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="relative">
                    <Sparkles className="w-8 h-8 text-primary animate-glow" />
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                  </div>
                  <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Online Note AI
                  </span>
                </div>
                
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Transform your productivity with AI-powered note-taking. 
                  Join thousands of professionals who trust us with their most important ideas.
                </p>
                
                {/* Contact info */}
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 mr-3 text-primary" />
                    hello@onlinenote.ai
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 mr-3 text-primary" />
                    +1 (555) 123-4567
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-3 text-primary" />
                    San Francisco, CA
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Links sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {footerSections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="font-semibold mb-6 text-foreground">{section.title}</h3>
                    <ul className="space-y-4">
                      {section.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            to={link.href}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 relative group"
                          >
                            {link.label}
                            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-8 border-t border-border/50"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} Online Note AI. All rights reserved.
            </div>

            {/* Social links */}
            <div className="flex items-center space-x-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Final CTA banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-12 mb-8"
        >
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8 text-center backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4">
              Ready to revolutionize your productivity?
            </h3>
            <p className="text-muted-foreground mb-6">
              Start your free trial today and experience the future of note-taking.
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-3 bg-[var(--gradient-primary)] text-primary-foreground rounded-lg font-medium hover:shadow-[var(--shadow-glow)] transition-all duration-300"
              >
                Get Started Free
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default PremiumFooter;