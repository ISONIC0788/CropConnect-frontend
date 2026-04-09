import React, { useState, useEffect } from 'react';
import { History, PackageCheck, Loader2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { farmerService } from '../../api/farmerService';
import type { FarmerOrder } from '../../api/farmerService';

const SalesHistory = () => {
  const [orders, setOrders] = useState<FarmerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;
        const farmerId = (jwtDecode(token) as any).userId;
        
        const data = await farmerService.getSalesHistory(farmerId);
        setOrders(data);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center text-[#2E7D32] animate-pulse"><Loader2 className="w-6 h-6 animate-spin mr-2"/> Loading Records...</div>;

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
                    <p className="font-bold text-[#3E2723]">{order.listing.quantityKg}kg {order.listing.cropType}</p>
                    <p className="text-xs text-gray-400 mt-1">Order #{order.orderId.substring(0,8)}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-[#3E2723]">{order.buyer.fullName}</p>
                    <p className="text-xs text-gray-400">{order.buyer.phoneNumber}</p>
                  </td>
                  <td className="p-4 text-right font-bold text-[#2E7D32]">
                    {order.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <PackageCheck className="w-3 h-3"/> {order.orderStatus}
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