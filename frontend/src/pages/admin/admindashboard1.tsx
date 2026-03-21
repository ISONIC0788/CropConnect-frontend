import { MessageSquare, Server, ShieldCheck, Clock } from 'lucide-react';
import SMSChart from '../../components/admin/SMSChart';
import KPICard from '../../components/admin/KPICard';

const admindashboard1 = () => {
  // 1. Array for the KPI Cards Data
  const kpiData = [
    {
      title: "SMS Gateway Latency",
      icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
      value: "1.2s",
      trendValue: "+0.1s",
      trendDirection: "up" as const,
      trendColorClass: "text-gray-500"
    },
    {
      title: "Server Uptime",
      icon: <Server className="w-5 h-5 text-primary" />,
      value: "99.92%",
      trendValue: "+0.04%",
      trendDirection: "up" as const,
      trendColorClass: "text-primary"
    },
    {
      title: "Active Escrow Volume",
      icon: <ShieldCheck className="w-5 h-5 text-accent" />,
      value: "12,547,000 RWF",
      trendValue: "+2.1M",
      trendDirection: "up" as const,
      trendColorClass: "text-primary"
    },
    {
      title: "Pending KYC Approvals",
      icon: <Clock className="w-5 h-5 text-red-500" />,
      value: "4",
      trendValue: "-2",
      trendDirection: "down" as const,
      trendColorClass: "text-primary"
    }
  ];

  // 2. Array for Recent Activity
  const recentActivity = [
    { id: 1, icon: <ShieldCheck className="w-4 h-4 text-primary" />, text: "New Institutional buyer registered: East Africa Commodities", time: "2026-03-20 14:32", type: "success" },
    { id: 2, icon: <MessageSquare className="w-4 h-4 text-blue-500" />, text: "Agent David Mugisha assigned to Sector B, Musanze", time: "2026-03-20 13:15", type: "info" },
    { id: 3, icon: <ShieldCheck className="w-4 h-4 text-primary" />, text: "Escrow of 1,240,000 RWF released for TXN-20260318-0112", time: "2026-03-20 11:48", type: "success" },
    { id: 4, icon: <Clock className="w-4 h-4 text-accent" />, text: "Dispute filed on TXN-20260312-0091 — moisture quality issue", time: "2026-03-20 10:05", type: "warning" },
  ];

  return (
    <div className="admindashboard1 space-y-6">
      
      {/* Top Row: Reusable System Health KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard 
            key={index}
            title={kpi.title}
            icon={kpi.icon}
            value={kpi.value}
            trendValue={kpi.trendValue}
            trendDirection={kpi.trendDirection}
            trendColorClass={kpi.trendColorClass}
          />
        ))}
      </div>

      {/* Middle Row: Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif font-bold text-brown flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              SMS Gateway — Latency & Throughput
            </h3>
            <button className="text-xs font-medium bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer">
              Last 24h
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <SMSChart />
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
          <h3 className="font-serif font-bold text-brown mb-6">Recent Activity</h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="mt-0.5">
                  <div className={`p-1.5 rounded-md ${
                    activity.type === 'success' ? 'bg-green-50' : 
                    activity.type === 'warning' ? 'bg-yellow-50' : 
                    'bg-blue-50'
                  }`}>
                    {activity.icon}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-brown leading-snug">{activity.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default admindashboard1;