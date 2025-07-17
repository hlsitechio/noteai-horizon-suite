
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    { icon: <Mail className="w-8 h-8" />, title: 'Email', info: 'info@onlinenote.ai', gradient: 'from-cyan-500 to-blue-500' },
    { icon: <Mail className="w-8 h-8" />, title: 'Support Email', info: 'onlinenoteai@gmail.com', gradient: 'from-blue-500 to-purple-500' },
    { icon: <MapPin className="w-8 h-8" />, title: 'Social Media', info: 'Follow us on X, Instagram & Bluesky', gradient: 'from-purple-500 to-pink-500' }
  ];

  return (
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
          {contactInfo.map((contact, index) => (
            <motion.div
              key={contact.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="text-center p-8 rounded-3xl bg-gradient-to-br from-slate-900/5 to-slate-800/5 backdrop-blur-xl border-0 transition-all duration-500 hover:scale-105 group"
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
  );
};

export default Contact;
