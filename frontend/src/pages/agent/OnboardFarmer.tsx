import { useState } from 'react';
import { User, Phone, MapPin, Sprout, CheckCircle2, ChevronDown } from 'lucide-react';

const OnboardFarmer = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCaptureLocation = () => {
    setIsCapturing(true);
    // Simulate GPS fetch delay
    setTimeout(() => {
      setIsCapturing(false);
      setLocationCaptured(true);
    }, 1500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    // Reset after showing success screen
    setTimeout(() => setSuccess(false), 3000);
  };

  if (success) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-[#2E7D32]" />
        </div>
        <h2 className="text-2xl font-bold text-[#3E2723] mb-2 font-serif">Registration Successful!</h2>
        <p className="text-gray-500 mb-8">The farmer has been successfully added to the CropConnect USSD system.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="w-full py-4 bg-gray-100 text-[#3E2723] rounded-xl font-bold"
        >
          Register Another Farmer
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 relative">
      
      {/* HEADER */}
      <div className="bg-[#2E7D32] px-6 pt-10 pb-6 rounded-b-3xl text-white shadow-md flex-shrink-0">
        <h1 className="text-2xl font-bold font-serif">Onboard Farmer</h1>
        <p className="text-green-100 text-sm mt-1">Register for USSD access</p>
      </div>

      {/* FORM CONTENT */}
      <form onSubmit={handleRegister} className="px-6 py-6 space-y-6 flex-1 mb-20">
        
        {/* Personal Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                required
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-[17px] font-medium text-[#3E2723] focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all shadow-sm"
                placeholder="e.g. Jean-Baptiste N."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Phone Number (USSD ID)</label>
            <div className="flex gap-2">
              <div className="w-24 px-2 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-[17px] font-bold text-[#3E2723] flex items-center justify-center shadow-sm">
                +250
              </div>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                  type="tel" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-[17px] font-medium text-[#3E2723] focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all shadow-sm"
                  placeholder="788 123 456"
                />
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 ml-1 font-medium">This number will be used to receive SMS contracts.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Primary Crop</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Sprout className="w-5 h-5 text-[#2E7D32]" />
              </div>
              <select required className="w-full pl-12 pr-10 py-4 bg-white border border-gray-200 rounded-2xl text-[17px] font-medium text-[#3E2723] focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all shadow-sm appearance-none">
                <option value="" disabled selected>Select main crop</option>
                <option value="maize">Maize</option>
                <option value="beans">Beans</option>
                <option value="coffee">Coffee</option>
                <option value="sorghum">Sorghum</option>
                <option value="other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* GPS Location Capture */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Farm Location</label>
          
          {locationCaptured ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-center justify-between animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2E7D32] rounded-full flex items-center justify-center text-white">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-[#2E7D32] text-sm">Location Saved</p>
                  <p className="text-xs text-green-700 font-mono">-1.9441° S, 30.0619° E</p>
                </div>
              </div>
              <button type="button" onClick={() => setLocationCaptured(false)} className="text-xs font-bold text-green-700 underline">Retake</button>
            </div>
          ) : (
            <button 
              type="button"
              onClick={handleCaptureLocation}
              disabled={isCapturing}
              className="w-full relative h-32 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-70 overflow-hidden group"
            >
              {/* Abstract map pattern background */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #2E7D32 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
              
              <MapPin className={`w-8 h-8 ${isCapturing ? 'text-[#FBC02D] animate-bounce' : 'text-gray-400 group-hover:text-[#2E7D32] transition-colors'}`} />
              <span className="font-bold text-[#3E2723] relative z-10">
                {isCapturing ? 'Obtaining GPS...' : 'Capture Current GPS Location'}
              </span>
            </button>
          )}
        </div>

        {/* STICKY BOTTOM BUTTON */}
        <div className="fixed bottom-[72px] left-0 right-0 w-full max-w-[420px] mx-auto p-4 bg-gradient-to-t from-[#F9F7F3] via-[#F9F7F3] to-transparent pb-6 z-40 pointer-events-none">
          <button 
            type="submit"
            disabled={!locationCaptured}
            className="w-full py-4 bg-[#2E7D32] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-green-800 disabled:opacity-50 disabled:bg-gray-400 transition-all pointer-events-auto flex items-center justify-center gap-2"
          >
            <User className="w-5 h-5" /> Register Farmer
          </button>
        </div>

      </form>
    </div>
  );
};

export default OnboardFarmer;