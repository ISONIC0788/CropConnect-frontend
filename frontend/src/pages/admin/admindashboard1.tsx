import { useState, useEffect } from 'react';
import { Users, ShoppingCart, ShieldCheck, Clock, MessageSquare, Loader2 } from 'lucide-react';
import SMSChart from '../../components/admin/SMSChart';
import KPICard from '../../components/admin/KPICard';
import axiosClient from '../../api/axiosClient';

const admindashboard1 = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    escrowVolume: 0,
    pendingVerifications: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch global platform stats
        const [usersRes, ordersRes, pendingRes] = await Promise.all([
          axiosClient.get('/users'),
          axiosClient.get('/orders'),
          axiosClient.get('/listings/pending')
        ]);

        const users = usersRes.data || [];
        const orders = ordersRes.data || [];
        const pending = pendingRes.data || [];

        // Calculate total escrow volume from orders
        const totalEscrow = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || order.bidAmount || 0), 0);

        setStats({
          totalUsers: users.length,
          totalOrders: orders.length,
          escrowVolume: totalEscrow,
          pendingVerifications: pending.length
        });

        // Generate Recent Activity from real orders (Top 4 most recent)
        const recentOrders = [...orders]
          .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 4)
          .map((order: any, idx: number) => ({
            id: order.orderId || idx,
            icon: <ShieldCheck className="w-4 h-4 text-primary" />,
            text: `Order ${order.orderId ? order.orderId.substring(0, 8).toUpperCase() : 'Unknown'} processed for ${Number(order.totalAmount || order.bidAmount || 0).toLocaleString()} RWF`,
            time: order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Just now',
            type: order.status === 'COMPLETED' ? 'success' : 'info'
          }));

        // Fallback if no orders exist yet
        if (recentOrders.length === 0) {
          recentOrders.push({
            id: 'system-1',
            icon: <ShieldCheck className="w-4 h-4 text-primary" />,
            text: "System initialized and waiting for new transactions.",
            time: new Date().toLocaleString(),
            type: 'success'
          });
        }
        
        setRecentActivity(recentOrders);

      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // 1. Array for the KPI Cards Data dynamically mapped
  const kpiData = [
    {
      title: "Total Platform Users",
      icon: <Users className="w-5 h-5 text-blue-500" />,
      value: loading ? "..." : stats.totalUsers.toString(),
      trendValue: "All Time",
      trendDirection: "up" as const,
      trendColorClass: "text-primary"
    },
    {
      title: "Total Orders",
      icon: <ShoppingCart className="w-5 h-5 text-primary" />,
      value: loading ? "..." : stats.totalOrders.toString(),
      trendValue: "All Time",
      trendDirection: "up" as const,
      trendColorClass: "text-primary"
    },
    {
      title: "Active Escrow Volume",
      icon: <ShieldCheck className="w-5 h-5 text-accent" />,
      value: loading ? "..." : `${stats.escrowVolume.toLocaleString()} RWF`,
      trendValue: "Secured",
      trendDirection: "up" as const,
      trendColorClass: "text-primary"
    },
    {
      title: "Pending Verifications",
      icon: <Clock className="w-5 h-5 text-red-500" />,
      value: loading ? "..." : stats.pendingVerifications.toString(),
      trendValue: stats.pendingVerifications > 0 ? "Action Required" : "All Clear",
      trendDirection: stats.pendingVerifications > 0 ? ("down" as const) : ("up" as const),
      trendColorClass: stats.pendingVerifications > 0 ? "text-red-500" : "text-primary"
    }
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
          <h3 className="font-serif font-bold text-brown mb-6 flex items-center justify-between">
            <span>Recent Activity</span>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          </h3>
          
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