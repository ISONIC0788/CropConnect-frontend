// src/layouts/BuyerLayout.tsx
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Menu, CheckCheck } from 'lucide-react';
import BuyerSidebar from '../components/buyer/BuyerSidebar';
import axiosClient from '../api/axiosClient';

// Helper to calculate relative time
const getTimeAgo = (dateString: string) => {
  if (!dateString) return 'Just now';
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

interface BuyerLayoutProps {
  children: ReactNode;
}

const BuyerLayout = ({ children }: BuyerLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [readNotifs, setReadNotifs] = useState<string[]>(() => {
    const saved = localStorage.getItem('read_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const location = useLocation();

  useEffect(() => {
    // Fetch notifications representing new verified products
    const fetchNotifs = async () => {
      try {
        const res = await axiosClient.get('/listings');
        const data = res.data
          .filter((item: any) => item.isVerified && item.status === 'ACTIVE')
          // Sort safely across date strings or timestamps
          .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 5); // top 5 newest
        
        setNotifications(data);
      } catch(e) {
        console.error("Failed to fetch notifications", e);
      }
    };
    fetchNotifs();
  }, [location.pathname]); // Refresh notifications when navigating around

  const handleNotifClick = (id: string) => {
    if (!readNotifs.includes(id)) {
      const newRead = [...readNotifs, id];
      setReadNotifs(newRead);
      localStorage.setItem('read_notifications', JSON.stringify(newRead));
    }
  };

  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const allIds = notifications.map(n => n.listingId);
    const merged = Array.from(new Set([...readNotifs, ...allIds]));
    setReadNotifs(merged);
    localStorage.setItem('read_notifications', JSON.stringify(merged));
  };

  const unreadNotifications = notifications.filter(n => !readNotifs.includes(n.listingId));
  const unreadCount = unreadNotifications.length;


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

            <div className="relative">
              <button 
                className="relative p-2 text-gray-400 hover:text-[#2E7D32] transition-colors cursor-pointer"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FBC02D] rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                      <h3 className="font-bold text-[#3E2723]">Notifications</h3>
                      <div className="flex gap-2 items-center">
                         {unreadCount > 0 && (
                           <button onClick={markAllAsRead} className="text-xs text-gray-500 hover:text-[#2E7D32] flex items-center gap-1 transition-colors">
                             <CheckCheck className="w-3 h-3" /> Mark all read
                           </button>
                         )}
                         {unreadCount > 0 && <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                      </div>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto no-scrollbar">
                      {unreadNotifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-400">You're all caught up!</div>
                      ) : (
                        unreadNotifications.map((notif: any) => {
                          return (
                            <div 
                              key={notif.listingId} 
                              onClick={() => handleNotifClick(notif.listingId)}
                              className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group bg-[#F0FDF4]/50"
                            >
                              <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border bg-green-100 border-green-200">
                                  <span className="text-green-700 font-bold text-[10px] tracking-wider uppercase">NEW</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm leading-snug text-[#3E2723] font-medium">
                                    <span className="font-bold text-[#2E7D32]">{notif.quantityKg}kg {notif.cropType}</span> is now verified and available!
                                  </p>
                                  <div className="flex justify-between items-center mt-1.5">
                                    <p className="text-xs text-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis mr-2">
                                      {notif.farmer?.fullName || 'Farmer'} • {notif.pricePerKg} RWF/kg
                                    </p>
                                    <span className="text-[10px] whitespace-nowrap font-bold text-[#2E7D32]">
                                      {getTimeAgo(notif.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    <div className="p-3 text-center border-t border-gray-50 bg-gray-50/50 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setIsNotifOpen(false)}>
                      <span className="text-xs font-bold text-gray-500">Close</span>
                    </div>
                  </div>
                </>
              )}
            </div>

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