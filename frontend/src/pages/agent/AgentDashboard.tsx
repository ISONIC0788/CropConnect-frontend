import { useState, useEffect } from 'react';
import { MapPin, ClipboardCheck, ShieldCheck, PackageCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { agentService } from '../../api/agentService';
import type { VerificationTask } from '../../api/agentService';

const AgentDashboard = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [agentName, setAgentName] = useState<string>('Loading...');
  const [allTasks, setAllTasks] = useState<VerificationTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'verified'>('pending');

  // --- EFFECT: Fetch Data on Load ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) throw new Error("No token found");

        const decoded: any = jwtDecode(token);
        const userId = decoded.userId;

        // Fetch Profile
        const profile = await agentService.getAgentProfile(userId);
        setAgentName(profile.fullName || decoded.sub);

        // Fetch ALL Listings and store them
        try {
          const tasks = await agentService.getAllListings();
          setAllTasks(tasks);
        } catch (taskErr) {
          console.error("Failed to fetch listings", taskErr);
          setAllTasks([]);
        }

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        if (error instanceof Error && error.message === "No token found") {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // DERIVED STATE (Splitting the tasks based on status)
  const pendingTasks = allTasks.filter(task => !task.isVerified);
  const verifiedTasks = allTasks.filter(task => task.isVerified);

  // The list to display based on the active tab
  const displayedTasks = activeTab === 'pending' ? pendingTasks : verifiedTasks;

  if (loading) {
    return <div className="flex h-full items-center justify-center text-[#2E7D32] font-bold animate-pulse">Loading Dashboard...</div>;
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 pb-20">

      {/* TOP HEADER */}
      <div className="bg-[#2E7D32] px-6 pt-12 pb-8 rounded-b-3xl text-white shadow-md relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>

        <div className="flex justify-between items-center relative z-10">
          <div>
            <h1 className="text-2xl font-bold font-serif tracking-wide">Hello, {agentName.split(' ')[0]}</h1>
            <div className="flex items-center gap-1.5 text-green-100 text-sm mt-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="font-medium tracking-wide">Field Agent</span>
            </div>
          </div>
          <div className="relative">
            <div className="w-12 h-12 bg-white rounded-full border-2 border-white/20 shadow-sm flex items-center justify-center text-[#2E7D32] font-bold text-xl uppercase">
              {agentName.charAt(0)}
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
      <div className="px-6 py-6 space-y-8 flex-1 overflow-y-auto">

        {/* DAILY METRICS */}
        <div>
          <h2 className="text-[#3E2723] font-bold text-lg mb-4 font-serif">Your Activity</h2>
          <div className="grid grid-cols-2 gap-3">

            {/* Pending Metric */}
            <div onClick={() => setActiveTab('pending')} className={`cursor-pointer rounded-2xl p-4 border shadow-sm transition-all ${activeTab === 'pending' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100 hover:bg-gray-50'}`}>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                <ClipboardCheck className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-[#3E2723] leading-none mb-1.5">{pendingTasks.length}</p>
              <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">Pending</p>
            </div>

            {/* Verified Metric */}
            <div onClick={() => setActiveTab('verified')} className={`cursor-pointer rounded-2xl p-4 border shadow-sm transition-all ${activeTab === 'verified' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100 hover:bg-gray-50'}`}>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-[#2E7D32] mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-[#3E2723] leading-none mb-1.5">{verifiedTasks.length}</p>
              <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">Verified</p>
            </div>

          </div>
        </div>

        {/* TASK LIST (DYNAMIC TABS) */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-[#3E2723] font-bold text-lg font-serif">
              {activeTab === 'pending' ? 'Priority Tasks' : 'Verified History'}
            </h2>
            <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
              {displayedTasks.length} Total
            </span>
          </div>

          <div className="space-y-3">

            {displayedTasks.length === 0 ? (
              <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-500 font-medium">
                {activeTab === 'pending' ? 'No pending verifications! Great job.' : 'No verified crops found.'}
              </div>
            ) : (
              displayedTasks.map((task) => (
                <div key={task.listingId} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeTab === 'pending' ? 'bg-blue-500' : 'bg-[#2E7D32]'}`}></div>

                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {activeTab === 'pending' ? (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-blue-100">Verification Required</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-50 text-[#2E7D32] text-[10px] font-bold uppercase tracking-wider rounded-md border border-green-100 flex items-center gap-1">
                          <PackageCheck className="w-3 h-3" /> Certified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Uses the proper backend field quantityKg */}
                  <h3 className="font-bold text-[#3E2723] text-lg mb-1">{task.quantityKg}kg {task.cropType}</h3>
                  <p className="text-xs font-medium text-gray-500 mb-4 flex items-center gap-1">
                    Listing ID: #{task.listingId.substring(0, 8)}... <span className="text-gray-300">•</span> {task.farmer?.fullName || 'Farmer'}
                  </p>

                  {/* Only show the 'Start Verification' button if it's pending */}
                  {activeTab === 'pending' && (
                    <Link to={`/agent/verify?id=${task.listingId}`} className="w-full py-3 mt-2 bg-gray-50 text-[#2E7D32] border border-gray-100 hover:border-green-200 hover:bg-green-50 rounded-xl text-sm font-bold flex items-center justify-center transition-colors">
                      Start Verification
                    </Link>
                  )}
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