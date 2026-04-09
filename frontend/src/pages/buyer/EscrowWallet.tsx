import React, { useState, useEffect } from 'react';
import { Wallet, Clock, ShieldAlert, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { buyerService } from '../../api/buyerService';
import type { BidResponse } from '../../api/buyerService';

const getStatusStyles = (status: string) => {
  switch (status.toUpperCase()) {
    case 'ACCEPTED':
      return {
        type: 'released',
        icon: <ArrowUpRight className="w-5 h-5 text-[#166534]" />,
        iconBg: 'bg-green-50',
        badge: 'text-[#166534] border-[#166534] bg-transparent',
        label: 'Accepted'
      };
    case 'DISPUTED':
      return {
        type: 'dispute',
        icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
        iconBg: 'bg-red-50',
        badge: 'text-red-500 border-red-300 bg-transparent',
        label: 'Held for Dispute'
      };
    case 'PENDING':
    default:
      return {
        type: 'pending',
        icon: <ArrowDownRight className="w-5 h-5 text-[#F59E0B]" />,
        iconBg: 'bg-yellow-50',
        badge: 'text-[#D97706] border-[#FCD34D] bg-transparent',
        label: 'Pending Approval'
      };
  }
};

const EscrowWallet = () => {
  const [bids, setBids] = useState<BidResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;
        const decoded: any = jwtDecode(token);
        const buyerId = decoded.userId;

        // Fetch real bids from backend
        const data = await buyerService.getBuyerBids(buyerId);
        setBids(data);

        // Sum up total bid value for balance
        const total = data.reduce((sum, bid) => sum + bid.bidAmount, 0);
        setBalance(total);
      } catch (error) {
        console.error("Failed to load wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-[#166534] font-bold animate-pulse gap-2">
        <Loader2 className="w-6 h-6 animate-spin" /> Calculating Escrow Balances...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 flex flex-col h-full animate-in fade-in duration-500">
      
      <div className="-mt-2 mb-6">
        <p className="text-sm text-gray-500 tracking-wide">Manage your secured payments</p>
      </div>

      {/* BALANCE CARD */}
      <div className="bg-[#166534] rounded-2xl shadow-sm p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="flex items-center gap-3 text-green-50 font-medium mb-6 relative z-10">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm tracking-wide">Escrow Balance</span>
        </div>
        
        <h2 className="text-5xl font-extrabold font-sans mb-8 tracking-tight relative z-10">
          {balance.toLocaleString()} <span className="text-2xl text-green-200">RWF</span>
        </h2>
        
        <div className="flex items-center gap-8 border-t border-green-800/60 pt-5 relative z-10">
          <div className="flex items-center gap-2 text-sm font-medium text-green-100">
            <Clock className="w-4 h-4 opacity-90" />
            <span>{bids.filter(b => b.status === 'PENDING').length} pending</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-green-100">
            <ShieldAlert className="w-4 h-4 opacity-90" />
            <span>{bids.filter(b => b.status === 'DISPUTED').length} disputed</span>
          </div>
        </div>
      </div>

      {/* TRANSACTIONS LIST */}
      <div>
        <h3 className="font-extrabold text-[17px] text-[#3E2723] mb-4">Recent Transactions</h3>
        
        <div className="space-y-4">
          {bids.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">
              <p>No transactions found. Visit the Sourcing Map to place bids.</p>
            </div>
          ) : (
            bids.map((bid) => {
              const styles = getStatusStyles(bid.status);
              
              return (
                <div key={bid.bidId} className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5 flex items-center justify-between hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${styles.iconBg}`}>
                      {styles.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#3E2723] text-[15px]">
                        {bid.listing?.cropType || "Produce"}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 font-medium">
                        Listing ID: #{bid.listing?.listingId?.substring(0, 8)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-[#3E2723] text-[15px] leading-none">
                      {bid.bidAmount.toLocaleString()} RWF
                    </p>
                    <span className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${styles.badge}`}>
                      {styles.label}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};

export default EscrowWallet;