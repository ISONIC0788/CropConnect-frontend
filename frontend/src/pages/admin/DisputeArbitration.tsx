import { useState } from 'react';
import { FileText, MessageSquare, Shield, Truck, Send, CheckCircle2, User } from 'lucide-react';

// --- EXACT MOCK DATA FROM IMAGES ---
const disputesData = [
  {
    id: 'TXN-20260381-0042',
    status: 'open',
    cropSummary: 'Maize — 2,500 kg',
    partiesSummary: 'Jean-Pierre Habimana — Kigali Fresh Exports Ltd.',
    amountSummary: '800,000 RWF',
    details: {
      filedDate: '2026-03-16',
      farmer: 'Jean-Pierre Habimana',
      farmerPhone: '+250788123456',
      buyer: 'Kigali Fresh Exports Ltd.',
      escrowStatus: 'Held',
      agent: 'David Mugisha',
      agentReport: 'On-site Inspection: 200kg found wet/damaged. Remaining 2,300kg meets Grade A. Recommend partial release at 92% value.',
    },
    audit: [
      { sender: 'CropConnect', time: '2026-03-01 09:15', text: 'Order TXN-20260301-0042 confirmed. 2,500kg Maize from Musanze. Buyer: Kigali Fresh Exports. Escrow: 800,000 RWF locked.' },
      { sender: 'Jean-Pierre', time: '2026-03-02 07:30', text: 'Ndashaka kumenya niba transport izaba iyihe? (When will transport arrive?)' },
      { sender: 'CropConnect', time: '2026-03-02 08:02', text: 'Transport dispatched from Kigali. ETA 2 hours to your location.' },
      { sender: 'CropConnect', time: '2026-03-02 13:45', text: 'Delivery received at buyer warehouse. Inspection in progress.' },
      { sender: 'Kigali Fresh', time: '2026-03-02 14:20', text: 'Quality issue: 200kg of the maize is wet/damaged. Requesting partial refund.' },
      { sender: 'CropConnect', time: '2026-03-02 14:25', text: 'DISPUTE OPENED. Escrow held pending arbitration. Agent David Mugisha notified.' },
      { sender: 'David Mugisha', time: '2026-03-03 08:00', text: 'Arriving at warehouse for re-inspection in 30 minutes.' },
      { sender: 'David Mugisha', time: '2026-03-03 10:45', text: 'Inspection complete. 200kg confirmed wet. 2,300kg Grade A. Report filed.' },
    ]
  },
  {
    id: 'TXN-20260305-0078',
    status: 'resolved',
    cropSummary: 'Maize — 3,000 kg',
    partiesSummary: 'Claudine Mukamana — Rwanda Grains Co.',
    amountSummary: '930,000 RWF',
    details: {
      filedDate: '2026-03-10',
      farmer: 'Claudine Mukamana',
      farmerPhone: '+250788456789',
      buyer: 'Rwanda Grains Co.',
      escrowStatus: 'Released',
      agent: 'Amara Ndayisaba',
      agentReport: 'Verified on-site. Actual weight: 2,810kg confirmed by calibrated scales. Discrepancy within acceptable tolerance after accounting for transport moisture loss.',
    },
    audit: [
      { sender: 'CropConnect', time: '2026-03-05 11:00', text: 'Order TXN-20260305-0078 confirmed. 3,000kg Maize. Escrow: 930,000 RWF.' },
      { sender: 'Rwanda Grains', time: '2026-03-06 16:45', text: 'Short delivery. Received 2,800kg instead of 3,000kg.' },
      { sender: 'CropConnect', time: '2026-03-06 16:50', text: 'DISPUTE OPENED. Agent Amara Ndayisaba dispatched for verification.' },
      { sender: 'Amara Ndayisaba', time: '2026-03-07 10:00', text: 'Verified on-site. Actual weight: 2,810kg. Scales confirmed.' },
      { sender: 'CropConnect', time: '2026-03-10 09:00', text: 'Dispute resolved. Adjusted payment: 871,100 RWF released to farmer.' },
    ]
  },
  {
    id: 'TXN-20260312-0091',
    status: 'escalated',
    cropSummary: 'Red Beans — 900 kg',
    partiesSummary: 'Aline Ingabire — Lake Kivu Trading',
    amountSummary: '612,000 RWF',
    details: {
      filedDate: '2026-03-18',
      farmer: 'Aline Ingabire',
      farmerPhone: '+250788890123',
      buyer: 'Lake Kivu Trading',
      escrowStatus: 'Held',
      agent: 'Diane Uwineza',
      agentReport: 'Both parties present conflicting evidence. Moisture meter readings at farmer site: 12.8%. At buyer warehouse: 15.1%. Potential moisture gain during transport. Escalating for admin review.',
    },
    audit: [
      { sender: 'CropConnect', time: '2026-03-12 08:30', text: 'Order TXN-20260312-0091 confirmed. 900kg Red Beans. Escrow: 612,000 RWF.' },
      { sender: 'CropConnect', time: '2026-03-13 06:00', text: 'Transport en route from Rubavu to Kigali.' },
      { sender: 'Lake Kivu Trading', time: '2026-03-14 13:00', text: 'Beans have high moisture content. 15.1% measured. Not market ready.' },
      { sender: 'Aline Ingabire', time: '2026-03-14 15:00', text: 'Ibinyamisogwe byanjye byari byumye neza. Ifoto yoherejwe kuri agent. (My beans were properly dried. Photos sent to agent.)' },
      { sender: 'Diane Uwineza', time: '2026-03-15 09:30', text: "Farmer's moisture reading: 12.8%. Buyer's reading: 15.1%. Discrepancy noted." },
      { sender: 'Diane Uwineza', time: '2026-03-16 11:30', text: 'Unable to resolve. Both parties disagree on quality. Escalating to admin.' },
      { sender: 'CropConnect', time: '2026-03-16 11:35', text: 'ESCALATED to Super Admin arbitration. Case DSP-003.' },
    ]
  }
];

