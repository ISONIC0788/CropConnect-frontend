import React, { useState, useEffect } from 'react';
import { MapPin, ClipboardCheck, Scale, Users, ChevronRight, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { agentService } from '../../api/agentService';
import type { PendingVerification } from '../../api/agentService';

const AgentDashboard = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [agentName, setAgentName] = useState<string>('Loading...');
  const [pendingTasks, setPendingTasks] = useState<PendingVerification[]>([]);
  const [loading, setLoading] = useState(true);

  // --- EFFECT: Fetch Data on Load ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Get token and decode it to find the agent's ID
        const token = localStorage.getItem('jwt_token');
        if (!token) throw new Error("No token found");
        
        const decoded: any = jwtDecode(token);
        const userId = decoded.userId;

        // 2. Fetch the real Agent profile from Spring Boot
        // Note: If you get a 404 here, we will need to ensure your UserController has a GET /api/users/{id} endpoint
        const profile = await agentService.getAgentProfile(userId);
        setAgentName(profile.fullName || decoded.sub); // Fallback to phone number if name is missing

        // 3. Fetch real pending verifications (Listings with isVerified = false)
        // If this fails initially, we will just use an empty array until the backend endpoint is ready
        try {
          const tasks = await agentService.getPendingVerifications();
          setPendingTasks(tasks);
        } catch (taskErr) {
          console.warn("Pending tasks endpoint might not exist yet.", taskErr);
          setPendingTasks([]); // Safe fallback
        }

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        // If token is totally invalid, kick to login
        if (error instanceof Error && error.message === "No token found") {
           navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return <div className="flex h-full items-center justify-center text-[#2E7D32] font-bold animate-pulse">Loading Agent Data...</div>;
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      
      {/* TOP HEADER */}
      <div className="bg-[#2E7D32] px-6 pt-12 pb-8 rounded-b-3xl text-white shadow-md relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            {/* DYNAMIC: Real Agent Name */}
            <h1 className="text-2xl font-bold font-serif tracking-wide">Hello, {agentName.split(' ')[0]}</h1>
            <div className="flex items-center gap-1.5 text-green-100 text-sm mt-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="font-medium tracking-wide">Musanze Sector</span>
            </div>
          </div>
          <div className="relative">
            <div className="w-12 h-12 bg-white rounded-full border-2 border-white/20 shadow-sm flex items-center justify-center text-[#2E7D32] font-bold text-xl">
               {agentName.charAt(0).toUpperCase()}
            </div>
            {pendingTasks.length > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FBC02D] rounded-full border-2 border-[#2E7D32] flex items-center justify-center">
                <span className="text-[8px] font-bold text-[#3E2723]">{pendingTasks.length}</span>
              </div>
            )}
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
                    {/* DYNAMIC: Real count of tasks */}
                    <span className="text-2xl font-bold text-[#3E2723] leading-none">{pendingTasks.length}</span>
                  </div>
                </div>
              </div>
              <Link to="/agent/verify" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-[#2E7D32] transition-colors">
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Static Metrics for now */}
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
            
            {/* DYNAMIC: Map through real tasks */}
            {pendingTasks.length === 0 ? (
                <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-500 font-medium">
                    No pending verifications! Great job.
                </div>
            ) : (
                pendingTasks.slice(0, 3).map((task) => (
                    <div key={task.listingId} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-md">Verification</span>
                        </div>
                    </div>
                    <h3 className="font-bold text-[#3E2723] text-base mb-1">{task.quantity} {task.unit} {task.cropType}</h3>
                    <p className="text-xs font-medium text-gray-500 mb-4 flex items-center gap-1">
                        Listing ID: #{task.listingId} <span className="text-gray-300">•</span> Needs Agent Review
                    </p>
                    <Link to={`/agent/verify?id=${task.listingId}`} className="w-full py-3 bg-gray-50 text-[#2E7D32] border border-gray-100 hover:border-green-200 hover:bg-green-50 rounded-xl text-sm font-bold flex items-center justify-center transition-colors">
                        Start Verification
                    </Link>
                    </div>
                ))
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default AgentDashboard;