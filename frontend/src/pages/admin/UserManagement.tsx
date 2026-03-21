import { Search, Filter, Clock, CheckCircle2, XCircle, MoreHorizontal } from 'lucide-react';

// --- MOCK DATA ---
const usersData = [
  { id: 'USR-0001', name: 'Jean-Pierre Habimana', email: 'jp.habimana@mail.rw', role: 'Farmer', status: 'Verified', trustScore: 87, district: 'Musanze' },
  { id: 'USR-0002', name: 'Kigali Fresh Exports Ltd.', email: 'info@kigalifresh.rw', role: 'Buyer', status: 'Verified', trustScore: 94, district: 'Kigali' },
  { id: 'USR-0003', name: 'Emmanuel Nsengiyumva', email: 'e.nsengiyumva@mail.rw', role: 'Farmer', status: 'Pending', trustScore: 42, district: 'Nyagatare' },
  { id: 'USR-0004', name: 'David Mugisha', email: 'd.mugisha@cropconnect.rw', role: 'Agent', status: 'Verified', trustScore: 91, district: 'Musanze' },
  { id: 'USR-0005', name: 'Rwanda Grains Co.', email: 'contact@rwandagrains.rw', role: 'Buyer', status: 'Pending', trustScore: 68, district: 'Kigali' },
  { id: 'USR-0006', name: 'Claudine Mukamana', email: 'c.mukamana@mail.rw', role: 'Farmer', status: 'Verified', trustScore: 79, district: 'Rwamagana' },
  { id: 'USR-0007', name: 'Lake Kivu Trading', email: 'trade@lakekivu.rw', role: 'Buyer', status: 'Rejected', trustScore: 31, district: 'Rubavu' },
  { id: 'USR-0008', name: 'Amara Ndayisaba', email: 'a.ndayisaba@cropconnect.rw', role: 'Agent', status: 'Verified', trustScore: 88, district: 'Huye' },
];

// --- HELPER COMPONENTS ---

// 1. Status Badge Component
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

// 2. Trust Score Bar Component
const TrustScore = ({ score }: { score: number }) => {
  let colorClass = "bg-primary"; // Green for > 80
  if (score < 50) colorClass = "bg-red-500";
  else if (score < 80) colorClass = "bg-accent"; // Yellow for 50-79

  return (
    <div className="flex items-center gap-3 w-32">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${score}%` }}></div>
      </div>
      <span className="text-sm font-medium text-gray-600 w-6 text-right">{score}</span>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const UserManagement = () => {
  return (
    <div className="space-y-6">
      
      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        
        {/* Left Side: Search & Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, ID, email..." 
              className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 w-full no-scrollbar">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            
            {/* Role Filters */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-3 flex-shrink-0">
              <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-white cursor-pointer">All Roles</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer">Farmer</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer">Buyer</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer">Agent</button>
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-1 pl-1 flex-shrink-0">
              <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brown text-white cursor-pointer">All Status</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer">Verified</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer">Pending</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 cursor-pointer">Rejected</button>
            </div>
          </div>
        </div>

        {/* Right Side: Alert Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg flex-shrink-0">
          <Clock className="w-4 h-4 text-yellow-600" />
          <span className="text-xs font-bold text-yellow-700">5 Pending KYC</span>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                <th className="px-6 py-4 whitespace-nowrap">User ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Name / Company</th>
                <th className="px-6 py-4 whitespace-nowrap">Role</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap">Trust Score</th>
                <th className="px-6 py-4 whitespace-nowrap">District</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usersData.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono whitespace-nowrap">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-brown">{user.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200 text-gray-600 bg-white shadow-sm">
                      {user.role}
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
                    <button className="p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer rounded-lg hover:bg-green-50">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default UserManagement;