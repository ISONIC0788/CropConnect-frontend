import { useState } from 'react';
import { Camera, Check, X, AlertTriangle, ChevronLeft, Package, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const VerifyProduce = () => {
  const navigate = useNavigate();
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // State for our quality checklist toggles
  const [checks, setChecks] = useState({
    moisture: false,
    pests: false,
    color: false,
    bagging: false
  });

  // Helper to check if all criteria are met
  const allChecked = Object.values(checks).every(val => val === true);

  const handleToggle = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleValidate = () => {
    setSuccess(true);
    // Simulate redirecting back to dashboard after success
    setTimeout(() => {
      navigate('/agent');
    }, 2000);
  };

  if (success) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-[#2E7D32]" />
        </div>
        <h2 className="text-2xl font-bold text-[#3E2723] mb-2 font-serif">Verification Complete</h2>
        <p className="text-gray-500 mb-8">This batch has been certified and locked for the buyer.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300 relative pb-28">
      
      {/* HEADER WITH BACK BUTTON */}
      <div className="bg-[#2E7D32] px-4 pt-10 pb-6 rounded-b-3xl text-white shadow-md flex-shrink-0 flex items-center gap-3">
        <Link to="/agent" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-xl font-bold font-serif">Produce Verification</h1>
          <p className="text-green-100 text-xs mt-0.5">Task ID: VER-0941</p>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6 flex-1">
        
        {/* TASK DETAILS CARD */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#3E2723] text-[17px] leading-tight">500kg Maize (Grade A)</h3>
              <p className="text-sm text-gray-500 font-medium mt-0.5">Jean-Pierre Habimana</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Location</p>
              <p className="text-sm font-bold text-gray-800">Coop A, Musanze</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Target Price</p>
              <p className="text-sm font-bold text-[#2E7D32]">320 RWF/kg</p>
            </div>
          </div>
        </div>

        {/* PHOTO CAPTURE AREA */}
        <div>
          <h3 className="text-sm font-bold text-[#3E2723] mb-3 font-serif">1. Photographic Evidence</h3>
          
          {photoCaptured ? (
            <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80" 
                alt="Captured Produce" 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setPhotoCaptured(false)}
                className="absolute top-3 right-3 px-3 py-1.5 bg-black/50 backdrop-blur text-white text-xs font-bold rounded-lg"
              >
                Retake
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setPhotoCaptured(true)}
              className="w-full h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#2E7D32]">
                <Camera className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-600 text-sm">Tap to Take Photo</span>
            </button>
          )}
        </div>

        {/* QUALITY CHECKLIST */}
        <div>
          <h3 className="text-sm font-bold text-[#3E2723] mb-3 font-serif">2. Quality Checklist</h3>
          
          <div className="space-y-3">
            <ToggleRow 
              label="Moisture content is under 14%" 
              checked={checks.moisture} 
              onChange={() => handleToggle('moisture')} 
            />
            <ToggleRow 
              label="Free from visible pest damage" 
              checked={checks.pests} 
              onChange={() => handleToggle('pests')} 
            />
            <ToggleRow 
              label="Color and sizing are uniform" 
              checked={checks.color} 
              onChange={() => handleToggle('color')} 
            />
            <ToggleRow 
              label="Properly bagged and stored" 
              checked={checks.bagging} 
              onChange={() => handleToggle('bagging')} 
            />
          </div>
        </div>

      </div>

      {/* STICKY BOTTOM ACTIONS */}
      <div className="fixed bottom-[72px] left-0 right-0 w-full max-w-[420px] mx-auto p-4 bg-white border-t border-gray-100 z-40 flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        <button className="flex-1 py-4 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
          <X className="w-5 h-5" /> Reject
        </button>
        <button 
          onClick={handleValidate}
          disabled={!photoCaptured || !allChecked}
          className="flex-[2] py-4 bg-[#2E7D32] text-white rounded-xl font-bold text-sm shadow-md hover:bg-green-800 transition-colors disabled:opacity-50 disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" /> Mark Verified
        </button>
      </div>

    </div>
  );
};

// Custom Mobile-Style Toggle Component
const ToggleRow = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
  <div 
    className={`flex items-center justify-between p-4 rounded-xl border transition-colors cursor-pointer ${
      checked ? 'bg-green-50 border-[#2E7D32]' : 'bg-white border-gray-200'
    }`}
    onClick={onChange}
  >
    <span className={`text-sm font-bold ${checked ? 'text-[#2E7D32]' : 'text-gray-600'}`}>{label}</span>
    <div className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${checked ? 'bg-[#2E7D32]' : 'bg-gray-200'}`}>
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  </div>
);

export default VerifyProduce;