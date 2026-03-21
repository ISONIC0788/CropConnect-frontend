// src/components/buyer/BuyerSidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { Map, Star, ShoppingCart, Wallet, User, LogOut } from 'lucide-react';

interface BuyerSidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  closeMobile: () => void;
}

const BuyerSidebar = ({ isCollapsed, isMobileOpen, closeMobile }: BuyerSidebarProps) => {
  const location = useLocation();

  const navLinks = [
    { name: 'Sourcing Map', path: '/buyer', icon: <Map className="w-5 h-5 flex-shrink-0" /> },
    { name: 'Watchlist', path: '/buyer/watchlist', icon: <Star className="w-5 h-5 flex-shrink-0" /> },
    { name: 'Active Orders', path: '/buyer/orders', icon: <ShoppingCart className="w-5 h-5 flex-shrink-0" /> },
    { name: 'Escrow Wallet', path: '/buyer/wallet', icon: <Wallet className="w-5 h-5 flex-shrink-0" /> },
    { name: 'Profile', path: '/buyer/profile', icon: <User className="w-5 h-5 flex-shrink-0" /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={closeMobile} />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 h-full bg-[#166534] text-white flex flex-col justify-between flex-shrink-0 shadow-xl transition-all duration-300 ease-in-out font-sans
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'w-[80px]' : 'w-[260px]'}`}
      >
        <div>
          {/* Brand Logo Area */}
          <div className={`h-24 flex items-center pt-4 transition-all duration-300 ${isCollapsed ? 'px-0 justify-center' : 'px-8'}`}>
            <div className="flex items-center gap-3">
              <img src="/crop_connect_log.png" alt="CropConnect" className="h-8 w-auto brightness-0 invert opacity-90 flex-shrink-0" />
              {!isCollapsed && (
                <div className="flex flex-col whitespace-nowrap overflow-hidden">
                  <span className="font-bold text-[19px] leading-tight tracking-wide">CropConnect</span>
                  <span className="text-[11px] font-semibold text-green-300 tracking-[0.2em] mt-0.5">BUYER</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className={`mt-6 space-y-1.5 overflow-hidden ${isCollapsed ? 'px-3' : 'px-4'}`}>
            {!isCollapsed && (
              <div className="text-[11px] font-bold text-green-400/80 uppercase tracking-widest mb-4 px-4 whitespace-nowrap">
                Navigation
              </div>
            )}
            
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMobile}
                  title={isCollapsed ? link.name : ""}
                  className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} rounded-xl text-[15px] font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-green-800 text-white shadow-inner' 
                      : 'text-green-100/80 hover:bg-green-800/50 hover:text-white'
                  }`}
                >
                  {link.icon}
                  {!isCollapsed && <span className="whitespace-nowrap">{link.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Strict Sign Out Button */}
        <div className={`mb-4 ${isCollapsed ? 'px-3' : 'p-6'}`}>
          <Link 
            to="/logout" 
            title={isCollapsed ? "Sign Out" : ""}
            className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} rounded-xl text-[15px] font-medium text-red-200 hover:bg-red-900/50 hover:text-white transition-all`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">Sign Out</span>}
          </Link>
        </div>
      </aside>
    </>
  );
};

export default BuyerSidebar;