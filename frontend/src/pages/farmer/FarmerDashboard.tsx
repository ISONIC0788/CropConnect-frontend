import React, { useState, useEffect } from 'react';
import { Sprout, CheckCircle2, Clock, Banknote, Loader2, Package, Plus, X, Lock } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../../api/axiosClient';
import { toast } from 'sonner';

// Crop-type fallback images (used when no Cloudinary photo is available)
const getCropFallback = (cropType: string = '') => {
  const c = cropType.toLowerCase();
  if (c.includes('maize') || c.includes('corn')) return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80';
  if (c.includes('coffee')) return 'https://images.unsplash.com/photo-1524414139215-35c99f80112c?auto=format&fit=crop&w=400&q=80';
  if (c.includes('bean')) return 'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?auto=format&fit=crop&w=400&q=80';
  if (c.includes('potato')) return 'https://images.unsplash.com/photo-1508313880080-c4bef0730395?auto=format&fit=crop&w=400&q=80';
  if (c.includes('rice')) return 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=400&q=80';
  if (c.includes('cassava')) return 'https://images.unsplash.com/photo-1601987077677-5346c0982e0b?auto=format&fit=crop&w=400&q=80';
  if (c.includes('tomato')) return 'https://images.unsplash.com/photo-1546093931-0b5abe7ef66a?auto=format&fit=crop&w=400&q=80';
  return 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=400&q=80';
};

