import { MapPin, ClipboardCheck, Scale, Users, ChevronRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AgentDashboard = () => {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      
      {/* TOP HEADER */}
      <div className="bg-[#2E7D32] px-6 pt-12 pb-8 rounded-b-3xl text-white shadow-md relative overflow-hidden flex-shrink-0">
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            <h1 className="text-2xl font-bold font-serif tracking-wide">Hello, David M.</h1>
            <div className="flex items-center gap-1.5 text-green-100 text-sm mt-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="font-medium tracking-wide">Musanze Sector</span>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=150&q=80" 
              alt="Agent Profile" 
              className="w-12 h-12 rounded-full border-2 border-white/20 object-cover shadow-sm"
            />
            {/* Notification Dot */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FBC02D] rounded-full border-2 border-[#2E7D32] flex items-center justify-center">
              <span className="text-[8px] font-bold text-[#3E2723]">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-6 py-6 space-y-8 flex-1">
        
        {/* DAILY METRICS */}
        <div>
          <h2 className="text-[#3E2723] font-bold text-lg mb-4 font-serif">Your Daily Metrics</h2>
          <div className="grid grid-cols-2 gap-3">
            
            {/* Primary Metric - Full Width */}
            <div className="col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Pending Verifications</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-[#3E2723] leading-none">5</span>
                    <span className="text-xs font-bold text-red-500 mb-0.5 bg-red-50 px-2 py-0.5 rounded-md">2 Urgent</span>
                  </div>
                </div>
              </div>
              <Link to="/agent/verify" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-[#2E7D32] transition-colors">
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Secondary Metrics - Split */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-[#2E7D32] mb-3">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-[#3E2723] leading-none mb-1.5">42</p>
              <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Farmers Onboarded</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center text-[#D97706] mb-3">
                <Scale className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-[#3E2723] leading-none mb-1.5">12</p>
              <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Resolved Disputes</p>
            </div>

          </div>
        </div>

        {/* PRIORITY TASKS */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-[#3E2723] font-bold text-lg font-serif">Priority Tasks</h2>
            <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">View All</span>
          </div>
          
          <div className="space-y-3">
            {/* Task 1: Verification */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-md">Verification</span>
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">2h ago</span>
              </div>
              <h3 className="font-bold text-[#3E2723] text-base mb-1">500kg Maize (Grade A)</h3>
              <p className="text-xs font-medium text-gray-500 mb-4 flex items-center gap-1">
                Jean-Pierre H. <span className="text-gray-300">•</span> Coop A, Musanze
              </p>
              <Link to="/agent/verify" className="w-full py-3 bg-gray-50 text-[#2E7D32] border border-gray-100 hover:border-green-200 hover:bg-green-50 rounded-xl text-sm font-bold flex items-center justify-center transition-colors">
                Start Verification
              </Link>
            </div>

            {/* Task 2: Dispute */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Dispute
                  </span>
                </div>
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Urgent</span>
              </div>
              <h3 className="font-bold text-[#3E2723] text-base mb-1">Quality Mismatch: Coffee</h3>
              <p className="text-xs font-medium text-gray-500 mb-4 flex items-center gap-1">
                Kigali Fresh <span className="text-gray-300">vs</span> Marie-Claire U.
              </p>
              <Link to="/agent/mediate" className="w-full py-3 bg-gray-50 text-[#2E7D32] border border-gray-100 hover:border-green-200 hover:bg-green-50 rounded-xl text-sm font-bold flex items-center justify-center transition-colors">
                Resolve Dispute
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AgentDashboard;