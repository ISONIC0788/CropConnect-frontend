import { motion } from 'framer-motion';
import StatCounter from './StatCounter';

const Mission = () => {
  return (
    <section id="about" className="py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-sans"
        >
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Our Mission</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-brown leading-tight">
            Fixing the Agricultural Supply Chain
          </h2>
          
          <div className="text-gray-700 text-lg leading-relaxed space-y-6 mb-12">
            <p>Agriculture employs the majority of the population...</p>
            <p>CropConnect eliminates information asymmetry...</p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
            <div>
              <div className="font-serif text-3xl font-bold text-primary mb-1">
                <StatCounter value={92} suffix="%" />
              </div>
              <div className="text-sm text-gray-500 font-medium">Farmer Retention</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-primary mb-1">
                <StatCounter value={34} prefix="+" suffix="%" />
              </div>
              <div className="text-sm text-gray-500 font-medium">Income Increase</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-primary mb-1">
                <StatCounter value={2.4} suffix="s" decimals={1} />
              </div>
              <div className="text-sm text-gray-500 font-medium">Avg. SMS Response</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mt-12 lg:mt-0"
        >
          <img src="/aboutmission.jpeg" alt="Mission" className="w-full h-[600px] object-cover rounded-2xl shadow-xl" />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-6 -left-6 md:-left-10 bg-primary text-white p-6 rounded-xl shadow-2xl max-w-[200px]"
          >
            <div className="font-serif font-bold text-2xl mb-1">
              RWF <StatCounter value={1.2} suffix="B+" decimals={1} />
            </div>
            <div className="font-sans text-sm font-medium text-green-100">Trade Volume (2025)</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Mission;