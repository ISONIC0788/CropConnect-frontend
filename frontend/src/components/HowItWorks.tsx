import { motion } from 'framer-motion';
import { Phone, Globe, Handshake } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: <Phone className="w-6 h-6 text-primary" />,
      title: "The Farmer (Offline)",
      description: "Farmers list their produce and receive real-time price alerts using simple SMS/USSD codes on basic feature phones."
    },
    {
      number: "02",
      icon: <Globe className="w-6 h-6 text-primary" />,
      title: "The Buyer (Online)",
      description: "Wholesale buyers use our interactive web dashboard and geo-spatial search to locate and bid on the nearest available crops."
    },
    {
      number: "03",
      icon: <Handshake className="w-6 h-6 text-primary" />,
      title: "The Connection",
      description: "Our automated matching engine locks the inventory, secures the payment in escrow, and coordinates logistics for a seamless trade."
    }
  ];

  // Variants for the container to stagger the appearance of the cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Each card starts 0.2s after the previous one
      }
    }
  };

  // Variants for each individual card
  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <section id="how-it-works" className="py-24 px-6 md:px-12 lg:px-24 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Animated Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 font-sans"
        >
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">
            The Phygital System
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brown">
            How It Works
          </h2>
        </motion.div>

        {/* Animated 3-Column Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={cardVariants}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border border-gray-100"
            >
              {/* Giant faded number in the top right corner */}
              <div className="absolute top-6 right-6 font-serif text-6xl font-bold text-gray-100 select-none z-0">
                {step.number}
              </div>

              {/* Card Content */}
              <div className="relative z-10 font-sans">
                {/* Green Icon Box */}
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-8">
                  {step.icon}
                </div>
                
                <h3 className="font-serif text-xl font-bold text-brown mb-4">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
      </div>
    </section>
  );
};

export default HowItWorks;