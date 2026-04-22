import { useState, useEffect } from 'react';
import { Clock, Shield, CheckCircle2, Truck, Package, PackageOpen, ArrowRight, Loader2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../../api/axiosClient';

// --- HELPER FUNCTIONS FOR MAPPING BACKEND DATA ---
const getStageIndex = (escrowStatus: string, logisticsStatus: string) => {
  const ls = logisticsStatus?.toUpperCase();
  if (ls === 'DELIVERED') return 4;
  if (ls === 'IN_TRANSIT') return 3;
  if (ls === 'QUALITY_VERIFIED' || ls === 'QUALITY_CHECK') return 2;
  const es = escrowStatus?.toUpperCase();
  if (es === 'HELD' || es === 'RELEASED') return 1;
  return 0; // pending
};

const getStatusDisplay = (escrowStatus: string, logisticsStatus: string) => {
  const ls = logisticsStatus?.toUpperCase();
  const es = escrowStatus?.toUpperCase();
  if (ls === 'DELIVERED') return { label: 'Delivered', badge: 'bg-green-100 text-[#166534]' };
  if (ls === 'IN_TRANSIT') return { label: 'In Transit', badge: 'bg-green-50 text-[#2E7D32]' };
  if (ls === 'QUALITY_VERIFIED' || ls === 'QUALITY_CHECK') return { label: 'Quality Check', badge: 'bg-blue-50 text-[#3498DB]' };
  if (es === 'HELD') return { label: 'Locked/Pending Pickup', badge: 'bg-[#FFF9E6] text-[#FBC02D]' };
  return { label: 'Pending Payment', badge: 'bg-gray-100 text-gray-500' };
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
            const statusInfo = getStatusDisplay(order.escrowStatus, order.logisticsStatus);
            return {
              id: order.orderId ? `ORD-${order.orderId.substring(0, 4).toUpperCase()}` : 'ORD-????',
              originalId: order.orderId,
              crop: order.listing?.cropType || 'Unknown Crop',
              status: statusInfo.label,
              rawLogisticsStatus: order.logisticsStatus,
              stageIndex: getStageIndex(order.escrowStatus, order.logisticsStatus),
              farmer: order.listing?.farmer?.fullName || 'Registered Farmer',
              district: 'Rwanda', // Using default unless postGIS exact region mapping is available
              amount: `${(order.finalAmount || order.totalAmount || order.bidAmount || 0).toLocaleString()} RWF`,
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

  const handleSimulateDelivery = async (orderId: string) => {
    if (window.confirm("Simulate delivery of goods (Driver dropping off)?")) {
      try {
        await axiosClient.put(`/orders/${orderId}/simulate-delivery`);
        
        // Refresh orders intelligently
        const token = localStorage.getItem('jwt_token');
        if (!token) return;
        setLoading(true);
        const buyerId = (jwtDecode(token) as any).userId;
        const response = await axiosClient.get('/orders');
        const mappedOrders = response.data
          .filter((order: any) => order.buyer?.userId === buyerId)
          .map((order: any) => {
            const statusInfo = getStatusDisplay(order.escrowStatus, order.logisticsStatus);
            return {
              id: order.orderId ? `ORD-${order.orderId.substring(0, 4).toUpperCase()}` : 'ORD-????',
              originalId: order.orderId,
              crop: order.listing?.cropType || 'Unknown Crop',
              status: statusInfo.label,
              rawLogisticsStatus: order.logisticsStatus,
              stageIndex: getStageIndex(order.escrowStatus, order.logisticsStatus),
              farmer: order.listing?.farmer?.fullName || 'Registered Farmer',
              district: 'Rwanda',
              amount: `${(order.finalAmount || order.totalAmount || order.bidAmount || 0).toLocaleString()} RWF`,
              weight: `${(order.listing?.quantityKg || 0).toLocaleString()} kg`,
              date: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : 'Just now',
              statusBadge: statusInfo.badge
            };
          });
        mappedOrders.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(mappedOrders);
      } catch (error: any) {
        alert("Simulation failed: " + (error.response?.data || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

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

            {/* SIMULATOR BUTTON */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
              {(order.rawLogisticsStatus === 'PENDING_PICKUP' || order.rawLogisticsStatus === 'IN_TRANSIT') ? (
                <button 
                  onClick={() => handleSimulateDelivery(order.originalId)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] hover:bg-[#1b5e20] text-white rounded-lg text-sm font-bold transition-colors"
                >
                  <Truck className="w-4 h-4" />
                  Simulate Delivery Drop-off
                </button>
              ) : order.rawLogisticsStatus === 'DELIVERED' ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-[#166534] rounded-lg text-sm font-bold">
                  <PackageOpen className="w-4 h-4" />
                  Completed
                </div>
              ) : null}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default ActiveOrders;