const FarmerDashboard = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Add Listing Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [addForm, setAddForm] = useState({ cropType: 'Maize', quantityKg: '', pricePerKg: '' });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) return;
      const decoded: any = jwtDecode(token);
      const farmerId = decoded.userId;

      // Direct calls to the backend endpoints
      const [myListingsRes, incomingBidsRes] = await Promise.all([
        axiosClient.get(`/listings/farmer/${farmerId}`),
        axiosClient.get(`/bids/farmer/${farmerId}`)
      ]);

      setListings(myListingsRes.data || []);
      setBids(incomingBidsRes.data || []);
    } catch (error) {
      console.error("Error loading farmer data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // CONNECT TO NATIVE WEBSOCKET FOR REAL-TIME OFFERS
    const ws = new WebSocket('ws://localhost:8080/api/ws/notifications');

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'BID_PLACED') {
          // Check if it's for this farmer
          const token = localStorage.getItem('jwt_token');
          if (token) {
            const decoded: any = jwtDecode(token);
            if (decoded.userId === payload.farmerId) {
              toast(`🔔 Live Offer! ${payload.buyerName} bid ${payload.amount} RWF`);
              fetchData(); // Instantly refresh
            }
          }
        }
      } catch (err) {
        console.error("WS Parse error", err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  // --- CRUD OPERATIONS ---

  const handleAddListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      const token = localStorage.getItem('jwt_token');
      if (!token) throw new Error("Not logged in");
      const decoded: any = jwtDecode(token);
      const farmerId = decoded.userId;

      // THE FIX: We must pass coordinates so the PostGIS database can plot it on the Buyer's map!
      // (Using Kigali coordinates so it shows up perfectly in the Buyer's 50km radius)
      const farmerLongitude = 30.0619;
      const farmerLatitude = -1.9441;

      // Create new listing with coordinates passed as query parameters
      await axiosClient.post(`/listings/farmer/${farmerId}?longitude=${farmerLongitude}&latitude=${farmerLatitude}`, {
        cropType: addForm.cropType,
        quantityKg: Number(addForm.quantityKg),
        pricePerKg: Number(addForm.pricePerKg),
        status: 'ACTIVE'
      });

      // Close modal and refresh data
      setIsAddModalOpen(false);
      setAddForm({ cropType: 'Maize', quantityKg: '', pricePerKg: '' });
      await fetchData();

    } catch (error) {
      console.error("Failed to add listing:", error);
      toast.error('Error adding harvest. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    if (!window.confirm("Accept this offer and lock your produce? This will secure the buyer's funds in escrow.")) return;

    setProcessingId(bidId);
    try {
      await axiosClient.put(`/bids/${bidId}/accept`);
      toast.success('Deal accepted! Your payment is secured in escrow.');
      await fetchData(); // Refresh inventory and bids so it shows as LOCKED
    } catch (err) {
      console.error("Failed to accept bid:", err);
      toast.error('Failed to accept bid. It may have expired.');
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
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#3E2723] font-serif">Farmer Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage harvests and incoming buyer offers</p>
        </div>
        <div className="bg-green-100 p-4 rounded-full">
          <Sprout className="w-8 h-8 text-[#2E7D32]" />
        </div>
      </div>

      {/* MY PRODUCE INVENTORY */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#3E2723] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#2E7D32]" /> Active Listings
          </h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#2E7D32] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> List Produce
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-gray-300 text-gray-400">
              No crops listed yet. Click "List Produce" to add your harvest.
            </div>
          ) : (
            listings.map(item => (
              <div key={item.listingId} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative">

                {/* Cloudinary crop image */}
                {item.verificationPhotoUrl ? (
                  <div className="relative h-36">
                    <img
                      src={item.verificationPhotoUrl}
                      alt={item.cropType}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getCropFallback(item.cropType);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-2 left-3 text-white text-xs font-bold">{item.cropType}</span>
                  </div>
                ) : (
                  <div className="h-28 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={getCropFallback(item.cropType)}
                      alt={item.cropType}
                      className="w-full h-full object-cover opacity-60"
                    />
                  </div>
                )}

                {/* Visual Status Bar */}
                <div className={`absolute top-0 left-0 w-1 h-full ${item.status === 'LOCKED' ? 'bg-blue-500' :
                    item.isVerified ? 'bg-[#2E7D32]' : 'bg-yellow-400'
                  }`}></div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-[#3E2723] text-lg">{item.quantityKg}kg {item.cropType}</h3>

                    {item.status === 'LOCKED' ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                        <Lock className="w-3 h-3" /> SECURED IN ESCROW
                      </span>
                    ) : item.isVerified ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED (LIVE)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-md border border-yellow-200">
                        <Clock className="w-3 h-3" /> PENDING AGENT
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-0.5">Asking Price</p>
                      <span className="text-[#2E7D32] font-bold">{item.pricePerKg.toLocaleString()} RWF/kg</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-0.5">Est. Total</p>
                      <span className="text-[#3E2723] font-bold">{(item.pricePerKg * item.quantityKg).toLocaleString()} RWF</span>
                    </div>
                  </div>
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
              <p>No active offers yet. Ensure your listings are verified by an agent!</p>
            </div>
          ) : (
            bids.filter(b => b.status === 'PENDING').map(bid => (
              <div key={bid.bidId} className="bg-white p-6 rounded-3xl border-2 border-green-100 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-bottom-2">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Offer from {bid.buyer?.fullName || 'Buyer'}</p>
                  <h4 className="text-2xl font-bold text-[#3E2723]">{bid.bidAmount.toLocaleString()} RWF</h4>
                  <p className="text-sm text-[#2E7D32] font-bold mt-1">For your {bid.listing?.quantityKg}kg {bid.listing?.cropType}</p>
                </div>

                <button
                  onClick={() => handleAcceptBid(bid.bidId)}
                  disabled={!!processingId}
                  className="bg-[#2E7D32] text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg"
                >
                  {processingId === bid.bidId ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Accept & Lock Escrow
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ADD LISTING MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#3E2723]/30 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in" onClick={() => setIsAddModalOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-[#3E2723] text-lg flex items-center gap-2">
                <Sprout className="w-5 h-5 text-[#2E7D32]" /> Add New Harvest
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 shadow-sm border border-gray-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddListing} className="p-6 space-y-5">

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Crop Type</label>
                <select
                  value={addForm.cropType}
                  onChange={(e) => setAddForm({ ...addForm, cropType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] bg-white shadow-sm"
                >
                  <option value="Maize">Maize</option>
                  <option value="Beans">Beans</option>
                  <option value="Coffee">Coffee</option>
                  <option value="Rice">Rice</option>
                  <option value="Potatoes">Potatoes</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={addForm.quantityKg}
                    onChange={(e) => setAddForm({ ...addForm, quantityKg: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] shadow-sm"
                    placeholder="e.g. 500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Price / kg (RWF)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={addForm.pricePerKg}
                    onChange={(e) => setAddForm({ ...addForm, pricePerKg: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] shadow-sm"
                    placeholder="e.g. 450"
                  />
                </div>
              </div>

              {/* Informational Callout */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 mt-2">
                <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <p className="text-xs text-yellow-800 leading-snug font-medium">
                  After listing, an agent must physically verify the quality of your produce before buyers can see it or place bids.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full py-3.5 bg-[#2E7D32] text-white rounded-xl font-bold hover:bg-green-800 transition-colors shadow-md flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Package className="w-5 h-5" />}
                  {isCreating ? 'Creating Listing...' : 'List Produce'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FarmerDashboard;