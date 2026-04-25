import { useState, useEffect } from 'react';
import { Building, Mail, Phone, MapPin, ShieldCheck, Edit3, Settings, Leaf, Loader2, X, Eye, EyeOff, Lock } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../../api/axiosClient';
import { toast } from 'sonner';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editForm, setEditForm] = useState<any>({});
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const openEditModal = () => {
    setEditForm({
      companyName: user?.companyName || user?.fullName || '',
      registrationNumber: user?.registrationNumber || '',
      taxId: user?.taxId || '',
      address: user?.address || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      primaryCrops: user?.primaryCrops?.join(', ') || '',
      defaultSearchRadius: user?.defaultSearchRadius || '',
      targetMonthlyVolume: user?.targetMonthlyVolume || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const decoded: any = jwtDecode(localStorage.getItem('jwt_token') || '');
      const formattedCrops = editForm.primaryCrops.split(',').map((c: string) => c.trim()).filter(Boolean);
      
      const payload = {
         ...editForm,
         primaryCrops: formattedCrops
      };
      
      await axiosClient.put(`/users/${decoded.userId}`, payload);
      
      setIsEditModalOpen(false);
      toast.success('Profile updated successfully!');
      const decoded2: any = jwtDecode(localStorage.getItem('jwt_token') || '');
      const res = await axiosClient.get(`/users/${decoded2.userId}`);
      setUser(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const decoded: any = jwtDecode(localStorage.getItem('jwt_token') || '');
      await axiosClient.put(`/users/${decoded.userId}/password`, { newPassword });
      toast.success('Password changed successfully!');
      setIsPasswordModalOpen(false);
      setNewPassword('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (token) {
          const decoded: any = jwtDecode(token);
          const response = await axiosClient.get(`/users/${decoded.userId}`);
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  }

  // --- MERGED DATA: Backend + Fallback Mock ---
  const companyInfo = {
    name: user?.companyName || user?.fullName || "Kigali Fresh Exports Ltd.",
    type: user?.role === 'BUYER' ? "Wholesale Buyer" : "Wholesale Buyer & Exporter",
    registration: user?.registrationNumber || "RDB-2023-8921",
    tin: user?.taxId || "102938475",
    joined: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "January 2024",
    address: user?.address || "Warehouse 4, Kigali Special Economic Zone",
    email: user?.email || "procurement@kigalifresh.rw",
    phone: user?.phoneNumber || "0788459217"
  };

  const preferences = {
    primaryCrops: user?.primaryCrops?.length ? user.primaryCrops : ["Maize", "Coffee", "Red Beans"],
    defaultRadius: user?.defaultSearchRadius || "50 km",
    volumeRequirement: user?.targetMonthlyVolume || "10,000+ kg / month"
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 flex flex-col flex-1 space-y-6 overflow-y-visible">
      
      {/* PAGE HEADER SUBTITLE */}
      <div className="-mt-2 mb-2">
        <p className="text-sm text-gray-500 tracking-wide">Manage your company details and sourcing preferences</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative shrink-0">
        <div className="h-32 bg-gradient-to-r from-[#166534] to-[#2E7D32]"></div>
        
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(companyInfo.name)}&background=166534&color=fff&size=150`}
                alt="Company Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <button 
              onClick={openEditModal}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-[#2E7D32] border border-gray-200 hover:border-green-200 rounded-lg text-sm font-bold transition-colors"
            >
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
                  {preferences.primaryCrops.map((crop: string) => (
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

            <div className="mt-4 pt-4 border-t border-gray-100">
              <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-bold transition-colors"
              >
                <Lock className="w-4 h-4 text-gray-500" /> Change Password
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#3E2723]/30 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in" onClick={() => setIsEditModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <h3 className="font-bold text-[#3E2723] text-lg">Edit Company Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-6 flex-1">
              <div>
                <h4 className="font-bold text-[#3E2723] mb-4 text-sm border-b pb-2">Business Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Company Name</label>
                    <input type="text" value={editForm.companyName} onChange={e => setEditForm({...editForm, companyName: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Registered Address</label>
                    <input type="text" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Registration Number</label>
                    <input type="text" value={editForm.registrationNumber} onChange={e => setEditForm({...editForm, registrationNumber: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tax ID (TIN)</label>
                    <input type="text" value={editForm.taxId} onChange={e => setEditForm({...editForm, taxId: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#3E2723] mb-4 text-sm border-b pb-2">Sourcing Preferences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Primary Crops (comma separated)</label>
                    <input type="text" value={editForm.primaryCrops} onChange={e => setEditForm({...editForm, primaryCrops: e.target.value})} placeholder="e.g. Maize, Coffee, Red Beans" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Default Search Radius</label>
                    <input type="text" value={editForm.defaultSearchRadius} onChange={e => setEditForm({...editForm, defaultSearchRadius: e.target.value})} placeholder="e.g. 50 km" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Target Monthly Volume</label>
                    <input type="text" value={editForm.targetMonthlyVolume} onChange={e => setEditForm({...editForm, targetMonthlyVolume: e.target.value})} placeholder="e.g. 10,000+ kg / month" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#3E2723] mb-4 text-sm border-b pb-2">Contact Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                    <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                    <input type="text" value={editForm.phoneNumber} onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20" required />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-[#2E7D32] text-white rounded-lg font-bold hover:bg-green-800 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PASSWORD CHANGE MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-[#3E2723]/30 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-[#3E2723] text-lg">Change Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">New Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2E7D32]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving || !newPassword} className="flex-1 px-4 py-2.5 bg-[#2E7D32] text-white rounded-lg font-bold hover:bg-green-800 flex justify-center items-center gap-2 transition-colors disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;