import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, ChevronDown, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import InventoryCard from '../../components/buyer/InventoryCard';
import { buyerService } from '../../api/buyerService';
import axiosClient from '../../api/axiosClient';

// The shape that InventoryCard expects
export interface FrontendCropListing {
  id: string;
  crop: string;
  grade: string;
  quantity: number;
  unit: string;
  pricePerKg: number;
  farmer: string;
  district: string;
  distance: number;
  verified: boolean;
  coordinates: { lat: number; lng: number };
}

// Utility to calculate real distance between two GPS coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return Math.round(R * c); // Distance in km, rounded to whole number
}

// Hardcoded Warehouse Location (Kigali, Rwanda)
const WAREHOUSE_LAT = -1.9441;
const WAREHOUSE_LNG = 30.0619;

const SourcingMap = () => {
  const navigate = useNavigate();
  const [radius, setRadius] = useState<number>(50);
  const [selectedCrop, setSelectedCrop] = useState<string>('All Crops');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Real Data State
  const [listings, setListings] = useState<FrontendCropListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBidding, setIsBidding] = useState(false);

  useEffect(() => {
    const fetchRealData = async () => {
      setLoading(true);
      try {
        // Construct query parameters for the backend filter endpoint
        const params: any = {
          longitude: WAREHOUSE_LNG,
          latitude: WAREHOUSE_LAT,
          radiusKm: radius
        };

        if (selectedCrop !== 'All Crops') {
          params.cropType = selectedCrop;
        }

        // Call the filter endpoint
        const response = await axiosClient.get('/listings/filter', { params });
        const backendData: any[] = response.data;
        
        // Map backend data to the frontend structure
        const mappedData: FrontendCropListing[] = backendData
          .filter(item => item.isVerified && item.status === 'ACTIVE') // Buyers only see verified stuff!
          .map(item => ({
            id: item.listingId,
            crop: item.cropType,
            grade: "Standard", // Defaulting grade since it's not in DB yet
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
            // Calculate distance dynamically from the Warehouse
            distance: item.location ? 
              calculateDistance(WAREHOUSE_LAT, WAREHOUSE_LNG, item.location.latitude, item.location.longitude) 
              : 0
          }));
          
        setListings(mappedData);
      } catch (error) {
        console.error("Failed to load filtered listings:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the API call so we don't spam the server while dragging the slider
    const delayDebounceFn = setTimeout(() => {
      fetchRealData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [radius, selectedCrop]); // Re-fetch automatically when radius or crop changes

  // THE FIX: The function that handles the Bulk Bid button click
  const handlePlaceBulkBid = async () => {
    if (selectedIds.length === 0) return;
    setIsBidding(true);

    try {
      // 1. Get the current logged-in Buyer's ID from the JWT token
      const token = localStorage.getItem('jwt_token');
      if (!token) throw new Error("Not logged in");
      const decoded: any = jwtDecode(token);
      const buyerId = decoded.userId;

      // 2. Loop through every selected item and place a bid for its full asking price
      const bidPromises = selectedItems.map(item => {
        // We will bid the exact asking price (pricePerKg * quantity)
        const totalBidAmount = item.pricePerKg * item.quantity;
        return buyerService.placeBid(item.id, buyerId, totalBidAmount);
      });

      // 3. Wait for all bids to hit the Spring Boot backend
      await Promise.all(bidPromises);

      // 4. Success! Redirect the buyer to their Escrow Wallet to see the locked funds
      alert("Bids placed successfully! Redirecting to your Escrow Wallet.");
      navigate('/buyer/wallet');

    } catch (error) {
      console.error("Failed to place bulk bids:", error);
      alert("Error placing bids. Make sure you are logged in as a Buyer.");
    } finally {
      setIsBidding(false);
    }
  };

  // Derived State: Filter the listings based on map criteria
  // Only search query remains here since crop and radius are handled by backend
  const filteredListings = listings.filter((listing) => {
    return searchQuery === '' || 
      listing.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.farmer.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate Bulk Aggregation Totals
  const selectedItems = listings.filter(l => selectedIds.includes(l.id));
  const totalVolume = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = selectedItems.reduce((sum, item) => sum + (item.quantity * item.pricePerKg), 0);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex h-full gap-6 relative">
      
      {/* LEFT PANE: Interactive Sourcing Map */}
      <div className="w-full lg:w-7/12 rounded-xl border border-gray-200 overflow-hidden relative shadow-sm flex flex-col bg-[#F0FDF4]">
        
        {/* Floating Top Controls */}
        <div className="absolute top-4 left-4 right-4 z-10 flex gap-4">
          <div className="bg-white/95 backdrop-blur px-6 py-4 rounded-xl shadow-md border border-gray-100 flex-1 flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-500 font-bold text-sm min-w-[120px]">
              <Filter className="w-4 h-4 text-[#2E7D32]" /> Radius Filter
            </div>
            <input 
              type="range" 
              min="10" max="150" step="5"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FBC02D]"
              style={{
                background: `linear-gradient(to right, #2E7D32 ${(radius - 10) / 140 * 100}%, #e5e7eb ${(radius - 10) / 140 * 100}%)`
              }}
            />
            <span className="font-bold text-[#2E7D32] min-w-[50px]">{radius}km</span>
          </div>

          <div className="bg-white/95 backdrop-blur px-4 py-4 rounded-xl shadow-md border border-gray-100 flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500">Crop Type</span>
            <select 
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 cursor-pointer bg-white text-sm font-medium text-[#3E2723] outline-none"
            >
              <option value="All Crops">All Crops</option>
              <option value="Maize">Maize</option>
              <option value="Beans">Beans</option>
              <option value="Coffee">Coffee</option>
            </select>
          </div>
        </div>

        {/* Map Visualization (Abstract UI Representation) */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center text-[#2E7D32]">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="font-bold font-serif">Scanning Real-time Satellites...</p>
            </div>
          ) : (
            <>
              {/* Radar Circles */}
              <div className="absolute border border-[#2E7D32]/20 rounded-full w-[300px] h-[300px] flex items-center justify-center">
                <div className="absolute border border-[#2E7D32]/30 rounded-full w-[150px] h-[150px]"></div>
              </div>

              {/* Central Warehouse Pin */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-[#2E7D32] shadow-md border border-green-100 mb-1">
                  Your Warehouse
                </div>
                <div className="w-4 h-4 bg-[#2E7D32] rounded-full ring-4 ring-green-100 shadow-lg"></div>
              </div>

              {/* Render Real Crop Pins */}
              {filteredListings.map((listing, i) => {
                const isSelected = selectedIds.includes(listing.id);
                // Distribute pins randomly in a circle based on their distance
                const angle = (i / filteredListings.length) * Math.PI * 2;
                const distanceScale = (listing.distance / 150) * 40; // Scale to map visual size
                const top = `calc(50% + ${Math.sin(angle) * distanceScale}%)`;
                const left = `calc(50% + ${Math.cos(angle) * distanceScale}%)`;

                return (
                  <div 
                    key={listing.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 z-20"
                    style={{ top, left }}
                    onClick={() => toggleSelection(listing.id)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 
                      ${isSelected ? 'bg-[#FBC02D] border-white text-brown' : 'bg-[#2E7D32] border-white text-white'}`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Inventory Feed */}
      <div className="w-full lg:w-5/12 flex flex-col h-full bg-[#F9F7F3] rounded-xl border-l border-gray-200 pl-6 pb-[100px]">
        
        {/* Search and Stats */}
        <div className="mb-6">
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search crops, farmers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] bg-white shadow-sm"
            />
          </div>
          <div className="text-sm text-[#3E2723]">
            <span className="font-bold">{filteredListings.length}</span> listings within <span className="font-bold text-[#2E7D32]">{radius}km</span>
          </div>
        </div>

        {/* Scrollable Feed */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar">
          {loading ? (
            <p className="text-center text-gray-500 mt-10 animate-pulse">Loading inventory...</p>
          ) : (
            filteredListings.map(listing => (
              <InventoryCard 
                key={listing.id}
                listing={listing}
                isSelected={selectedIds.includes(listing.id)}
                onToggle={() => toggleSelection(listing.id)}
              />
            ))
          )}
          {!loading && filteredListings.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <MapPin className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p>No verified listings found. Wait for agents to verify more produce or expand your radius!</p>
            </div>
          )}
        </div>
      </div>

      {/* STICKY BOTTOM PANEL: Bulk Aggregation */}
      {selectedIds.length > 0 && (
        <div className="absolute bottom-6 left-1/2 lg:left-[calc(50%+130px)] transform -translate-x-1/2 w-[90%] max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 flex items-center justify-between z-50 animate-in slide-in-from-bottom-5">
          <div className="flex gap-8">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Items</p>
              <p className="text-xl font-bold text-[#3E2723]">{selectedIds.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Aggregated Volume</p>
              <p className="text-xl font-bold text-[#3E2723]">{totalVolume.toLocaleString()} kg</p>
            </div>
            <div className="pl-8 border-l border-gray-100">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Est. Total Cost</p>
              <p className="text-xl font-bold text-[#2E7D32]">{totalCost.toLocaleString()} RWF</p>
            </div>
          </div>
          
          <button 
            onClick={handlePlaceBulkBid}
            disabled={isBidding}
            className="bg-[#2E7D32] hover:bg-green-800 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBidding ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isBidding ? 'Placing Bids...' : 'Place Bulk Bid & Lock Inventory'}
          </button>
        </div>
      )}

    </div>
  );
};

export default SourcingMap;