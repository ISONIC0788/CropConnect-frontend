import { useState, useEffect } from 'react';
import { Wallet, Clock, ShieldAlert, ArrowUpRight, ArrowDownRight, Loader2, Smartphone, CheckCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../../api/axiosClient';
import { toast } from 'sonner';

const EscrowWallet = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [pendingBids, setPendingBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  const fetchWalletData = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) return;
      const decoded: any = jwtDecode(token);
      const buyerId = decoded.userId;

      // Fetch real orders AND pending bids in parallel
      const [ordersRes, bidsRes] = await Promise.all([
        axiosClient.get('/orders'),
        axiosClient.get(`/bids/buyer/${buyerId}`)
      ]);

      // Filter orders that belong to this buyer
      const buyerOrders = ordersRes.data.filter((o: any) => o.buyer?.userId === buyerId);
      setOrders(buyerOrders);

      // Only show pending bids that don't already have an order (no duplicates)
      const orderListingIds = new Set(buyerOrders.map((o: any) => o.listing?.listingId));
      const pendingOnly = bidsRes.data.filter(
        (b: any) => b.status === 'PENDING' && !orderListingIds.has(b.listing?.listingId)
      );
      setPendingBids(pendingOnly);

      // Escrow balance = sum of HELD orders only
      const total = buyerOrders
        .filter((o: any) => o.escrowStatus === 'HELD')
        .reduce((sum: number, o: any) => sum + (o.finalAmount || o.totalAmount || o.bidAmount || 0), 0);
      setBalance(total);
    } catch (error) {
      console.error("Failed to load wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleSimulatePayment = async (orderId: string) => {
    if (window.confirm("Simulate making Mobile Money deposit into Escrow?")) {
      try {
        setLoading(true);
        await axiosClient.put(`/orders/${orderId}/simulate-payment`);
        await fetchWalletData();
      } catch (error: any) {
        toast.error(`Simulation failed: ${error.response?.data || error.message}`);
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-[#166534] font-bold animate-pulse gap-2">
        <Loader2 className="w-6 h-6 animate-spin" /> Calculating Escrow Balances...
      </div>
    );
  }

  const totalPending = orders.filter(o => o.escrowStatus === 'PENDING').length + pendingBids.length;

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
            <span>{totalPending} pending payment{totalPending !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-green-100">
            <ShieldAlert className="w-4 h-4 opacity-90" />
            <span>{orders.filter(o => o.escrowStatus === 'HELD').length} secured in escrow</span>
          </div>
        </div>
      </div>

      {/* TRANSACTIONS LIST */}
      <div>
        <h3 className="font-extrabold text-[17px] text-[#3E2723] mb-4">Recent Transactions</h3>

        <div className="space-y-4">

          {/* ── PENDING BIDS: awaiting farmer acceptance ── */}
          {pendingBids.map((bid) => (
            <div
              key={bid.bidId}
              className="bg-white rounded-xl border border-amber-200 shadow-sm px-6 py-5 flex items-center justify-between hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#D97706]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#3E2723] text-[15px]">
                    {bid.listing?.cropType || "Produce"}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    Bid ID: #{bid.bidId?.substring(0, 8)} · {bid.listing?.quantityKg} kg
                  </p>
                  <p className="text-xs text-amber-600 font-semibold mt-0.5">
                    Awaiting farmer approval...
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="font-bold text-[#3E2723] text-[15px] leading-none">
                  {(bid.bidAmount || 0).toLocaleString()} RWF
                </p>
                <span className="flex items-center gap-1.5 text-[#D97706] bg-yellow-50 px-2 py-1 rounded font-bold text-xs uppercase border border-yellow-200">
                  <ArrowDownRight className="w-3.5 h-3.5" /> Bid Placed
                </span>
              </div>
            </div>
          ))}

          {/* ── ORDERS: created after farmer accepts bid ── */}
          {orders.map((order) => {
            const escrow = order.escrowStatus || 'PENDING';
            return (
              <div
                key={order.orderId}
                className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5 flex items-center justify-between hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    escrow === 'HELD' ? 'bg-green-50' : escrow === 'RELEASED' ? 'bg-gray-100' : 'bg-yellow-50'
                  }`}>
                    {escrow === 'HELD' ? (
                      <ShieldAlert className="w-5 h-5 text-[#166534]" />
                    ) : escrow === 'RELEASED' ? (
                      <ArrowUpRight className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-[#F59E0B]" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#3E2723] text-[15px]">
                      {order.listing?.cropType || "Produce"}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 font-medium">
                      Order ID: #{order.orderId?.substring(0, 8)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="font-bold text-[#3E2723] text-[15px] leading-none">
                    {(order.finalAmount || order.totalAmount || order.bidAmount || 0).toLocaleString()} RWF
                  </p>
                  <div className="mt-2">
                    {(escrow !== 'HELD' && escrow !== 'RELEASED') ? (
                      <button
                        onClick={() => handleSimulatePayment(order.orderId)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded font-bold text-xs capitalize transition-colors"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        Simulate MoMo Pay
                      </button>
                    ) : escrow === 'HELD' ? (
                      <span className="flex items-center gap-1.5 text-[#166534] bg-green-50 px-2 py-1 rounded font-bold text-xs uppercase border border-green-200">
                        <CheckCircle className="w-3.5 h-3.5" /> Escrow Secured
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-2 py-1 rounded font-bold text-xs uppercase border border-gray-200">
                        Funds Released
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {orders.length === 0 && pendingBids.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">
              <p>No transactions found. Place bids on produce to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EscrowWallet;