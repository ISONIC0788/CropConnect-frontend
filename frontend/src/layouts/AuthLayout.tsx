import { ReactNode, useState, useEffect } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

// Array of slides using the images from your public folder
const slides = [
  {
    id: 1,
    image: '/login_img.jpeg', 
    title: 'CropConnect',
    subtitle: 'The secure bridge between farm and market.'
  },
  {
    id: 2,
    image: '/testimonial-farmer.jpeg',
    title: 'Empowering Farmers',
    subtitle: 'Direct access to wholesale buyers and fair market prices.'
  },
  {
    id: 3,
    image: '/aboutmission.jpeg',
    title: 'Verified Quality',
    subtitle: 'Trust in every transaction with our on-site agent inspections.'
  }
];

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance the slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5000ms = 5 seconds

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F7F3] flex font-sans">
      
      {/* LEFT SIDE: Visual Branding Carousel (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden">
        
        {/* Background Images with Cross-Fade Transition */}
        {slides.map((slide, index) => (
          <img 
            key={slide.id}
            src={slide.image} 
            alt={slide.title} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        
        {/* Forest Green Overlays to ensure text is always readable */}
        <div className="absolute inset-0 bg-[#2E7D32]/50 mix-blend-multiply z-10 transition-opacity duration-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#166534] via-[#166534]/80 to-transparent opacity-90 z-10"></div>
        
        {/* Branding Content */}
        <div className="relative z-20 flex flex-col justify-end p-16 pb-24 h-full w-full">
          <div className="flex items-center gap-3 mb-8">
            <img 
              src="/crop_connect_log.png" 
              alt="CropConnect Logo" 
              className="h w-auto brightness-0 invert"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          
          {/* Animated Text Content Container */}
          <div className="min-h-[140px] relative flex flex-col justify-end">
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                className={`absolute bottom-0 left-0 transition-all duration-700 ease-in-out w-full ${
                  index === currentSlide 
                    ? 'opacity-100 translate-y-0 pointer-events-auto' 
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                <h1 className="text-4xl font-bold text-white tracking-tight mb-3 drop-shadow-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-green-50 font-medium max-w-md leading-snug drop-shadow-md" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {slide.subtitle}
                </p>
              </div>
            ))}
          </div>
          
          {/* Carousel Dot Indicators */}
          <div className="mt-10 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  index === currentSlide ? 'w-12 bg-[#FBC02D] shadow-[0_0_10px_rgba(251,192,45,0.5)]' : 'w-4 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 relative overflow-y-auto">
        <div className="w-full max-w-md pb-12 lg:pb-0">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#2E7D32] rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <h1 className="text-2xl font-bold text-[#3E2723]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              CropConnect
            </h1>
          </div>

          {/* Form Content - This renders Login.tsx or Signup.tsx dynamically */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
            
            {children}
          </div>
          
        </div>
      </div>
      
    </div>
  );
};

export default AuthLayout;