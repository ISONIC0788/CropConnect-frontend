import React, { useState } from 'react';
import { LogOut, Menu, LayoutDashboard, History, Wallet, Bell, Search, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../api/axiosClient';

const FarmerLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [farmerName, setFarmerName] = useState('Farmer');
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      const candidateName = decoded.fullName || decoded.name || '';
      if (typeof candidateName === 'string' && /[A-Za-z]/.test(candidateName)) {
        setFarmerName(candidateName);
      }

      if (typeof decoded.userId === 'string' && decoded.userId.trim()) {
        axiosClient.get(`/users/${decoded.userId}`).then((res) => {
          const dbName = res.data?.fullName;
          if (typeof dbName === 'string' && dbName.trim()) {
            setFarmerName(dbName);
          }
        }).catch(() => {
          // Keep JWT/fallback values if DB lookup fails
        });
      }
    } catch (_) {
      // Keep fallback labels when token is missing or malformed
    }
  }, []);

  // Dynamic page title — same pattern as BuyerLayout & AdminLayout
  let pageTitle = 'Dashboard';
  if (location.pathname === '/farmer/history') pageTitle = 'Sales History';
  if (location.pathname === '/farmer/payments') pageTitle = 'Payments';
  if (location.pathname === '/farmer/profile') pageTitle = 'My Profile';

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/farmer' },
    { icon: History, label: 'Sales History', path: '/farmer/history' },
    { icon: Wallet, label: 'Payments', path: '/farmer/payments' },
    { icon: User, label: 'My Profile', path: '/farmer/profile' },
  ];

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <div className="flex h-screen bg-[#F9F7F3] font-sans overflow-hidden">

      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 bg-[#1B5E20] text-white border-r border-green-900/50 z-50 transform transition-all duration-300 ease-in-out flex-shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-[80px]' : 'w-[260px]'}`}
      >
        <div className="h-full flex flex-col p-6">

          {/* Brand Logo */}
          <div className={`flex items-center gap-3 mb-10 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-2'}`}>
            <img
              src="/crop_connect_log.png"
              alt="CropConnect"
              className="h-8 w-auto brightness-0 invert opacity-90 flex-shrink-0"
            />
            {!isCollapsed && (
              <div className="flex flex-col whitespace-nowrap overflow-hidden">
                <span className="font-sans font-bold text-[19px] leading-tight tracking-wide text-white">
                  CropConnect
                </span>
                <span className="text-[11px] font-semibold text-green-300 tracking-[0.2em] mt-0.5">
                  FARMER PORTAL
                </span>
              </div>
            )}
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  location.pathname === item.path
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-green-100 hover:bg-white/10'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && item.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3.5 mt-auto text-green-200 font-bold text-sm hover:bg-white/10 rounded-2xl transition-colors ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ─── TOP NAVBAR (same pattern as BuyerLayout & AdminLayout) ─── */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10 shadow-sm">

          <div className="flex items-center gap-3 md:gap-4">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-gray-500 hover:text-[#2E7D32] transition-colors cursor-pointer"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop collapse toggle */}
            <button
              className="hidden lg:block p-2 -ml-2 text-gray-500 hover:text-[#2E7D32] transition-colors cursor-pointer"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Dynamic page title */}
            <h1 className="text-xl md:text-2xl font-bold text-[#3E2723] tracking-tight truncate">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Search bar */}
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search listings, buyers..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] w-48 md:w-64 bg-gray-50 transition-all font-sans"
              />
            </div>

            {/* Notification bell */}
            <button className="relative p-2 text-gray-400 hover:text-[#2E7D32] transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FBC02D] rounded-full border border-white"></span>
            </button>

            {/* Farmer profile chip */}
            <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-gray-200 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-[#2E7D32] flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-green-800 transition-colors flex-shrink-0">
                {farmerName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-bold text-[#3E2723] leading-none mb-1 truncate max-w-[120px]">
                  {farmerName}
                </span>
                <span className="text-xs text-gray-500 leading-none">Registered Farmer</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default FarmerLayout;