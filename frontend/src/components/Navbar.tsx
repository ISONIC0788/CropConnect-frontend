import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Find the Mission section by its ID
      const aboutSection = document.getElementById('about');
      
      if (aboutSection) {
        // getBoundingClientRect().top gives the exact distance from the top of the screen.
        // 96 is the height of our navbar (h-24 = 6rem = 96px).
        if (aboutSection.getBoundingClientRect().top <= 96) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      } else {
        // Fallback just in case the section hasn't loaded
        if (window.scrollY > 50) setIsScrolled(true);
        else setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check immediately on load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 text-white font-sans transition-all duration-300 ${
        isScrolled ? 'bg-primary shadow-lg py-0' : 'bg-transparent py-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          <Link to="/" className="shrink-0 flex items-center gap-3 cursor-pointer" aria-label="Go to home">
            <img 
              src="/crop_connect_log.png" 
              alt="CropConnect Logo" 
              className="h-12 w-auto object-contain drop-shadow-md"
            />
            <span className="font-serif font-bold text-2xl tracking-wide hidden sm:block drop-shadow-md">
              CropConnect
            </span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-accent transition-colors text-sm font-medium tracking-wide drop-shadow-md"
              >
                {link.name}
              </a>
            ))}
            <Link to="/login" className="text-white hover:text-accent transition-colors font-medium cursor-pointer shadow-sm">
              Log In
            </Link>
            <Link to="/signup">
              <button className="bg-accent hover:bg-yellow-500 text-brown px-6 py-2.5 rounded-lg font-semibold transition-colors cursor-pointer shadow-lg">
                Get Started
              </button>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-accent focus:outline-none cursor-pointer p-2 drop-shadow-md"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-primary shadow-xl pb-6 pt-2 px-4 border-t border-green-800 absolute w-full left-0 top-full">
          <div className="flex flex-col space-y-4 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-white hover:text-accent transition-colors text-base font-medium px-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Link to="/login" className="block text-white hover:text-accent transition-colors text-base font-medium px-2 py-2" onClick={() => setIsOpen(false)}>
              Log In
            </Link>
            <Link to="/signup" onClick={() => setIsOpen(false)}>
              <button className="w-full bg-accent hover:bg-yellow-500 text-brown px-5 py-3 rounded-lg font-semibold transition-colors mt-2 shadow-sm cursor-pointer">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;