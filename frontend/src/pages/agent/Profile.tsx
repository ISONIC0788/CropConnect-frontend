import { useState, useEffect } from 'react';
import { Briefcase, Mail, Phone, MapPin, ShieldCheck, Edit3, Loader2, X, Eye, EyeOff, Lock, User, ClipboardList } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../../api/axiosClient';
import { toast } from 'sonner';

const AgentProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [stats, setStats] = useState({ verified: 0, disputes: 0, farmers: 0 });

  const openEditModal = () => {
    setEditForm({
      fullName: user?.fullName || '',
      phoneNumber: user?.phoneNumber || '',
      email: user?.email || '',
      address: user?.address || '',
      companyName: user?.companyName || '',        // used as "Agency Name"
      registrationNumber: user?.registrationNumber || '',
      defaultSearchRadius: user?.defaultSearchRadius || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const decoded: any = jwtDecode(localStorage.getItem('jwt_token') || '');
      await axiosClient.put(`/users/${decoded.userId}`, { ...editForm });
      const res = await axiosClient.get(`/users/${decoded.userId}`);
      setUser(res.data);
      setIsEditModalOpen(false);
      toast.success('Profile updated successfully!');
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
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (token) {
          const decoded: any = jwtDecode(token);
          const [userRes, listingsRes] = await Promise.all([
            axiosClient.get(`/users/${decoded.userId}`),
            axiosClient.get('/listings')
          ]);
          setUser(userRes.data);

          // Compute agent stats from all listings
          const allListings = listingsRes.data || [];
          const verified = allListings.filter((l: any) => l.isVerified).length;
          setStats({ verified, disputes: 0, farmers: new Set(allListings.map((l: any) => l.farmer?.userId)).size });
        }
      } catch (err) {
        console.error('Failed to fetch agent profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading profile...</div>;

  const joined = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—';

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      <p className="text-sm text-gray-500 -mt-2 mb-2">Manage your field agent profile and agency information</p>

      {/* HEADER CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#1565C0] to-[#42A5F5]"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-3xl font-black text-blue-600">
              {(user?.fullName || 'A').charAt(0).toUpperCase()}
            </div>
            <button onClick={openEditModal} className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-200 rounded-lg text-sm font-bold transition-colors">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-serif font-bold text-[#3E2723]">{user?.fullName || 'Agent'}</h2>
            {user?.isVerified && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" /> Certified Agent
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 font-medium">
            {user?.companyName ? `${user.companyName} · ` : ''}Field Agent · Member since {joined}
          </p>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Listings Verified', value: stats.verified, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Farmers Served', value: stats.farmers, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Disputes Mediated', value: stats.disputes, color: 'text-orange-600', bg: 'bg-orange-50' }
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl border border-gray-100 p-5 text-center`}>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs font-bold text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Agency Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h3 className="flex items-center gap-2 text-lg font-bold text-[#3E2723] mb-6">
              <Briefcase className="w-5 h-5 text-blue-600" /> Agency Information
            </h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Agency / Organization</p>
                <p className="text-sm font-bold text-gray-800">{user?.companyName || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Registration Number</p>
                <p className="text-sm font-bold text-gray-800">{user?.registrationNumber || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Coverage Radius</p>
                <p className="text-sm font-bold text-gray-800">{user?.defaultSearchRadius ? `${user.defaultSearchRadius} km` : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">System Role</p>
                <p className="text-sm font-bold text-gray-800">Field Agent</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Operating Address</p>
                <div className="flex items-start gap-2 text-sm font-bold text-gray-800">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  {user?.address || '—'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h3 className="flex items-center gap-2 text-lg font-bold text-[#3E2723] mb-4">
              <ClipboardList className="w-5 h-5 text-blue-600" /> Responsibilities
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {['Physically verify farmer produce quality on-site', 'Photograph and document produce condition', 'Onboard new farmers onto the CropConnect system', 'Mediate disputes between buyers and farmers'].map(r => (
                <li key={r} className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT: Contact */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-[#3E2723] mb-5">Contact Details</h3>
            <div className="space-y-4">
              {[
                { icon: <User className="w-4 h-4 text-blue-600" />, label: 'Full Name', value: user?.fullName },
                { icon: <Mail className="w-4 h-4 text-blue-600" />, label: 'Email', value: user?.email },
                { icon: <Phone className="w-4 h-4 text-blue-600" />, label: 'Phone Number', value: user?.phoneNumber },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">{item.icon}</div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.label}</p>
                    <p className="text-xs font-bold text-gray-800 truncate">{item.value || '—'}</p>
                  </div>
                </div>
              ))}
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
                <h3 className="font-bold text-[#3E2723] text-lg">Edit Agent Profile</h3>
                <p className="text-xs text-gray-400 mt-0.5">Fields specific to your field agent account</p>
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
                      <input type="text" required value={editForm.fullName} onChange={e => setEditForm({ ...editForm, fullName: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone *</label>
                      <input type="text" required value={editForm.phoneNumber} onChange={e => setEditForm({ ...editForm, phoneNumber: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                      <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} placeholder="agent@example.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Coverage Radius (km)</label>
                      <input type="text" value={editForm.defaultSearchRadius} onChange={e => setEditForm({ ...editForm, defaultSearchRadius: e.target.value })} placeholder="e.g. 25" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Operating Address</label>
                      <input type="text" value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} placeholder="e.g. Nyagatare District, Eastern Province" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                    </div>
                  </div>
                </div>

                {/* Agency */}
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">🏢 Agency Information</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Agency / Organization Name</label>
                      <input type="text" value={editForm.companyName} onChange={e => setEditForm({ ...editForm, companyName: e.target.value })} placeholder="e.g. Rwanda Agricultural Board" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Registration Number</label>
                      <input type="text" value={editForm.registrationNumber} onChange={e => setEditForm({ ...editForm, registrationNumber: e.target.value })} placeholder="e.g. RAB-2024-001" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 sticky bottom-0">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isSaving ? 'Saving...' : 'Save Agent Profile'}
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
                  <input type={showPassword ? "text" : "password"} required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Enter new password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-bold">Cancel</button>
                <button type="submit" disabled={isSaving || !newPassword} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold flex justify-center items-center gap-2 disabled:opacity-50">
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

export default AgentProfile;
