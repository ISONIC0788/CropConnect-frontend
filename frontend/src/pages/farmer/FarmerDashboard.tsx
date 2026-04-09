import React, { useState, useEffect } from 'react';
import { Sprout, CheckCircle2, Clock, Banknote, Loader2, Package, History } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { farmerService } from '../../api/farmerService';
import type { FarmerListing, FarmerBid } from '../../api/farmerService';

const FarmerDashboard = () => {
  const [listings, setListings] = useState<FarmerListing[]>([]);
  const [bids, setBids] = useState<FarmerBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) return;
      const decoded: any = jwtDecode(token);
      const farmerId = decoded.userId;

      const [myListings, incomingBids] = await Promise.all([
        farmerService.getMyListings(farmerId),
        farmerService.getIncomingBids(farmerId)
      ]);

      setListings(myListings);
      setBids(incomingBids);
    } catch (error) {
      console.error("Error loading farmer data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAcceptBid = async (bidId: string) => {
    if (!window.confirm("Accept this offer and lock your produce?")) return;
    
    setProcessingId(bidId);
    try {
      await farmerService.acceptBid(bidId);
      alert("Deal Accepted! Your payment is now secured in escrow.");
      fetchData(); // Refresh inventory and bids
    } catch (err) {
      alert("Failed to accept bid. Make sure you are logged in correctly.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-[#2E7D32] font-bold animate-pulse gap-2">
        <Loader2 className="w-6 h-6 animate-spin" /> Syncing Farm Records...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3E2723] font-serif">Farmer Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage harvests and incoming buyer offers</p>
        </div>
        <div className="bg-green-100 p-3 rounded-2xl">
            <Sprout className="w-6 h-6 text-[#2E7D32]" />
        </div>
      </div>

      {/* MY PRODUCE INVENTORY */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#3E2723] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#2E7D32]" /> Active Listings
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-gray-300 text-gray-400">
              No crops listed yet.
            </div>
          ) : (
            listings.map(item => (
              <div key={item.listingId} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-[#3E2723] text-lg">{item.quantityKg}kg {item.cropType}</h3>
                  {item.isVerified ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                      <Clock className="w-3 h-3" /> PENDING AGENT
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-50 mt-2">
                  <span className="text-[#2E7D32] font-bold">{item.pricePerKg} RWF/kg</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${item.status === 'LOCKED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* BUYER OFFERS (BIDS) */}
      <section>
        <h2 className="text-lg font-bold text-[#3E2723] mb-4 flex items-center gap-2">
            <Banknote className="w-5 h-5 text-[#2E7D32]" /> Incoming Buy Offers
        </h2>
        <div className="space-y-4">
          {bids.filter(b => b.status === 'PENDING').length === 0 ? (
            <div className="py-12 text-center bg-gray-50 rounded-3xl border border-gray-200 text-gray-400">
              <p>No active offers yet.</p>
            </div>
          ) : (
            bids.filter(b => b.status === 'PENDING').map(bid => (
              <div key={bid.bidId} className="bg-white p-6 rounded-3xl border-2 border-green-100 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">From {bid.buyer.fullName}</p>
                  <h4 className="text-2xl font-bold text-[#3E2723]">{bid.bidAmount.toLocaleString()} RWF</h4>
                  <p className="text-sm text-gray-500 font-medium">For your {bid.listing.quantityKg}kg {bid.listing.cropType}</p>
                </div>
                
                <button 
                  onClick={() => handleAcceptBid(bid.bidId)}
                  disabled={!!processingId}
                  className="bg-[#2E7D32] text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {processingId === bid.bidId ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Accept Offer
                </button>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
};

export default FarmerDashboard;