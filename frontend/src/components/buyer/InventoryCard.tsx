import { useState, useEffect } from 'react';
import { CheckCircle2, Zap, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { CropListing } from '../../data/mockBuyerData';

interface InventoryCardProps {
  listing: CropListing;
  isSelected: boolean;
  onToggle: () => void;
}

const InventoryCard = ({ listing, isSelected, onToggle }: InventoryCardProps) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const local = localStorage.getItem('watchlist_ids');
    if (local) {
      const savedIds = JSON.parse(local);
      setIsSaved(savedIds.includes(listing.id));
    }
  }, [listing.id]);

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const local = localStorage.getItem('watchlist_ids');
    let savedIds: string[] = local ? JSON.parse(local) : [];
    
    if (isSaved) {
      savedIds = savedIds.filter(id => id !== listing.id);
    } else {
      savedIds.push(listing.id);
    }
    
    localStorage.setItem('watchlist_ids', JSON.stringify(savedIds));
    setIsSaved(!isSaved);
    window.dispatchEvent(new Event('watchlistUpdated'));
  };
  // Placeholder images based on crop type
  const getImage = (crop: string) => {
    if (crop.toLowerCase().includes('maize')) return 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=300&q=80';
    if (crop.toLowerCase().includes('coffee')) return 'https://images.unsplash.com/photo-1524414139215-35c99f80112c?auto=format&fit=crop&w=300&q=80';
    if (crop.toLowerCase().includes('bean')) return 'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?auto=format&fit=crop&w=300&q=80';
    return 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=300&q=80';
  };

  return (
    <div 
      className={`bg-white rounded-xl border-2 transition-all duration-200 overflow-hidden flex h-40 cursor-pointer shadow-sm hover:shadow-md
      ${isSelected ? 'border-[#2E7D32] ring-1 ring-[#2E7D32]/20' : 'border-gray-100 hover:border-[#2E7D32]/40'}`}
      onClick={onToggle}
    >
      {/* Left Image Section with Absolute Badge */}
      <div className="relative w-1/3 min-w-[120px] h-full flex-shrink-0">
        <img 
          src={listing.imageUrl || getImage(listing.crop)} 
          alt={listing.crop} 
          className="w-full h-full object-cover bg-gray-100"
          onError={(e) => {
            // Fallback safely if image fails to load
            (e.target as HTMLImageElement).src = getImage(listing.crop);
          }}
        />
        {listing.verified && (
          <div className="absolute top-2 left-2 bg-[#FBC02D] text-[#3E2723] px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-sm">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </div>
        )}
      </div>

      {/* Right Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between relative">
        
        {/* Custom Checkbox (Top Right) */}
        <div className="absolute top-4 right-4">
          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
            ${isSelected ? 'bg-[#2E7D32] border-[#2E7D32]' : 'border-gray-300'}`}>
            {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
          </div>
        </div>

        {/* Header Info */}
        <div className="pr-8">
          <h3 className="font-serif font-bold text-lg text-[#3E2723] leading-tight">{listing.crop}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{listing.farmer} · {listing.district}</p>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Quantity</p>
            <p className="text-sm font-bold text-[#3E2723]">{listing.quantity.toLocaleString()} {listing.unit}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Price</p>
            <p className="text-sm font-bold text-[#2E7D32]">{listing.pricePerKg} RWF/kg</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Distance</p>
            <p className="text-sm font-bold text-[#3E2723]">{listing.distance}km</p>
          </div>
        </div>

        {/* Footer Info & Quick Bid */}
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <button 
              className="p-1 -ml-1 transition-transform active:scale-95"
              onClick={toggleWatchlist}
              title={isSaved ? "Remove from Watchlist" : "Save to Watchlist"}
            >
              <Star className={`w-5 h-5 transition-colors ${isSaved ? 'fill-[#FBC02D] text-[#FBC02D]' : 'text-gray-300 hover:text-[#FBC02D]'}`} />
            </button>
            <p className="text-[10px] text-gray-400">Listed 2026-03-15</p>
          </div>
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-[#2E7D32] border border-gray-200 hover:border-green-200 rounded-lg text-xs font-bold transition-colors"
            onClick={(e) => {
              e.stopPropagation(); // Prevents checking the card when clicking the button
              toast(`Quick bid opened for ${listing.crop} — select it and use Bulk Bid`);
            }}
          >
            <Zap className="w-3 h-3 fill-current" /> Quick Bid
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;