import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    // 1. Changed to 'absolute' positioning and 'bg-transparent'
    <nav className="absolute top-0 left-0 w-full z-50 text-white font-sans bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer">
            {/* 2. Removed the white background wrapper to make the logo transparent */}
            <img 
              src="/crop_connect_log.png" 
              alt="CropConnect Logo" 
              className="h-12 w-auto object-contain drop-shadow-md"
            />
            <span className="font-serif font-bold text-2xl tracking-wide hidden sm:block drop-shadow-md">
              CropConnect
            </span>
          </div>

          {/* Desktop Navigation Links */}
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
            <button className="bg-accent hover:bg-yellow-500 text-brown px-6 py-2.5 rounded-lg font-semibold transition-colors cursor-pointer shadow-lg">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
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

      {/* Mobile Dropdown Menu */}
      {/* Kept the solid green background here so links are readable when opened over the image */}
      {isOpen && (
        <div className="md:hidden bg-primary shadow-xl pb-6 pt-2 px-4 border-t border-green-800 absolute w-full left-0 top-24">
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
            <button className="w-full bg-accent hover:bg-yellow-500 text-brown px-5 py-3 rounded-lg font-semibold transition-colors mt-4 shadow-sm cursor-pointer">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;