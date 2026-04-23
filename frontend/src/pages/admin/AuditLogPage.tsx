import { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, RefreshCw, Loader2, CheckCircle2, AlertTriangle, Package, Gavel, CreditCard } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

// ── Colour/icon mapping per action type ──────────────────────────────────────
const ACTION_META: Record<string, { color: string; bg: string; border: string; icon: any }> = {
  BID_PLACED:        { color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   icon: <Gavel className="w-4 h-4" /> },
  BID_ACCEPTED:      { color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  icon: <CheckCircle2 className="w-4 h-4" /> },
  LISTING_CREATED:   { color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', icon: <Package className="w-4 h-4" /> },
  QUALITY_VERIFIED:  { color: 'text-teal-700',   bg: 'bg-teal-50',   border: 'border-teal-200',   icon: <ShieldCheck className="w-4 h-4" /> },
  ESCROW_HELD:       { color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200',  icon: <CreditCard className="w-4 h-4" /> },
  ESCROW_RELEASED:   { color: 'text-emerald-700',bg: 'bg-emerald-50',border: 'border-emerald-200',icon: <CreditCard className="w-4 h-4" /> },
  PAYMENT_VERIFIED:  { color: 'text-cyan-700',   bg: 'bg-cyan-50',   border: 'border-cyan-200',   icon: <CreditCard className="w-4 h-4" /> },
  ORDER_DELIVERED:   { color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: <CheckCircle2 className="w-4 h-4" /> },
  USER_REGISTERED:   { color: 'text-rose-700',   bg: 'bg-rose-50',   border: 'border-rose-200',   icon: <AlertTriangle className="w-4 h-4" /> },
};

const DEFAULT_META = { color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200', icon: <ShieldCheck className="w-4 h-4" /> };

const ACTION_TYPES = [
  'ALL',
  'BID_PLACED',
  'BID_ACCEPTED',
  'LISTING_CREATED',
  'QUALITY_VERIFIED',
  'ESCROW_HELD',
  'ESCROW_RELEASED',
  'PAYMENT_VERIFIED',
  'ORDER_DELIVERED',
  'USER_REGISTERED',
];

const ENTITY_TYPES = ['ALL', 'Listing', 'Order', 'Bid', 'User'];

// ── Component ─────────────────────────────────────────────────────────────────
const AuditLogPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [filterEntity, setFilterEntity] = useState('ALL');

  const fetchLogs = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await axiosClient.get('/audit-logs?size=500');
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = logs.filter(log => {
    const matchAction = filterAction === 'ALL' || log.actionType === filterAction;
    const matchEntity = filterEntity === 'ALL' || log.entityType === filterEntity;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      log.actionType?.toLowerCase().includes(q) ||
      log.entityType?.toLowerCase().includes(q) ||
      log.details?.toLowerCase().includes(q) ||
      log.entityId?.toLowerCase().includes(q);
    return matchAction && matchEntity && matchSearch;
  });

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalToday = logs.filter(l => {
    const d = new Date(l.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const bidCount      = logs.filter(l => l.actionType === 'BID_PLACED').length;
  const escrowCount   = logs.filter(l => l.actionType?.includes('ESCROW')).length;


  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-[#166534] gap-3 font-bold animate-pulse">
        <Loader2 className="w-6 h-6 animate-spin" />
        Loading Audit Trail...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">

      {/* ── STATS ROW ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: logs.length,    sub: 'All time',     color: 'bg-[#166534]', text: 'text-white' },
          { label: 'Events Today', value: totalToday,     sub: 'Since midnight',color: 'bg-white',    text: 'text-[#3E2723]' },
          { label: 'Bids Tracked', value: bidCount,       sub: 'BID_PLACED',   color: 'bg-white',    text: 'text-[#3E2723]' },
          { label: 'Escrow Moves', value: escrowCount,    sub: 'HELD + RELEASED',color:'bg-white',    text: 'text-[#3E2723]' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-5 border border-gray-200 shadow-sm`}>
            <p className={`text-xs font-bold uppercase tracking-widest ${s.color === 'bg-[#166534]' ? 'text-green-200' : 'text-gray-400'} mb-2`}>{s.label}</p>
            <p className={`text-3xl font-extrabold ${s.text}`}>{s.value}</p>
            <p className={`text-xs mt-1 ${s.color === 'bg-[#166534]' ? 'text-green-300' : 'text-gray-400'}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── FILTERS ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by action, entity ID, details..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-gray-50"
          />
        </div>

        {/* Action type filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/20 cursor-pointer"
          >
            {ACTION_TYPES.map(t => <option key={t} value={t}>{t === 'ALL' ? 'All Actions' : t}</option>)}
          </select>
        </div>

        {/* Entity type filter */}
        <select
          value={filterEntity}
          onChange={e => setFilterEntity(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#166534]/20 cursor-pointer"
        >
          {ENTITY_TYPES.map(t => <option key={t} value={t}>{t === 'ALL' ? 'All Entities' : t}</option>)}
        </select>

        {/* Refresh */}
        <button
          onClick={() => fetchLogs(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-[#166534] hover:bg-green-800 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── LOG LIST ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col min-h-[500px]">
        {/* Header - Desktop only */}
        <div className="hidden md:grid grid-cols-[180px_100px_1fr_180px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-[11px] font-black text-gray-400 uppercase tracking-widest">
          <span>Action Type</span>
          <span>Entity</span>
          <span>Log Details</span>
          <span className="text-right">Timestamp</span>
        </div>

        {/* Scrollable rows */}
        <div className="overflow-y-auto flex-1 no-scrollbar">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-10" />
              <p className="font-medium text-sm">No audit events match your filters.</p>
            </div>
          ) : (
            filtered.map((log, idx) => {
              const meta = ACTION_META[log.actionType] || DEFAULT_META;
              return (
                <div
                  key={log.logId || idx}
                  className="flex flex-col md:grid md:grid-cols-[180px_100px_1fr_180px] gap-3 md:gap-4 px-4 md:px-6 py-4 border-b border-gray-50 hover:bg-gray-50/70 transition-colors animate-in fade-in slide-in-from-bottom-1"
                >
                  {/* Action Badge & Timestamp (Mobile) */}
                  <div className="flex justify-between items-center md:block">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-tight ${meta.bg} ${meta.color} ${meta.border}`}>
                      {meta.icon}
                      <span className="truncate max-w-[120px]">{log.actionType}</span>
                    </div>
                    <div className="md:hidden text-right">
                      <p className="text-[10px] font-bold text-gray-500">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Entity type */}
                  <div className="flex items-center gap-2 md:block">
                    <span className="text-[10px] font-black text-gray-400 uppercase md:hidden">Entity:</span>
                    <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                      {log.entityType || 'SYSTEM'}
                    </span>
                    <p className="hidden md:block text-[10px] text-gray-400 mt-1 font-mono opacity-60">
                      #{log.entityId?.substring(0, 8)}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase md:hidden">Details:</span>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium bg-gray-50 p-2 rounded-lg border border-gray-100 md:bg-transparent md:p-0 md:border-0 md:text-sm">
                      {log.details || 'No additional details provided.'}
                    </p>
                    {log.entityId && (
                       <p className="md:hidden text-[9px] text-gray-400 font-mono">ID: {log.entityId}</p>
                    )}
                  </div>

                  {/* Timestamp (Desktop) */}
                  <div className="hidden md:flex flex-col items-end text-right">
                    <p className="text-xs font-bold text-gray-800">
                      {new Date(log.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(log.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1 opacity-40">
                      <CheckCircle2 className="w-3 h-3 text-[#166534]" />
                      <span className="text-[8px] font-black uppercase tracking-tighter">Verified</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 md:px-6 py-3 border-t border-gray-100 bg-gray-50 text-[10px] text-gray-400 font-bold flex flex-col md:flex-row justify-between gap-2">
          <span>SHOWING <strong className="text-gray-700">{filtered.length}</strong> OF <strong className="text-gray-700">{logs.length}</strong> AUDIT EVENTS</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-[#166534]" /> SECURE LOGS</span>
            <span className="hidden md:inline text-gray-300">|</span>
            <span className="flex items-center gap-1 uppercase tracking-widest"><CheckCircle2 className="w-3 h-3 text-blue-500" /> IMMUTABLE TRAIL</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AuditLogPage;
