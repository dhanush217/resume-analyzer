import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Github, Linkedin, Mail, Shield, Info } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 mb-4"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold gradient-text">AI Resume Analyzer</h3>
                <p className="text-xs text-gray-500">Powered by Advanced AI</p>
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-sm mb-6 max-w-md"
            >
              Get intelligent, AI-powered feedback on your resume to improve your chances of landing your dream job. 
              Our advanced analysis helps you optimize for ATS systems and recruiter preferences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-1 text-sm text-gray-500"
            >
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for job seekers worldwide</span>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                'How It Works',
                'Sample Reports', 
                'Job Roles',
                'Tips & Guides',
                'Success Stories'
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support & Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2">
              {[
                { name: 'Contact Us', icon: Mail },
                { name: 'Privacy Policy', icon: Shield },
                { name: 'Terms of Service', icon: Info },
                { name: 'FAQ', icon: null },
                { name: 'Report Issue', icon: null }
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t border-gray-200 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            <p>© {currentYear} AI Resume Analyzer. All rights reserved.</p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-200"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-200"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:support@example.com"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-200"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Version Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-4"
        >
          <p className="text-xs text-gray-400">
            Version 1.0.0 • Built with React & AI • Last updated: December 2024
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
