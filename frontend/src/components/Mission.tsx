const Mission = () => {
  return (
    <section id="about" className="py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Column: Text and Statistics */}
        <div className="font-sans">
          {/* Eyebrow Title */}
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">
            Our Mission
          </span>
          
          {/* Main Heading in Playfair Display (Serif) */}
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-brown leading-tight">
            Fixing the Agricultural Supply Chain
          </h2>
          
          <div className="text-gray-700 text-lg leading-relaxed space-y-6 mb-12">
            <p>
              Agriculture employs the majority of the population, yet smallholder farmers 
              face exploitative intermediaries, lack access to real-time market data, and 
              remain excluded from formal financial systems.
            </p>
            <p>
              CropConnect eliminates information asymmetry and ensures fair market 
              rates for everyone. By combining offline SMS/USSD technology for farmers 
              with a powerful online platform for buyers, we create a "phygital" bridge that 
              leaves no one behind.
            </p>
          </div>

          {/* Three-Column Statistics Grid */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
            <div>
              {/* Added font-serif here so it matches the headings */}
              <div className="font-serif text-3xl font-bold text-primary mb-1">92%</div>
              <div className="text-sm text-gray-500 font-medium">Farmer Retention</div>
            </div>
            <div>
              {/* Added font-serif here */}
              <div className="font-serif text-3xl font-bold text-primary mb-1">+34%</div>
              <div className="text-sm text-gray-500 font-medium">Income Increase</div>
            </div>
            <div>
              {/* Added font-serif here */}
              <div className="font-serif text-3xl font-bold text-primary mb-1">2.4s</div>
              <div className="text-sm text-gray-500 font-medium">Avg. SMS Response</div>
            </div>
          </div>
        </div>

        {/* Right Column: Image and Floating Badge */}
        <div className="relative mt-12 lg:mt-0">
          {/* Main Image */}
          <img 
            src="/aboutmission.jpeg" 
            alt="Woman arranging fresh vegetables at a market" 
            className="w-full h-[600px] object-cover rounded-2xl shadow-xl"
          />
          
          {/* Floating Green Badge (Bottom Left) - Removed border-white classes */}
          <div className="absolute -bottom-6 -left-6 md:-left-10 bg-primary text-white p-6 rounded-xl shadow-2xl max-w-[200px]">
            <div className="font-serif font-bold text-2xl mb-1">RWF 1.2B+</div>
            <div className="font-sans text-sm font-medium text-green-100">Trade Volume (2025)</div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Mission;