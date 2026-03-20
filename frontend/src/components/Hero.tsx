import { motion } from 'framer-motion';
import { Leaf, Globe, Handshake } from 'lucide-react';
import StatCounter from './StatCounter';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-6 bg-[url('/hero-landing.jpeg')] bg-cover bg-center overflow-hidden">
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mt-16 text-white"
      >
        <motion.h1 variants={itemVariants} className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
          Empowering Farmers.<br />
          Simplifying Sourcing.
        </motion.h1>
        
        <motion.p variants={itemVariants} className="font-sans text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto text-gray-200">
          Join the digital marketplace that connects smallholder farmers directly 
          to wholesale buyers—no smartphones required for sellers.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-16 font-sans">
          <button className="bg-primary hover:bg-green-800 text-white px-6 py-3.5 text-base font-semibold rounded-lg transition-colors cursor-pointer">
            Register as a Buyer
          </button>
          <button className="bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-brown px-6 py-3.5 text-base font-semibold rounded-lg transition-colors cursor-pointer">
            Learn USSD for Farmers
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-8 text-sm md:text-base font-medium font-sans">
          <div className="flex items-center gap-2 justify-center">
            <Leaf className="w-5 h-5 text-accent" />
            <StatCounter value={1248} suffix="+ Farmers" />
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Globe className="w-5 h-5 text-accent" />
            <StatCounter value={12} suffix=" Districts" />
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Handshake className="w-5 h-5 text-accent" />
            <StatCounter value={3400} suffix="+ Trades" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;