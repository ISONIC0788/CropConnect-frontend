import { useState, useEffect } from 'react';
import { History, PackageCheck, Loader2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../../api/axiosClient';

const SalesHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;
        const decoded: any = jwtDecode(token);
        const farmerId = decoded.userId;
        
        // Fetch real orders for this specific farmer
        const response = await axiosClient.get(`/orders/farmer/${farmerId}`);
        const data = response.data || [];
        
        // Ensure robust mapping from backend Order.java to frontend UI
        const mappedOrders = data.map((order: any) => ({
          orderId: order.orderId,
          cropType: order.listing?.cropType || 'Unknown Crop',
          quantityKg: order.listing?.quantityKg || 0,
          buyerName: order.buyer?.fullName || 'Registered Buyer',
          buyerPhone: order.buyer?.phoneNumber || 'No phone provided',
          amount: order.totalAmount || order.bidAmount || 0,
          status: order.status || 'COMPLETED'
        }));

        setOrders(mappedOrders);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return (
    <div className="flex h-full items-center justify-center text-[#2E7D32] animate-pulse">
      <Loader2 className="w-6 h-6 animate-spin mr-2"/> Loading Records...
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-green-100 p-3 rounded-2xl"><History className="w-6 h-6 text-[#2E7D32]" /></div>
        <div>
          <h1 className="text-2xl font-bold text-[#3E2723] font-serif">Sales History</h1>
          <p className="text-sm text-gray-500">A record of all your completed deals.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No completed sales yet. Accept a bid to make a sale!</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-bold">Crop Details</th>
                <th className="p-4 font-bold">Buyer</th>
                <th className="p-4 font-bold text-right">Amount (RWF)</th>
                <th className="p-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId} className="border-b border-gray-50 hover:bg-green-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-[#3E2723]">{order.quantityKg}kg {order.cropType}</p>
                    <p className="text-xs text-gray-400 mt-1">Order #{order.orderId ? order.orderId.substring(0,8).toUpperCase() : 'UNKNOWN'}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-[#3E2723]">{order.buyerName}</p>
                    <p className="text-xs text-gray-400">{order.buyerPhone}</p>
                  </td>
                  <td className="p-4 text-right font-bold text-[#2E7D32]">
                    {Number(order.amount).toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <PackageCheck className="w-3 h-3"/> {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SalesHistory;