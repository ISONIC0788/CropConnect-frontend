import { Clock, Shield, CheckCircle2, Truck, Package, ArrowRight } from 'lucide-react';

// --- MOCK DATA ---
const pipelineStages = [
  { id: 'pending', label: 'Pending Acceptance', icon: <Clock className="w-6 h-6" />, color: 'text-gray-500', count: 1 },
  { id: 'locked', label: 'Inventory Locked', icon: <Shield className="w-6 h-6" />, color: 'text-[#FBC02D]', count: 1 },
  { id: 'quality', label: 'Quality Check', icon: <CheckCircle2 className="w-6 h-6" />, color: 'text-[#3498DB]', count: 1 },
  { id: 'transit', label: 'In Transit', icon: <Truck className="w-6 h-6" />, color: 'text-[#2E7D32]', count: 1 },
  { id: 'delivered', label: 'Delivered', icon: <Package className="w-6 h-6" />, color: 'text-[#166534]', count: 1 }
];

const mockOrders = [
  {
    id: 'ORD-0042',
    crop: 'Maize (Grade A)',
    status: 'In Transit',
    stageIndex: 3, // 0-indexed corresponding to pipelineStages
    farmer: 'Jean-Pierre Habimana',
    district: 'Musanze',
    amount: '800,000 RWF',
    weight: '2,500 kg',
    date: '2026-03-18',
    statusBadge: 'bg-green-50 text-[#2E7D32]'
  },
  {
    id: 'ORD-0045',
    crop: 'Coffee (Washed)',
    status: 'Quality Check',
    stageIndex: 2,
    farmer: 'Marie-Claire Uwimana',
    district: 'Huye',
    amount: '2,240,000 RWF',
    weight: '800 kg',
    date: '2026-03-17',
    statusBadge: 'bg-blue-50 text-[#3498DB]'
  },
  {
    id: 'ORD-0048',
    crop: 'Red Beans',
    status: 'Locked',
    stageIndex: 1,
    farmer: 'Aline Ingabire',
    district: 'Rubavu',
    amount: '612,000 RWF',
    weight: '900 kg',
    date: '2026-03-19',
    statusBadge: 'bg-[#FFF9E6] text-[#FBC02D]'
  },
  {
    id: 'ORD-0051',
    crop: 'Maize',
    status: 'Delivered',
    stageIndex: 4,
    farmer: 'Claudine Mukamana',
    district: 'Rwamagana',
    amount: '930,000 RWF',
    weight: '3,000 kg',
    date: '2026-03-14',
    statusBadge: 'bg-green-100 text-[#166534]'
  },
  {
    id: 'ORD-0053',
    crop: 'Sorghum',
    status: 'Pending',
    stageIndex: 0,
    farmer: 'Vestine Nyiraneza',
    district: 'Ngoma',
    amount: '810,000 RWF',
    weight: '1,200 kg',
    date: '2026-03-20',
    statusBadge: 'bg-gray-100 text-gray-500'
  }
];

// --- MAIN COMPONENT ---
const ActiveOrders = () => {
  return (
    <div className="max-w-6xl mx-auto pb-12 flex flex-col h-full space-y-6">
      
      {/* PAGE HEADER SUBTITLE */}
      <div className="-mt-2 mb-2">
        <p className="text-sm text-gray-500 tracking-wide">Track your purchases through the pipeline</p>
      </div>

      {/* TOP PIPELINE SUMMARY BAR */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5 flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
        {pipelineStages.map((stage, idx) => (
          <div key={stage.id} className="flex items-center min-w-max">
            
            {/* Stage Info: Icon on left, Text stacked on right */}
            <div className={`flex items-center gap-3 ${stage.color}`}>
              <div>{stage.icon}</div>
              <div className="flex flex-col justify-center">
                <span className="text-[13px] font-bold mb-0.5">{stage.label}</span>
                <span className="text-xl font-bold leading-none">{stage.count}</span>
              </div>
            </div>
            
            {/* Arrow Separator */}
            {idx < pipelineStages.length - 1 && (
              <div className="mx-6 text-gray-200">
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ORDER CARDS LIST */}
      <div className="flex-1 space-y-4">
        {mockOrders.map(order => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            
            {/* Top Info Row */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-[17px] text-[#3E2723]">{order.crop}</h3>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${order.statusBadge}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium">{order.farmer} · {order.district}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">{order.id}</p>
                <p className="font-bold text-[#2E7D32] text-lg">{order.amount}</p>
              </div>
            </div>

            {/* Segmented Pipeline Progress Bar (Thin style from image) */}
            <div className="flex gap-2 mb-4">
              {[0, 1, 2, 3, 4].map(segmentIndex => {
                const isFilled = segmentIndex <= order.stageIndex;
                return (
                  <div 
                    key={segmentIndex} 
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${isFilled ? 'bg-[#2E7D32]' : 'bg-gray-100'}`}
                  ></div>
                );
              })}
            </div>

            {/* Bottom Info Row */}
            <div className="flex justify-between items-center text-xs font-bold text-gray-400 mt-2">
              <p>{order.weight}</p>
              <p>Ordered {order.date}</p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default ActiveOrders;