import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownToLine, Loader2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../../api/axiosClient';

const Payments = () => {
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;
        const decoded: any = jwtDecode(token);
        const farmerId = decoded.userId;
        
        // Fetch real orders for this specific farmer
        const response = await axiosClient.get(`/orders/farmer/${farmerId}`);
        const data = response.data || [];

        // Calculate total earnings from all valid orders
        const sum = data.reduce((acc: number, order: any) => {
          return acc + (order.totalAmount || order.bidAmount || 0);
        }, 0);

        setTotalEarnings(sum);
      } catch (err) {
        console.error("Failed to load payments data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return (
    <div className="flex h-full items-center justify-center text-[#2E7D32] animate-pulse">
      <Loader2 className="w-6 h-6 animate-spin mr-2"/> Loading Wallet...
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500">
      
      {/* WALLET CARD */}
      <div className="bg-[#2E7D32] rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-lg shadow-green-900/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="flex items-center gap-3 text-green-100 font-medium mb-6 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm uppercase tracking-widest font-bold">Total Escrow Earnings</span>
        </div>
        <h2 className="text-5xl font-extrabold font-sans mb-2 tracking-tight relative z-10">
          {totalEarnings.toLocaleString()} <span className="text-2xl text-green-200">RWF</span>
        </h2>
        <p className="text-green-100 text-sm relative z-10">Funds are ready for withdrawal to Mobile Money.</p>
        
        <button className="mt-8 relative z-10 bg-white text-[#2E7D32] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-50 transition-colors shadow-sm cursor-pointer">
          <ArrowDownToLine className="w-4 h-4"/> Withdraw to MoMo
        </button>
      </div>

    </div>
  );
};

export default Payments;