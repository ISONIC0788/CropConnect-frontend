import { useState } from 'react';
import { ChevronLeft, Scale, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const MediateDispute = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate API call and redirect back to dashboard
    setTimeout(() => {
      navigate('/agent');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-[#2E7D32]" />
        </div>
        <h2 className="text-2xl font-bold text-[#3E2723] mb-2 font-serif">Report Submitted</h2>
        <p className="text-gray-500 mb-8">Your field resolution report has been securely logged to the dispute file.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300 relative pb-6">
      
      {/* HEADER WITH BACK BUTTON */}
      <div className="bg-[#2E7D32] px-4 pt-10 pb-6 rounded-b-3xl text-white shadow-md flex-shrink-0 flex items-center gap-3">
        <Link to="/agent" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-xl font-bold font-serif">Dispute Mediation</h1>
          <p className="text-green-100 text-xs mt-0.5">Case ID: DSP-1092</p>
        </div>
      </div>

      <div className="px-5 py-6 flex-1 flex flex-col gap-6">
        
        {/* DISPUTE SUMMARY CARD */}
        <div className="bg-white rounded-2xl p-5 border border-red-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h3 className="font-bold text-red-600 text-sm uppercase tracking-wider">Quality Mismatch Flagged</h3>
          </div>

          <h4 className="font-bold text-[#3E2723] text-lg mb-1">800kg Coffee (Washed)</h4>
          <p className="text-sm text-gray-500 font-medium mb-4">Buyer: Kigali Fresh Ltd.</p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Escrow Locked</p>
              <p className="text-sm font-bold text-[#3E2723]">2,240,000 RWF</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Farmer</p>
              <p className="text-sm font-bold text-[#3E2723]">Marie-Claire U.</p>
            </div>
          </div>
        </div>

        {/* SMS AUDIT LOG (Mock USSD/SMS trail) */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#3E2723] mb-3 font-serif">
            <MessageSquare className="w-4 h-4 text-[#2E7D32]" /> SMS Contract Audit Log
          </h3>
          
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-4 h-48 overflow-y-auto shadow-inner">
            {/* System Message */}
            <div className="flex flex-col items-start max-w-[85%]">
              <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
                <p className="text-xs text-gray-700 leading-relaxed">CropConnect: Kigali Fresh offers 2800 RWF/kg for 800kg Coffee (Washed). Reply 1 to Accept, 2 to Reject.</p>
              </div>
              <span className="text-[9px] font-bold text-gray-400 mt-1 ml-1">System • Mar 14, 09:41 AM</span>
            </div>

            {/* Farmer Message */}
            <div className="flex flex-col items-end self-end max-w-[85%] ml-auto">
              <div className="bg-[#2E7D32] p-3 rounded-2xl rounded-tr-sm shadow-sm text-white">
                <p className="text-xs font-bold">1</p>
              </div>
              <span className="text-[9px] font-bold text-gray-400 mt-1 mr-1">Farmer • Mar 14, 10:05 AM</span>
            </div>

            {/* System Message */}
            <div className="flex flex-col items-start max-w-[85%]">
              <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
                <p className="text-xs text-gray-700 leading-relaxed">CropConnect: Contract locked. Agent will arrive within 48h for quality check. Ensure moisture is &lt;12%.</p>
              </div>
              <span className="text-[9px] font-bold text-gray-400 mt-1 ml-1">System • Mar 14, 10:06 AM</span>
            </div>
          </div>
        </div>

        {/* FIELD RESOLUTION REPORT */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#3E2723] mb-3 font-serif">
            <Scale className="w-4 h-4 text-[#2E7D32]" /> Field Resolution Report
          </h3>
          
          <textarea 
            required
            value={report}
            onChange={(e) => setReport(e.target.value)}
            className="w-full flex-1 min-h-[120px] p-4 bg-white border border-gray-200 rounded-2xl text-sm text-[#3E2723] focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all shadow-sm resize-none mb-4"
            placeholder="Detail your physical findings here. Explain why the buyer flagged this and what the actual quality is on the ground..."
          ></textarea>

          <button 
            type="submit"
            disabled={report.length < 10}
            className="w-full py-4 bg-[#2E7D32] text-white rounded-xl font-bold text-sm shadow-md hover:bg-green-800 transition-colors disabled:opacity-50 disabled:bg-gray-400"
          >
            Submit Resolution Report
          </button>
        </form>

      </div>
    </div>
  );
};

export default MediateDispute;