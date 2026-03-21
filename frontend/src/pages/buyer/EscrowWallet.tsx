import { Wallet, Clock, ShieldAlert, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// --- MOCK DATA ---
const transactions = [
  {
    id: 'TXN-0042',
    description: '2,500kg Maize - Musanze',
    amount: '800,000 RWF',
    status: 'Dispute Open',
    type: 'dispute'
  },
  {
    id: 'TXN-0078',
    description: '3,000kg Maize - Rwamagana',
    amount: '871,100 RWF',
    status: 'Released',
    type: 'released'
  },
  {
    id: 'TXN-0091',
    description: '900kg Red Beans - Rubavu',
    amount: '612,000 RWF',
    status: 'Pending Release',
    type: 'pending'
  },
  {
    id: 'TXN-0102',
    description: '800kg Coffee - Huye',
    amount: '2,240,000 RWF',
    status: 'Pending Release',
    type: 'pending'
  },
  {
    id: 'TXN-0098',
    description: '1,800kg Sorghum - Ngoma',
    amount: '810,000 RWF',
    status: 'Released',
    type: 'released'
  }
];

// --- HELPER COMPONENT FOR ICONS & BADGES ---
const getStatusStyles = (type: string) => {
  switch (type) {
    case 'released':
      return {
        icon: <ArrowUpRight className="w-5 h-5 text-[#166534]" />,
        iconBg: 'bg-green-50',
        badge: 'text-[#166534] border-[#166534] bg-transparent'
      };
    case 'dispute':
      return {
        icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
        iconBg: 'bg-red-50',
        badge: 'text-red-500 border-red-300 bg-transparent'
      };
    case 'pending':
    default:
      return {
        icon: <ArrowDownRight className="w-5 h-5 text-[#F59E0B]" />,
        iconBg: 'bg-yellow-50',
        badge: 'text-[#D97706] border-[#FCD34D] bg-transparent'
      };
  }
};

// --- MAIN COMPONENT ---
const EscrowWallet = () => {
  return (
    <div className="max-w-4xl mx-auto pb-12 flex flex-col h-full">
      
      {/* PAGE HEADER SUBTITLE */}
      <div className="-mt-2 mb-6">
        <p className="text-sm text-gray-500 tracking-wide">Manage your secured payments</p>
      </div>

      {/* TOP GREEN BALANCE CARD */}
      <div className="bg-[#166534] rounded-2xl shadow-sm p-8 mb-8 text-white">
        
        <div className="flex items-center gap-3 text-green-50 font-medium mb-6">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm tracking-wide">Escrow Balance</span>
        </div>
        
        <h2 className="text-5xl font-extrabold font-sans mb-8 tracking-tight">
          4,523,100 RWF
        </h2>
        
        <div className="flex items-center gap-8 border-t border-green-800/60 pt-5">
          <div className="flex items-center gap-2 text-sm font-medium text-green-100">
            <Clock className="w-4 h-4 opacity-90" />
            <span>2 pending releases</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-green-100">
            <ShieldAlert className="w-4 h-4 opacity-90" />
            <span>1 held for dispute</span>
          </div>
        </div>

      </div>

      {/* RECENT TRANSACTIONS LIST */}
      <div>
        <h3 className="font-extrabold text-[17px] text-[#3E2723] mb-4">Recent Transactions</h3>
        
        <div className="space-y-4">
          {transactions.map((txn, index) => {
            const styles = getStatusStyles(txn.type);
            
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5 flex items-center justify-between hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                {/* Left Side: Icon & Details */}
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${styles.iconBg}`}>
                    {styles.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#3E2723] text-[15px]">{txn.id}</h4>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{txn.description}</p>
                  </div>
                </div>

                {/* Right Side: Amount & Pill Badge */}
                <div className="flex flex-col items-end gap-2">
                  <p className="font-bold text-[#3E2723] text-[15px] leading-none">{txn.amount}</p>
                  <span className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${styles.badge}`}>
                    {txn.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default EscrowWallet;