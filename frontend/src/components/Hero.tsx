import { Leaf, Globe, Handshake } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-6 bg-[url('/hero-landing.jpeg')] bg-cover bg-center">
      {/* Dark overlay to make the white text readable */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      
      <div className="relative z-10 max-w-4xl mt-16 text-white">
        {/* Added font-serif here for the Playfair Display font */}
        <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
          Empowering Farmers.<br />
          Simplifying Sourcing.
        </h1>
        
        {/* Added font-sans for the Inter font */}
        <p className="font-sans text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto text-gray-200">
          Join the digital marketplace that connects smallholder farmers directly 
          to wholesale buyers—no smartphones required for sellers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 font-sans">
          <button className="bg-primary hover:bg-green-800 text-white px-6 py-3.5 text-base font-semibold rounded-lg transition-colors cursor-pointer">
            Register as a Buyer
          </button>
          <button className="bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-brown px-6 py-3.5 text-base font-semibold rounded-lg transition-colors cursor-pointer">
            Learn USSD for Farmers
          </button>
        </div>

        {/* Statistics Row */}
        <div className="flex flex-col sm:flex-row justify-center gap-8 text-sm md:text-base font-medium font-sans">
          <div className="flex items-center gap-2 justify-center">
            <Leaf className="w-5 h-5 text-accent" />
            <span>1,248+ Farmers</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Globe className="w-5 h-5 text-accent" />
            <span>12 Districts</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Handshake className="w-5 h-5 text-accent" />
            <span>3,400+ Trades</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;