import { Building, Mail, Phone, MapPin, ShieldCheck, Edit3, Settings, Leaf } from 'lucide-react';

const Profile = () => {
  // --- MOCK DATA ---
  const companyInfo = {
    name: "Kigali Fresh Exports Ltd.",
    type: "Wholesale Buyer & Exporter",
    registration: "RDB-2023-8921",
    tin: "102938475",
    joined: "January 2024",
    address: "Warehouse 4, Kigali Special Economic Zone",
    email: "procurement@kigalifresh.rw",
    phone: "+250 788 123 456"
  };

  const preferences = {
    primaryCrops: ["Maize", "Coffee", "Red Beans"],
    defaultRadius: "50 km",
    volumeRequirement: "10,000+ kg / month"
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 flex flex-col h-full space-y-6">
      
      {/* PAGE HEADER SUBTITLE */}
      <div className="-mt-2 mb-2">
        <p className="text-sm text-gray-500 tracking-wide">Manage your company details and sourcing preferences</p>
      </div>

      {/* TOP BANNER & AVATAR */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-[#166534] to-[#2E7D32]"></div>
        
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1496200186978-f83d354b6d36?auto=format&fit=crop&w=150&q=80" 
                alt="Company Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-[#2E7D32] border border-gray-200 hover:border-green-200 rounded-lg text-sm font-bold transition-colors">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-serif font-bold text-[#3E2723]">{companyInfo.name}</h2>
              <span className="flex items-center gap-1 px-2.5 py-1 bg-[#FBC02D]/20 text-[#D97706] border border-[#FBC02D]/50 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" /> Verified Buyer
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium">{companyInfo.type} · Member since {companyInfo.joined}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Company Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h3 className="flex items-center gap-2 text-lg font-bold text-[#3E2723] mb-6">
              <Building className="w-5 h-5 text-[#2E7D32]" /> Company Information
            </h3>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Registration Number</p>
                <p className="text-sm font-bold text-gray-800">{companyInfo.registration}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Tax ID (TIN)</p>
                <p className="text-sm font-bold text-gray-800">{companyInfo.tin}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Registered Address</p>
                <div className="flex items-start gap-2 text-sm font-bold text-gray-800">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  {companyInfo.address}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h3 className="flex items-center gap-2 text-lg font-bold text-[#3E2723] mb-6">
              <Settings className="w-5 h-5 text-[#2E7D32]" /> Sourcing Preferences
            </h3>
            
            <div className="space-y-5">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Primary Crops of Interest</p>
                <div className="flex flex-wrap gap-2">
                  {preferences.primaryCrops.map(crop => (
                    <span key={crop} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-[#166534] border border-green-200 rounded-lg text-xs font-bold">
                      <Leaf className="w-3 h-3" /> {crop}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Default Search Radius</p>
                  <p className="text-sm font-bold text-gray-800">{preferences.defaultRadius}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Target Monthly Volume</p>
                  <p className="text-sm font-bold text-[#2E7D32]">{preferences.volumeRequirement}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Contact Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-[#3E2723] mb-5">Contact Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#2E7D32]" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address</p>
                  <p className="text-xs font-bold text-gray-800 truncate">{companyInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[#2E7D32]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone Number</p>
                  <p className="text-xs font-bold text-gray-800">{companyInfo.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;