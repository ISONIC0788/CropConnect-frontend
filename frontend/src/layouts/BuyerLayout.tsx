// src/layouts/BuyerLayout.tsx
import { useState, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Menu } from 'lucide-react';
import BuyerSidebar from '../components/buyer/BuyerSidebar';

interface BuyerLayoutProps {
  children: ReactNode;
}

const BuyerLayout = ({ children }: BuyerLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  let pageTitle = 'Sourcing Map';
  if (location.pathname === '/buyer/watchlist') pageTitle = 'Watchlist';
  if (location.pathname === '/buyer/orders') pageTitle = 'Active Orders';
  if (location.pathname === '/buyer/wallet') pageTitle = 'Escrow Wallet';
  if (location.pathname === '/buyer/profile') pageTitle = 'Profile';

  return (
    <div className="flex h-screen bg-[#F9F7F3] font-sans overflow-hidden">
      
      <BuyerSidebar 
        isCollapsed={isCollapsed} 
        isMobileOpen={isMobileOpen} 
        closeMobile={() => setIsMobileOpen(false)} 
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
        
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              className="md:hidden p-2 text-gray-500 hover:text-primary transition-colors cursor-pointer"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <button 
              className="hidden md:block p-2 -ml-2 text-gray-500 hover:text-primary transition-colors cursor-pointer"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Using Poppins-style bolding for headers */}
            <h1 className="text-xl md:text-2xl font-bold text-[#3E2723] tracking-tight truncate">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search crops, farmers..." 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] w-48 md:w-64 bg-gray-50 transition-all font-sans"
              />
            </div>

            <button className="relative p-2 text-gray-400 hover:text-[#2E7D32] transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FBC02D] rounded-full border border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-gray-200 cursor-pointer group">
              <img 
                src="/testimonial_agent.jpeg" 
                alt="Buyer Profile" 
                className="w-9 h-9 rounded-full object-cover border-2 border-transparent group-hover:border-[#2E7D32] transition-all"
                onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=Buyer&background=2E7D32&color=fff' }}
              />
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-bold text-[#3E2723] leading-none mb-1">Kigali Fresh</span>
                <span className="text-xs text-gray-500 leading-none">Wholesale Buyer</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default BuyerLayout;