import { useState, ReactNode } from 'react';
import { LayoutDashboard, Bell, Search, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom'; // <-- Added this import
import AdminSidebar from '../pages/admin/AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  // State to manage sidebar interactions
  const [isCollapsed, setIsCollapsed] = useState(false); // For Desktop
  const [isMobileOpen, setIsMobileOpen] = useState(false); // For Mobile Devices

  const location = useLocation(); // <-- Get the current URL

  // <-- Determine the title dynamically based on the current URL
  let pageTitle = 'Dashboard Overview';
  if (location.pathname === '/admin/users') {
    pageTitle = 'User Management';
  } else if (location.pathname === '/admin/disputes') {
    pageTitle = 'Dispute Arbitration';
  } else if (location.pathname === '/admin/audit-logs') {
    pageTitle = 'Audit Logs';
  } else if (location.pathname === '/admin/health') {
    pageTitle = 'System Health';
  } else if (location.pathname === '/admin/settings') {
    pageTitle = 'Settings';
  }

  return (
    <div className="AdminDashboard flex h-screen bg-cream font-sans overflow-hidden">
      
      {/* Sidebar with state props passed in */}
      <AdminSidebar 
        isCollapsed={isCollapsed} 
        isMobileOpen={isMobileOpen} 
        closeMobile={() => setIsMobileOpen(false)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
        
        {/* Top Header - Updated for Responsiveness */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Mobile Menu Toggle Button */}
            <button 
              className="md:hidden p-2 text-gray-500 hover:text-primary transition-colors cursor-pointer"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Desktop Collapse Toggle Button */}
            <button 
              className="hidden md:block p-2 -ml-2 text-gray-500 hover:text-primary transition-colors cursor-pointer"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="w-5 h-5" />
            </button>

            <LayoutDashboard className="w-5 h-5 text-gray-400 hidden sm:block" />
            
            {/* <-- We use our dynamic {pageTitle} variable here instead of hardcoding it! */}
            <h1 className="font-serif text-lg md:text-xl font-bold text-brown truncate">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {/* Search Bar (Hidden on extremely small mobile screens) */}
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-40 md:w-64 bg-gray-50 transition-all"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer flex-shrink-0">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-white"></span>
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-gray-200 cursor-pointer group flex-shrink-0">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-green-800 transition-colors">
                SA
              </div>
              {/* Hide text on mobile to save space */}
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-bold text-brown leading-none mb-1">Super Admin</span>
                <span className="text-xs text-gray-500 leading-none">admin@cropconnect.rw</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;