// --- HELPER COMPONENTS ---

const StatusBadge = ({ status, className = "" }: { status: string, className?: string }) => {
  let styles = "";
  if (status === 'open' || status === 'Held') styles = "bg-yellow-100 text-yellow-800 border-yellow-200";
  else if (status === 'resolved' || status === 'Released') styles = "bg-green-100 text-green-800 border-green-200";
  else if (status === 'escalated') styles = "bg-red-100 text-red-800 border-red-200";
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles} ${className}`}>
      {status}
    </span>
  );
};

const DetailRow = ({ label, value, badge }: { label: string, value: string, badge?: string }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <div className="flex items-center gap-3">
      <span className="text-sm font-bold text-gray-800">{value}</span>
      {badge && <StatusBadge status={badge} />}
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const DisputeArbitration = () => {
  const [selectedId, setSelectedId] = useState<string>('TXN-20260312-0091'); // Default to the Red Beans dispute
  const dispute = disputesData.find(d => d.id === selectedId) || disputesData[0];

  return (
    <div className="h-full flex flex-col xl:flex-row gap-6">
      
      {/* COLUMN 1: DISPUTES LIST */}
      <div className="w-full xl:w-80 flex-shrink-0 flex flex-col h-full">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
          DISPUTES ({disputesData.length})
        </h3>
        
        <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar pb-6">
          {disputesData.map((d) => {
            const isSelected = d.id === selectedId;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedId(d.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isSelected 
                    ? 'bg-green-50/50 border-green-600 shadow-sm' 
                    : 'bg-white border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-900 text-sm">{d.id}</span>
                  <StatusBadge status={d.status} />
                </div>
                <div className="font-bold text-gray-800 text-sm mb-1">{d.cropSummary}</div>
                <div className="text-xs text-gray-500 mb-1 truncate">{d.partiesSummary}</div>
                <div className="text-xs text-gray-400 font-medium">{d.amountSummary}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* COLUMN 2: TRANSACTION DETAILS */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
          <h2 className="font-serif text-xl font-bold text-brown flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-primary" />
            Transaction Details
          </h2>
          
          <div className="mb-8">
            <DetailRow label="Order ID" value={dispute.id} />
            <DetailRow label="Filed Date" value={dispute.details.filedDate} />
            <DetailRow label="Farmer" value={dispute.details.farmer} />
            <DetailRow label="Farmer Phone" value={dispute.details.farmerPhone} />
            <DetailRow label="Buyer" value={dispute.details.buyer} />
            <DetailRow label="Crop" value={dispute.cropSummary} />
            <DetailRow label="Escrow" value={dispute.amountSummary} badge={dispute.details.escrowStatus} />
            <DetailRow label="Status" value={dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)} badge={dispute.status} />
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-gray-800">Agent Report — {dispute.details.agent}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {dispute.details.agentReport}
            </p>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 bg-white">
          <button className="flex-1 bg-[#166534] hover:bg-green-800 text-white px-4 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
            <Shield className="w-4 h-4" />
            Release Escrow to Farmer
          </button>
          <button className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
            <Truck className="w-4 h-4" />
            Refund Buyer
          </button>
          <button className="px-6 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
            <Send className="w-4 h-4" />
            Re-verify
          </button>
        </div>
      </div>

      {/* COLUMN 3: IMMUTABLE SMS AUDIT TRAIL */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-serif text-xl font-bold text-brown flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Immutable SMS Audit Trail
          </h2>
          <p className="text-xs text-gray-400 mt-1">Read-only · Africa's Talking Gateway</p>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-4 bg-gray-50/30">
          {dispute.audit.map((log, idx) => {
            // Determine background color based on sender exactly like the image
            let bgClass = "bg-gray-100/80 border-gray-200"; // Default (System/CropConnect)
            if (log.sender === 'Kigali Fresh' || log.sender === 'Rwanda Grains' || log.sender === 'Lake Kivu Trading') {
              bgClass = "bg-[#FFF9E6] border-[#FDE68A]"; // Light Yellow (Buyer)
            } else if (log.sender !== 'CropConnect') {
              bgClass = "bg-[#ECFDF5] border-[#A7F3D0]"; // Light Green (Farmer/Agent)
            }

            return (
              <div key={idx} className={`p-4 rounded-lg border ${bgClass}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-800">{log.sender}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500">{log.time}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {log.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default DisputeArbitration;