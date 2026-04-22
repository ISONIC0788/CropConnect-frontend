import { useState, useEffect } from 'react';
import { FileText, MessageSquare, Shield, Truck, Send, CheckCircle2, User, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

// --- MAIN COMPONENT ---
const DisputeArbitration = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosClient.get('/orders');
        // Filter down to interesting ones for the Admin Panel (e.g. at least locked/escrowed)
        const relevantOrders = res.data.filter((o: any) => o.escrowStatus !== 'PENDING');
        setOrders(relevantOrders);
        if (relevantOrders.length > 0) {
          setSelectedId(relevantOrders[0].orderId);
        }
      } catch (err) {
        console.error('Failure fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Fetch Audit Logs when selection changes
  useEffect(() => {
    if (!selectedId) return;
    const fetchLogs = async () => {
      try {
        const res = await axiosClient.get(`/audit-logs/entity/${selectedId}`);
        setAuditLogs(res.data);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      }
    };
    fetchLogs();
  }, [selectedId]);

  const selectedOrder = orders.find(o => o.orderId === selectedId);

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

// --- HELPER COMPONENTS ---

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-green-700" /></div>;
  }

  return (
    <div className="h-full flex flex-col xl:flex-row gap-6">
      
      {/* COLUMN 1: DISPUTES LIST */}
      <div className="w-full xl:w-80 flex-shrink-0 flex flex-col h-full">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
          SYSTEM ORDERS ({orders.length})
        </h3>
        
        <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar pb-6">
          {orders.map((o) => {
            const isSelected = o.orderId === selectedId;
            return (
              <button
                key={o.orderId}
                onClick={() => setSelectedId(o.orderId)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isSelected 
                    ? 'bg-green-50/50 border-green-600 shadow-sm' 
                    : 'bg-white border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-900 text-[10px] break-all max-w-[80%] uppercase">{o.orderId}</span>
                </div>
                <div className="font-bold text-gray-800 text-sm mb-1">{o.listing?.quantityKg}kg {o.listing?.cropType}</div>
                <div className="text-xs text-gray-500 mb-1 truncate">{o.listing?.farmer?.fullName} — {o.buyer?.fullName}</div>
                <div className="text-xs text-[#2E7D32] font-semibold">{o.finalAmount?.toLocaleString()} RWF</div>
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
          
          {selectedOrder ? (
            <>
              <div className="mb-8">
                <DetailRow label="Order ID" value={selectedOrder.orderId} />
                <DetailRow label="Created Date" value={new Date(selectedOrder.createdAt).toLocaleDateString()} />
                <DetailRow label="Farmer" value={selectedOrder.listing?.farmer?.fullName} />
                <DetailRow label="Farmer Phone" value={selectedOrder.listing?.farmer?.phoneNumber} />
                <DetailRow label="Buyer" value={selectedOrder.buyer?.fullName} />
                <DetailRow label="Crop" value={`${selectedOrder.listing?.cropType} (${selectedOrder.listing?.quantityKg}kg)`} />
                <DetailRow label="Escrow" value={`${selectedOrder.finalAmount?.toLocaleString()} RWF`} badge={selectedOrder.escrowStatus} />
                <DetailRow label="Logistics" value={selectedOrder.logisticsStatus} />
              </div>

              <div className="bg-gray-50 rounded-lg border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-gray-800">Agent Verification Photo</span>
                </div>
                {selectedOrder.listing?.verificationPhotoUrl ? (
                  <div className="relative">
                    <img 
                      src={selectedOrder.listing.verificationPhotoUrl}
                      alt="Agent Verification Evidence"
                      className="w-full h-52 object-cover rounded-xl border border-gray-200 shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextSibling && ((e.target as HTMLImageElement).nextSibling as HTMLElement).classList.remove('hidden');
                      }}
                    />
                    <p className="hidden text-sm text-gray-500 italic mt-2 text-center">Image failed to load.</p>
                    <a
                      href={selectedOrder.listing.verificationPhotoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 px-3 py-1.5 bg-black/60 text-white text-xs font-bold rounded-lg backdrop-blur-sm hover:bg-black/80 transition-colors"
                    >
                      View Full ↗
                    </a>
                  </div>
                ) : (
                  <div className="h-32 bg-gray-100 rounded-xl border border-dashed border-gray-300 flex items-center justify-center">
                    <p className="text-sm text-gray-400 italic">No verification photo on file.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-400">Select an order to view details.</p>
          )}
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
          {auditLogs.length === 0 && <p className="text-gray-400">No logs discovered.</p>}
          {auditLogs.map((log: any) => {
            let bgClass = "bg-gray-100/80 border-gray-200"; // Default
            if (log.actionType.includes("ESCROW")) bgClass = "bg-[#FFF9E6] border-[#FDE68A]";
            else if (log.actionType.includes("BID")) bgClass = "bg-[#ECFDF5] border-[#A7F3D0]";

            return (
              <div key={log.auditId} className={`p-4 rounded-lg border flex flex-col gap-1 ${bgClass}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-gray-800">{log.actionType}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-mono mt-1">
                  {log.details}
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