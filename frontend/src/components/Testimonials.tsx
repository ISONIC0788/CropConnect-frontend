import { Star } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      name: "Jean-Pierre Habimana",
      role: "Maize Farmer, Nyagatare",
      image: "/testimonial-farmer.jpeg",
      quote: "Before CropConnect, I had to accept whatever price the local broker offered. Now I get SMS alerts and sell my maize at fair market value.",
    },
    {
      name: "Amara Ndayisaba",
      role: "Wholesale Buyer, Kigali",
      image: "/testimonial_agent.jpeg", 
      quote: "Sourcing 10 tons of beans used to take weeks. Now, I use the radius search to find aggregated stock from nearby cooperatives in minutes.",
    },
    {
      name: "David Mugisha",
      role: "Field Agent, Musanze",
      image: "/testimonial-agent.jpeg",
      quote: "It is amazing to help farmers build a digital credit score just by trading through their standard mobile phones.",
    }
  ];

  return (
    <section id="testimonials" className="py-24 px-6 md:px-12 lg:px-24 bg-cream">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16 font-sans">
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">
            Social Proof
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brown">
            What Our Community Says
          </h2>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* 5 Star Rating in Harvest Gold */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>

                {/* Quote in Soil Brown */}
                <p className="font-sans italic text-brown/90 leading-relaxed mb-8 text-lg">
                  "{review.quote}"
                </p>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                <img 
                  src={review.image} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-cream"
                />
                <div className="font-sans">
                  <h4 className="font-bold text-brown text-base">{review.name}</h4>
                  <p className="text-gray-500 text-sm">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Testimonials;