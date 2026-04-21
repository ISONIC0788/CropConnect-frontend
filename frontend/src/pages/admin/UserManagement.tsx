import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, CheckCircle2, XCircle, Trash2, Edit2, Loader2, X, Plus, Eye, EyeOff } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

// --- HELPER COMPONENTS ---
const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'Verified') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
      </span>
    );
  }
  if (status === 'Pending') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
        <Clock className="w-3.5 h-3.5" /> Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
      <XCircle className="w-3.5 h-3.5" /> Rejected
    </span>
  );
};

const TrustScore = ({ score }: { score: number }) => {
  let colorClass = "bg-[#2E7D32]"; 
  if (score < 50) colorClass = "bg-red-500";
  else if (score < 80) colorClass = "bg-[#FBC02D]"; 

  return (
    <div className="flex items-center gap-3 w-32">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${score}%` }}></div>
      </div>
      <span className="text-sm font-medium text-gray-600 w-6 text-right">{score}</span>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', phoneNumber: '', role: '' });

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [addForm, setAddForm] = useState({ fullName: '', phoneNumber: '', password: '', role: 'FARMER' });
  const [showAddPassword, setShowAddPassword] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/users');
      
      const mappedUsers = response.data.map((u: any) => {
        let displayDistrict = 'Rwanda';
        if (typeof u.location === 'string') {
            displayDistrict = u.location;
        } else if (typeof u.district === 'string') {
            displayDistrict = u.district;
        }

        return {
            id: u.userId,
            displayId: `USR-${(u.userId || '').substring(0, 4).toUpperCase()}`,
            name: u.fullName || 'Unknown User',
            phone: u.phoneNumber || '',
            email: u.email || 'No email provided',
            role: u.role ? u.role.toUpperCase() : 'UNKNOWN',
            displayRole: u.role ? u.role.charAt(0) + u.role.slice(1).toLowerCase() : 'Unknown',
            status: u.isVerified ? 'Verified' : 'Pending',
            trustScore: u.isVerified ? 85 : 42,
            district: displayDistrict
        };
      });

      setUsers(mappedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD OPERATIONS ---

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      await axiosClient.post('/users/register', {
        fullName: addForm.fullName,
        phoneNumber: addForm.phoneNumber,
        passwordHash: addForm.password, // Backend hashes this
        role: addForm.role
      });
      
      // Refresh the table to get the new user with their assigned ID
      await fetchUsers();
      
      setIsAddModalOpen(false);
      setAddForm({ fullName: '', phoneNumber: '', password: '', role: 'FARMER' });
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Error creating user. Check if the phone number already exists.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      setIsVerifying(userId);
      await axiosClient.put(`/users/${userId}/verify`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Verified', trustScore: 85 } : u));
    } catch (error) {
      console.error("Failed to verify user:", error);
      alert("Error verifying user.");
    } finally {
      setIsVerifying(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      setIsDeleting(userId);
      await axiosClient.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Error deleting user.");
    } finally {
      setIsDeleting(null);
    }
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.name,
      phoneNumber: user.phone,
      role: user.role
    });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setIsUpdating(true);
      await axiosClient.put(`/users/${editingUser.id}`, {
        fullName: editForm.fullName,
        phoneNumber: editForm.phoneNumber,
        role: editForm.role
      });

      // Update local state instantly
      setUsers(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { 
              ...u, 
              name: editForm.fullName, 
              phone: editForm.phoneNumber, 
              role: editForm.role,
              displayRole: editForm.role.charAt(0) + editForm.role.slice(1).toLowerCase()
            } 
          : u
      ));
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Error updating user.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Apply Filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.displayId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.displayRole === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const pendingCount = users.filter(u => u.status === 'Pending').length;

  return (
    <div className="space-y-6 relative">
      
      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        
        {/* Left Side: Search & Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, contact..." 
              className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] bg-gray-50 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 w-full no-scrollbar">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            
            {/* Role Filters */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-3 flex-shrink-0">
              {['All', 'Farmer', 'Buyer', 'Agent', 'Admin'].map(role => (
                <button 
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer ${
                    roleFilter === role ? 'font-bold bg-[#2E7D32] text-white' : 'font-medium text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {role === 'All' ? 'All Roles' : role}
                </button>
              ))}
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-1 pl-1 flex-shrink-0">
              {['All', 'Verified', 'Pending', 'Rejected'].map(status => (
                <button 
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer ${
                    statusFilter === status ? 'font-bold bg-[#3E2723] text-white' : 'font-medium text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status === 'All' ? 'All Status' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Alert Badge & Add User Button */}
        <div className="flex items-center gap-3 flex-shrink-0 w-full xl:w-auto justify-end">
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-bold text-yellow-700">{pendingCount} Pending</span>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-[#2E7D32] hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px] relative">
        
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-[#2E7D32]">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="font-bold">Syncing users...</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                <th className="px-6 py-4 whitespace-nowrap">User ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Name / Contact</th>
                <th className="px-6 py-4 whitespace-nowrap">Role</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap">Trust Score</th>
                <th className="px-6 py-4 whitespace-nowrap">District</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    No users match your filters.
                  </td>
                </tr>
              )}
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono whitespace-nowrap">
                    {user.displayId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-[#3E2723]">{user.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200 text-gray-600 bg-white shadow-sm">
                      {user.displayRole}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TrustScore score={user.trustScore} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {user.district}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.status === 'Pending' && (
                        <button 
                          onClick={() => handleVerifyUser(user.id)}
                          disabled={isVerifying === user.id}
                          title="Verify User"
                          className="p-1.5 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                          {isVerifying === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      )}
                      
                      <button 
                        onClick={() => openEditModal(user)}
                        title="Edit User"
                        className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={isDeleting === user.id}
                        title="Delete User"
                        className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer rounded-lg disabled:opacity-50"
                      >
                        {isDeleting === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD NEW USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#3E2723]/30 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-[#3E2723] text-lg">Add New User</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={addForm.fullName}
                  onChange={(e) => setAddForm({...addForm, fullName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
                  placeholder="e.g. Jean-Pierre Habimana"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                <input 
                  type="text" 
                  required
                  value={addForm.phoneNumber}
                  onChange={(e) => setAddForm({...addForm, phoneNumber: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
                  placeholder="e.g. 0780000000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Temporary Password</label>
                <div className="relative">
                  <input 
                    type={showAddPassword ? "text" : "password"} 
                    required
                    value={addForm.password}
                    onChange={(e) => setAddForm({...addForm, password: e.target.value})}
                    className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
                    placeholder="Enter initial password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddPassword(!showAddPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showAddPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">System Role</label>
                <select 
                  value={addForm.role}
                  onChange={(e) => setAddForm({...addForm, role: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] bg-white"
                >
                  <option value="FARMER">Farmer</option>
                  <option value="BUYER">Buyer</option>
                  <option value="AGENT">Agent</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="flex-1 px-4 py-2.5 bg-[#2E7D32] text-white rounded-lg font-bold hover:bg-green-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isCreating ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-[#3E2723]/30 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-[#3E2723] text-lg">Edit User Details</h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                <input 
                  type="text" 
                  required
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">System Role</label>
                <select 
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/20 focus:border-[#2E7D32] bg-white"
                >
                  <option value="FARMER">Farmer</option>
                  <option value="BUYER">Buyer</option>
                  <option value="AGENT">Agent</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2.5 bg-[#2E7D32] text-white rounded-lg font-bold hover:bg-green-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagement;