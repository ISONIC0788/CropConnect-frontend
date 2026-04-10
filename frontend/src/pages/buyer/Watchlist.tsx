import React, { useState, useEffect } from 'react';
import { Star, Search, Trash2, ShoppingCart, Loader2, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import InventoryCard from '../../components/buyer/InventoryCard';
import axiosClient from '../../api/axiosClient';

const Watchlist = () => {
  const navigate = useNavigate();
  
  // Real Data State
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const local = localStorage.getItem('watchlist_ids');
    return local ? JSON.parse(local) : []; // Empty by default unless saved previously
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBidding, setIsBidding] = useState(false);
  const [marketTrends, setMarketTrends] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch real listings
        const response = await axiosClient.get('/listings');
        const backendData: any[] = response.data;
        
        // Map backend data to the frontend structure
        const mappedData = backendData
          .filter(item => item.isVerified && item.status === 'ACTIVE')
          .map(item => ({
            id: item.listingId,
            crop: item.cropType,
            grade: "Standard",
            quantity: item.quantityKg,
            unit: "kg",
            pricePerKg: item.pricePerKg,
            farmer: item.farmer?.fullName || "Registered Farmer",
            district: "Rwanda", 
            verified: item.isVerified,
            coordinates: {
              lat: item.location?.latitude || 0,
              lng: item.location?.longitude || 0
            },
            distance: 0 // Not needed for watchlist
          }));
          
        setListings(mappedData);

        // 2. Fetch Market Trends for crops currently in the watchlist
        const savedCrops = mappedData.filter(l => savedIds.includes(l.id)).map(l => l.crop);
        const uniqueCrops = [...new Set(savedCrops)];
        
        const trends: Record<string, number> = {};
        for (const crop of uniqueCrops) {
          try {
            const trendRes = await axiosClient.get(`/listings/market-price`, { params: { cropType: crop, days: 30 } });
            if (trendRes.data && trendRes.data.averagePrice) {
              trends[crop] = trendRes.data.averagePrice;
            }
          } catch (e) {
            console.error(`Failed to fetch trend for ${crop}`, e);
          }
        }
        setMarketTrends(trends);

      } catch (error) {
        console.error("Failed to fetch watchlist data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [savedIds]); // Re-fetch trends if items are added/removed

  // Sync saved items to local storage
  useEffect(() => {
    localStorage.setItem('watchlist_ids', JSON.stringify(savedIds));
  }, [savedIds]);

  // Derived State: Filter the saved listings based on search query
  const savedListings = listings.filter(listing => 
    savedIds.includes(listing.id) &&
    (searchQuery === '' || 
     listing.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
     listing.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
     listing.farmer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const removeSelected = () => {
    setSavedIds(prev => prev.filter(id => !selectedIds.includes(id)));
    setSelectedIds([]); // Clear selection after removing
  };

  const handlePlaceBulkBid = async () => {
    if (selectedIds.length === 0) return;
    setIsBidding(true);

    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) throw new Error("Not logged in");
      const decoded: any = jwtDecode(token);
      const buyerId = decoded.userId;

      const bidPromises = selectedItems.map(item => {
        const totalBidAmount = item.pricePerKg * item.quantity;
        return axiosClient.post(`/bids/listing/${item.id}/buyer/${buyerId}`, { bidAmount: totalBidAmount });
      });

      await Promise.all(bidPromises);
      alert("Bids placed successfully! Redirecting to your Escrow Wallet.");
      navigate('/buyer/wallet');
      removeSelected(); // Clear them from watchlist since they are now orders
    } catch (error) {
      console.error("Failed to place bulk bids:", error);
      alert("Error placing bids. Make sure you are logged in as a Buyer.");
    } finally {
      setIsBidding(false);
    }
  };

  // Calculate totals for the selected items
  const selectedItems = listings.filter(l => selectedIds.includes(l.id));
  const totalVolume = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = selectedItems.reduce((sum, item) => sum + (item.quantity * item.pricePerKg), 0);

  return (
    <div className="flex flex-col h-full relative pb-24">
      
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#3E2723] flex items-center gap-2">
            <Star className="w-6 h-6 text-[#FBC02D] fill-current" />
            Saved Inventory
          </h2>
          <p className="text-sm text-gray-500 mt-1 mb-2">
            You have <span className="font-bold text-[#2E7D32]">{savedIds.length}</span> items in your watchlist.
          </p>
          
          {/* Dynamic Market Trends Badges */}
          {Object.keys(marketTrends).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 animate-in fade-in">
              {Object.entries(marketTrends).map(([crop, price]) => (
                <span key={crop} className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-[#3498DB] border border-blue-100">
                  <TrendingUp className="w-3 h-3" />
                  {crop} Market Avg: {price.toLocaleString()} RWF/kg
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search saved crops..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Grid Layout for Watchlist Items */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-[#2E7D32]">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <p className="font-bold">Syncing your watchlist...</p>
        </div>
      ) : savedListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedListings.map(listing => (
            <InventoryCard 
              key={listing.id}
              listing={listing}
              isSelected={selectedIds.includes(listing.id)}
              onToggle={() => toggleSelection(listing.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Star className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#3E2723] mb-2">Your watchlist is empty</h3>
          <p className="text-gray-500 max-w-md">
            Click the star icon on crops from the Sourcing Map to save them here for quick tracking and bidding!
          </p>
        </div>
      )}

      {/* STICKY BOTTOM PANEL: Bulk Actions (Appears only when items are selected) */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 lg:left-[calc(50%+130px)] transform -translate-x-1/2 w-[90%] max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 flex flex-col sm:flex-row items-center justify-between z-50 animate-in slide-in-from-bottom-5 gap-4">
          
          <div className="flex gap-6 md:gap-8 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Selected</p>
              <p className="text-lg md:text-xl font-bold text-[#3E2723]">{selectedIds.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Volume</p>
              <p className="text-lg md:text-xl font-bold text-[#3E2723]">{totalVolume.toLocaleString()} kg</p>
            </div>
            <div className="pl-6 md:pl-8 border-l border-gray-100">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Est. Total</p>
              <p className="text-lg md:text-xl font-bold text-[#2E7D32]">{totalCost.toLocaleString()} RWF</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={removeSelected}
              disabled={isBidding}
              className="flex-1 sm:flex-none bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline">Remove</span>
            </button>
            <button 
              onClick={handlePlaceBulkBid}
              disabled={isBidding}
              className="flex-1 sm:flex-none bg-[#2E7D32] hover:bg-green-800 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBidding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
              {isBidding ? 'Placing Bids...' : 'Bid on Selected'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default Watchlist;