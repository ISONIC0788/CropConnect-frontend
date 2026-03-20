import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="bg-primary text-white py-16 px-6 md:px-12 lg:px-24 font-sans"
    >
      <div className="max-w-7xl mx-auto">
        {/* Animated Grid Container */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12"
        >
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/crop_connect_log.png" 
                alt="Logo" 
                className="h-10 w-auto brightness-0 invert" 
              />
              <span className="font-serif font-bold text-2xl tracking-wide">CropConnect</span>
            </div>
            <p className="text-green-100 max-w-sm leading-relaxed">
              Bridging the digital divide — connecting smallholder farmers with wholesale buyers through trusted field agents and simple mobile technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Platform</h4>
            <ul className="space-y-4 text-green-100">
              <li><a href="#" className="hover:text-accent transition-colors">Buyer Dashboard</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Agent Portal</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Admin Panel</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Legal</h4>
            <ul className="space-y-4 text-green-100">
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </motion.div>

        {/* Bottom Bar with Staggered Fade */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="pt-8 border-t border-green-700 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className="text-green-200 text-sm">
            © 2026 CropConnect. A product of Ebyte Code Labs. All rights reserved.
          </p>
          
          {/* Social Icons with Hover Effects */}
          <div className="flex gap-6">
            <motion.div whileHover={{ y: -3, color: "#FBC02D" }}>
              <Facebook className="w-5 h-5 cursor-pointer transition-colors" />
            </motion.div>
            <motion.div whileHover={{ y: -3, color: "#FBC02D" }}>
              <Twitter className="w-5 h-5 cursor-pointer transition-colors" />
            </motion.div>
            <motion.div whileHover={{ y: -3, color: "#FBC02D" }}>
              <Linkedin className="w-5 h-5 cursor-pointer transition-colors" />
            </motion.div>
            <motion.div whileHover={{ y: -3, color: "#FBC02D" }}>
              <Instagram className="w-5 h-5 cursor-pointer transition-colors" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;