// src/pages/buyer/SourcingMap.tsx
import { useState } from 'react';
import { Search, Filter, MapPin, ChevronDown } from 'lucide-react';
import { cropListings } from '../../data/mockBuyerData';
import InventoryCard from '../../components/buyer/InventoryCard';

const SourcingMap = () => {
  const [radius, setRadius] = useState<number>(50);
  const [selectedCrop, setSelectedCrop] = useState<string>('All Crops');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Derived State: Filter the listings based on map criteria
  const filteredListings = cropListings.filter((listing) => {
    const matchesRadius = listing.distance <= radius;
    const matchesCrop = selectedCrop === 'All Crops' || listing.crop.includes(selectedCrop);
    const matchesSearch = 
      searchQuery === '' || 
      listing.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.farmer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesRadius && matchesCrop && matchesSearch;
  });

  // Calculate Bulk Aggregation Totals
  const selectedItems = cropListings.filter(l => selectedIds.includes(l.id));
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
          {/* Radius Filter */}
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

          {/* Crop Type Dropdown */}
          <div className="bg-white/95 backdrop-blur px-4 py-4 rounded-xl shadow-md border border-gray-100 flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500">Crop Type</span>
            <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 cursor-pointer bg-white">
              <span className="text-sm font-medium text-[#3E2723]">{selectedCrop}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Map Visualization (Abstract UI Representation) */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
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

          {/* Render Crop Pins dynamically based on filtered data */}
          {filteredListings.map((listing, i) => {
            const isSelected = selectedIds.includes(listing.id);
            // Distribute pins randomly in a circle for the mockup
            const angle = (i / filteredListings.length) * Math.PI * 2;
            const distanceScale = (listing.distance / 150) * 40; // Scale to map size
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
                  ${isSelected ? 'bg-[#FBC02D] border-white text-brown' : 
                    listing.verified ? 'bg-[#2E7D32] border-white text-white' : 'bg-gray-400 border-white text-white'}`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-4 py-3 rounded-xl shadow-sm border border-gray-100 flex gap-4 text-[11px] font-bold text-gray-500">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#2E7D32]"></span> Verified</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-400"></span> Unverified</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#FBC02D]"></span> Selected</div>
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
              placeholder="Search crops, farmers, districts..." 
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
          {filteredListings.map(listing => (
            <InventoryCard 
              key={listing.id}
              listing={listing}
              isSelected={selectedIds.includes(listing.id)}
              onToggle={() => toggleSelection(listing.id)}
            />
          ))}
          {filteredListings.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <MapPin className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p>No listings found. Try expanding your radius.</p>
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
          
          <button className="bg-[#2E7D32] hover:bg-green-800 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2">
            Place Bulk Bid & Lock Inventory
          </button>
        </div>
      )}

    </div>
  );
};

export default SourcingMap;