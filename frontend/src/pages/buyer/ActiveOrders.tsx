import React, { useState, useEffect } from 'react';
import { Clock, Shield, CheckCircle2, Truck, Package, ArrowRight, Loader2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../../api/axiosClient';

// --- HELPER FUNCTIONS FOR MAPPING BACKEND DATA ---
const getStageIndex = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'PENDING': return 0;
    case 'LOCKED': case 'ACCEPTED': return 1;
    case 'QUALITY_CHECK': return 2;
    case 'IN_TRANSIT': return 3;
    case 'DELIVERED': case 'COMPLETED': return 4;
    default: return 0;
  }
};

const getStatusDisplay = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'PENDING': return { label: 'Pending', badge: 'bg-gray-100 text-gray-500' };
    case 'LOCKED': case 'ACCEPTED': return { label: 'Locked', badge: 'bg-[#FFF9E6] text-[#FBC02D]' };
    case 'QUALITY_CHECK': return { label: 'Quality Check', badge: 'bg-blue-50 text-[#3498DB]' };
    case 'IN_TRANSIT': return { label: 'In Transit', badge: 'bg-green-50 text-[#2E7D32]' };
    case 'DELIVERED': case 'COMPLETED': return { label: 'Delivered', badge: 'bg-green-100 text-[#166534]' };
    default: return { label: status || 'Unknown', badge: 'bg-gray-100 text-gray-500' };
  }
};

const ActiveOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyerOrders = async () => {
      try {
        setLoading(true);
        // 1. Get logged-in buyer ID
        const token = localStorage.getItem('jwt_token');
        if (!token) throw new Error("Not logged in");
        const decoded: any = jwtDecode(token);
        const buyerId = decoded.userId;

        // 2. Fetch all orders (we filter on the client as requested, or backend if pre-filtered)
        const response = await axiosClient.get('/orders');
        const rawOrders = response.data;

        // 3. Filter for this specific buyer and map to frontend shape
        const mappedOrders = rawOrders
          .filter((order: any) => order.buyer?.userId === buyerId)
          .map((order: any) => {
            const statusInfo = getStatusDisplay(order.status);
            return {
              id: order.orderId ? `ORD-${order.orderId.substring(0, 4).toUpperCase()}` : 'ORD-????',
              crop: order.listing?.cropType || 'Unknown Crop',
              status: statusInfo.label,
              stageIndex: getStageIndex(order.status),
              farmer: order.listing?.farmer?.fullName || 'Registered Farmer',
              district: 'Rwanda', // Using default unless postGIS exact region mapping is available
              amount: `${(order.totalAmount || order.bidAmount || 0).toLocaleString()} RWF`,
              weight: `${(order.listing?.quantityKg || 0).toLocaleString()} kg`,
              date: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : 'Just now',
              statusBadge: statusInfo.badge
            };
          });

        // 4. Sort by date descending (newest first)
        mappedOrders.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(mappedOrders);

      } catch (error) {
        console.error("Failed to fetch active orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyerOrders();
  }, []);

  // Compute dynamic pipeline counts from real data
  const pipelineStages = [
    { id: 'pending', stageIndex: 0, label: 'Pending Acceptance', icon: <Clock className="w-6 h-6" />, color: 'text-gray-500' },
    { id: 'locked', stageIndex: 1, label: 'Inventory Locked', icon: <Shield className="w-6 h-6" />, color: 'text-[#FBC02D]' },
    { id: 'quality', stageIndex: 2, label: 'Quality Check', icon: <CheckCircle2 className="w-6 h-6" />, color: 'text-[#3498DB]' },
    { id: 'transit', stageIndex: 3, label: 'In Transit', icon: <Truck className="w-6 h-6" />, color: 'text-[#2E7D32]' },
    { id: 'delivered', stageIndex: 4, label: 'Delivered', icon: <Package className="w-6 h-6" />, color: 'text-[#166534]' }
  ].map(stage => ({
    ...stage,
    count: orders.filter(o => o.stageIndex === stage.stageIndex).length
  }));

  return (
    <div className="max-w-6xl mx-auto pb-12 flex flex-col h-full space-y-6">
      
      {/* PAGE HEADER SUBTITLE */}
      <div className="-mt-2 mb-2">
        <p className="text-sm text-gray-500 tracking-wide">Track your purchases through the pipeline</p>
      </div>

      {/* TOP PIPELINE SUMMARY BAR */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5 flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
        {pipelineStages.map((stage, idx) => (
          <div key={stage.id} className="flex items-center min-w-max">
            
            {/* Stage Info: Icon on left, Text stacked on right */}
            <div className={`flex items-center gap-3 ${stage.color}`}>
              <div>{stage.icon}</div>
              <div className="flex flex-col justify-center">
                <span className="text-[13px] font-bold mb-0.5">{stage.label}</span>
                <span className="text-xl font-bold leading-none">{loading ? '-' : stage.count}</span>
              </div>
            </div>
            
            {/* Arrow Separator */}
            {idx < pipelineStages.length - 1 && (
              <div className="mx-6 text-gray-200">
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ORDER CARDS LIST */}
      <div className="flex-1 space-y-4 relative">
        {loading && (
          <div className="absolute inset-0 bg-[#F9F7F3]/50 z-10 flex flex-col items-center pt-10 text-[#2E7D32]">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="font-bold">Syncing order pipeline...</p>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200 shadow-sm">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">You have no active orders.</p>
            <p className="text-sm mt-1">Head to the Sourcing Map to place bids on verified inventory.</p>
          </div>
        )}

        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            
            {/* Top Info Row */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-[17px] text-[#3E2723]">{order.crop}</h3>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${order.statusBadge}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium">{order.farmer} · {order.district}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">{order.id}</p>
                <p className="font-bold text-[#2E7D32] text-lg">{order.amount}</p>
              </div>
            </div>

            {/* Segmented Pipeline Progress Bar (Thin style from image) */}
            <div className="flex gap-2 mb-4">
              {[0, 1, 2, 3, 4].map(segmentIndex => {
                const isFilled = segmentIndex <= order.stageIndex;
                return (
                  <div 
                    key={segmentIndex} 
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${isFilled ? 'bg-[#2E7D32]' : 'bg-gray-100'}`}
                  ></div>
                );
              })}
            </div>

            {/* Bottom Info Row */}
            <div className="flex justify-between items-center text-xs font-bold text-gray-400 mt-2">
              <p>{order.weight}</p>
              <p>Ordered {order.date}</p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default ActiveOrders;