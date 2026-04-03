import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardCheck, UserPlus, Scale } from 'lucide-react';

interface AgentLayoutProps {
  children: ReactNode;
}

const AgentLayout = ({ children }: AgentLayoutProps) => {
  const location = useLocation();

  const navItems = [
    { path: '/agent', label: 'Home', icon: Home },
    { path: '/agent/verify', label: 'Verify', icon: ClipboardCheck },
    { path: '/agent/onboard', label: 'Onboard', icon: UserPlus },
    { path: '/agent/mediate', label: 'Mediate', icon: Scale },
  ];

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center font-sans">
      
      {/* Mobile Device Simulator Container (Max Width 420px on desktop, full on mobile) */}
      <div className="w-full max-w-[420px] bg-[#F9F7F3] min-h-screen flex flex-col relative shadow-2xl overflow-hidden">
        
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
          {children}
        </main>

        {/* Fixed Bottom Navigation */}
        <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center pb-safe shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-50">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className="flex flex-col items-center gap-1 min-w-[64px]"
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-green-50 text-[#2E7D32]' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'fill-current opacity-20' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-bold ${isActive ? 'text-[#2E7D32]' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      
    </div>
  );
};

export default AgentLayout;