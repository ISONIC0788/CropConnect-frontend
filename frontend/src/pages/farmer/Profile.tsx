import { useState, useEffect } from 'react';
import { Sprout, Mail, Phone, MapPin, ShieldCheck, Edit3, Leaf, Loader2, X, Eye, EyeOff, Lock, User } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../../api/axiosClient';
import { toast } from 'sonner';

const FarmerProfile = () => {
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
      fullName: user?.fullName || '',
      phoneNumber: user?.phoneNumber || '',
      email: user?.email || '',
      address: user?.address || '',
      companyName: user?.companyName || '',        // used as "Farm Name"
      primaryCrops: user?.primaryCrops?.join(', ') || '',
      defaultSearchRadius: user?.defaultSearchRadius || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const decoded: any = jwtDecode(localStorage.getItem('jwt_token') || '');
      await axiosClient.put(`/users/${decoded.userId}`, {
        ...editForm,
        primaryCrops: editForm.primaryCrops
          ? editForm.primaryCrops.split(',').map((c: string) => c.trim()).filter(Boolean)
          : null
      });
      const res = await axiosClient.get(`/users/${decoded.userId}`);
      setUser(res.data);
      setIsEditModalOpen(false);
      toast.success('Farm profile updated successfully!');
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
          const res = await axiosClient.get(`/users/${decoded.userId}`);
          setUser(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch farmer profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading profile...</div>;

  const crops: string[] = user?.primaryCrops?.length ? user.primaryCrops : [];
  const joined = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—';

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      <p className="text-sm text-gray-500 -mt-2 mb-2">Manage your farm profile and produce preferences</p>

      {/* HEADER CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A]"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-3xl font-black text-[#2E7D32]">
              {(user?.fullName || 'F').charAt(0).toUpperCase()}
            </div>
            <button onClick={openEditModal} className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-[#2E7D32] border border-gray-200 hover:border-green-200 rounded-lg text-sm font-bold transition-colors">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-serif font-bold text-[#3E2723]">{user?.fullName || 'Farmer'}</h2>
            {user?.isVerified && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-[#FBC02D]/20 text-[#D97706] border border-[#FBC02D]/50 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" /> Verified Farmer
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 font-medium">
            {user?.companyName ? `${user.companyName} · ` : ''}Member since {joined}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Farm Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h3 className="flex items-center gap-2 text-lg font-bold text-[#3E2723] mb-6">
              <Sprout className="w-5 h-5 text-[#2E7D32]" /> Farm Information
            </h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Farm / Business Name</p>
                <p className="text-sm font-bold text-gray-800">{user?.companyName || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Default Search Radius</p>
                <p className="text-sm font-bold text-gray-800">{user?.defaultSearchRadius ? `${user.defaultSearchRadius} km` : '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Farm Address</p>
                <div className="flex items-start gap-2 text-sm font-bold text-gray-800">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  {user?.address || '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Primary Crops */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h3 className="flex items-center gap-2 text-lg font-bold text-[#3E2723] mb-6">
              <Leaf className="w-5 h-5 text-[#2E7D32]" /> Crops I Grow
            </h3>
            {crops.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {crops.map((crop: string) => (
                  <span key={crop} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-[#166534] border border-green-200 rounded-lg text-xs font-bold">
                    <Leaf className="w-3 h-3" /> {crop}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No primary crops added yet. Edit your profile to add crops you grow.</p>
            )}
          </div>
        </div>

        {/* RIGHT: Contact */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-[#3E2723] mb-5">Contact Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-[#2E7D32]" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Full Name</p>
                  <p className="text-xs font-bold text-gray-800 truncate">{user?.fullName || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#2E7D32]" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email</p>
                  <p className="text-xs font-bold text-gray-800 truncate">{user?.email || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[#2E7D32]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone Number</p>
                  <p className="text-xs font-bold text-gray-800">{user?.phoneNumber || '—'}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button onClick={() => setIsPasswordModalOpen(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-bold transition-colors">
                <Lock className="w-4 h-4 text-gray-500" /> Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#3E2723]/30 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-[#3E2723] text-lg">Edit Farm Profile</h3>
                <p className="text-xs text-gray-400 mt-0.5">Fields specific to your farmer account</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto no-scrollbar">
              <div className="p-6 space-y-6">
                {/* Identity */}
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">👤 Identity</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name *</label>
                      <input type="text" required value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number *</label>
                      <input type="text" required value={editForm.phoneNumber} onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                      <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} placeholder="your@email.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Farm / Business Name</label>
                      <input type="text" value={editForm.companyName} onChange={e => setEditForm({...editForm, companyName: e.target.value})} placeholder="e.g. Habimana Farm" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Farm Address</label>
                      <input type="text" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} placeholder="e.g. Musanze District, Northern Province" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]" />
                    </div>
                  </div>
                </div>

                {/* Farm Operations */}
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">🌱 Farm Operations</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Crops I Grow <span className="font-normal text-gray-400 normal-case">(comma separated)</span></label>
                      <input type="text" value={editForm.primaryCrops} onChange={e => setEditForm({...editForm, primaryCrops: e.target.value})} placeholder="e.g. Maize, Beans, Coffee, Potatoes" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Default Search Radius (km)</label>
                      <input type="text" value={editForm.defaultSearchRadius} onChange={e => setEditForm({...editForm, defaultSearchRadius: e.target.value})} placeholder="e.g. 30" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 sticky bottom-0">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 px-4 py-2.5 bg-[#2E7D32] text-white rounded-lg font-bold hover:bg-green-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isSaving ? 'Saving...' : 'Save Farm Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-[#3E2723]/30 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-[#3E2723] text-lg">Change Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">New Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20" placeholder="Enter new password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2E7D32]">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors">Cancel</button>
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

export default FarmerProfile;
