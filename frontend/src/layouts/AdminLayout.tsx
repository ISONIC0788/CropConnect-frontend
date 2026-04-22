import { useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { LayoutDashboard, Bell, Search, Menu, X, Users, Package, ShoppingCart, Gavel, CheckCircle2, Clock } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AdminSidebar from '../pages/admin/AdminSidebar';
import axiosClient from '../api/axiosClient';

interface AdminLayoutProps {
  children: ReactNode;
}

interface ActivityNote {
  id: string;
  type: 'user' | 'listing' | 'bid' | 'order';
  title: string;
  subtitle: string;
  time: string;
  isRead: boolean;
  link: string;
}

const READ_KEY      = 'admin_read_notifications';
const DISMISSED_KEY = 'admin_dismissed_notifications';

function getReadIds(): Set<string> {
  try { const r = localStorage.getItem(READ_KEY); return new Set(r ? JSON.parse(r) : []); } catch { return new Set(); }
}
function saveReadIds(ids: Set<string>) {
  localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
}
function getDismissedIds(): Set<string> {
  try { const r = localStorage.getItem(DISMISSED_KEY); return new Set(r ? JSON.parse(r) : []); } catch { return new Set(); }
}
function saveDismissedIds(ids: Set<string>) {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids]));
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const typeIcon: Record<string, ReactNode> = {
  user:    <Users    className="w-4 h-4 text-indigo-600" />,
  listing: <Package  className="w-4 h-4 text-green-600"  />,
  bid:     <Gavel    className="w-4 h-4 text-amber-600"  />,
  order:   <ShoppingCart className="w-4 h-4 text-blue-600" />,
};

const typeBg: Record<string, string> = {
  user:    'bg-indigo-50',
  listing: 'bg-green-50',
  bid:     'bg-amber-50',
  order:   'bg-blue-50',
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isCollapsed, setIsCollapsed]   = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [notes, setNotes]               = useState<ActivityNote[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const location  = useLocation();
  const navigate  = useNavigate();

  // ── Dynamic page title ──────────────────────────────────────────────────
  let pageTitle = 'Dashboard Overview';
  if (location.pathname === '/admin/users')      pageTitle = 'User Management';
  if (location.pathname === '/admin/disputes')   pageTitle = 'Dispute Arbitration';
  if (location.pathname === '/admin/audit-logs') pageTitle = 'Audit Logs';
  if (location.pathname === '/admin/health')     pageTitle = 'System Health';
  if (location.pathname === '/admin/settings')   pageTitle = 'Settings';

  // Filter out already-dismissed notifications when fetching
  const fetchActivity = useCallback(async () => {
    try {
      const readIds      = getReadIds();
      const dismissedIds = getDismissedIds();

      const [usersRes, listingsRes, bidsRes, ordersRes] = await Promise.allSettled([
        axiosClient.get('/users'),
        axiosClient.get('/listings'),
        axiosClient.get('/bids'),
        axiosClient.get('/orders'),
      ]);

      const items: ActivityNote[] = [];

      // New (pending) users
      if (usersRes.status === 'fulfilled') {
        const pending = (usersRes.value.data as any[]).filter((u: any) => !u.isVerified);
        pending.slice(0, 5).forEach((u: any) => {
          const id = `user-${u.userId}`;
          if (dismissedIds.has(id)) return;
          items.push({ id, type: 'user', title: `New user registration`, subtitle: u.fullName || u.phoneNumber || 'Unknown', time: u.createdAt ? timeAgo(u.createdAt) : 'Recently', isRead: readIds.has(id), link: '/admin/users' });
        });
      }

      // Unverified listings
      if (listingsRes.status === 'fulfilled') {
        const unverified = (listingsRes.value.data as any[]).filter((l: any) => !l.isVerified).slice(0, 4);
        unverified.forEach((l: any) => {
          const id = `listing-${l.listingId}`;
          if (dismissedIds.has(id)) return;
          items.push({ id, type: 'listing', title: `New listing pending review`, subtitle: `${l.quantityKg}kg ${l.cropType} — ${l.farmer?.fullName || 'Farmer'}`, time: l.createdAt ? timeAgo(l.createdAt) : 'Recently', isRead: readIds.has(id), link: '/admin' });
        });
      }

      // Recent bids
      if (bidsRes.status === 'fulfilled') {
        const recentBids = (bidsRes.value.data as any[])
          .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 3);
        recentBids.forEach((b: any) => {
          const id = `bid-${b.bidId}`;
          if (dismissedIds.has(id)) return;
          items.push({ id, type: 'bid', title: `New bid placed`, subtitle: `${(b.bidAmount || 0).toLocaleString()} RWF — ${b.buyer?.fullName || 'Buyer'}`, time: b.createdAt ? timeAgo(b.createdAt) : 'Recently', isRead: readIds.has(id), link: '/admin' });
        });
      }

      // Recent orders
      if (ordersRes.status === 'fulfilled') {
        const recentOrders = (ordersRes.value.data as any[])
          .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 3);
        recentOrders.forEach((o: any) => {
          const id = `order-${o.orderId}`;
          if (dismissedIds.has(id)) return;
          items.push({ id, type: 'order', title: `Order created`, subtitle: `${((o.finalAmount || o.totalAmount || o.bidAmount) || 0).toLocaleString()} RWF — ${o.buyer?.fullName || 'Buyer'}`, time: o.createdAt ? timeAgo(o.createdAt) : 'Recently', isRead: readIds.has(id), link: '/admin' });
        });
      }

      setNotes(items);
    } catch (err) {
      console.error('AdminLayout: failed to load notifications', err);
    }
  }, []);

  // Poll every 60s
  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 60_000);
    return () => clearInterval(interval);
  }, [fetchActivity]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unreadCount = notes.filter(n => !n.isRead).length;

  // Dismiss a single notification — removes it from list permanently
  const dismissNote = (id: string) => {
    const dismissed = getDismissedIds();
    dismissed.add(id);
    saveDismissedIds(dismissed);
    const readIds = getReadIds();
    readIds.add(id);
    saveReadIds(readIds);
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Dismiss all notifications at once
  const dismissAll = () => {
    const dismissed = getDismissedIds();
    const readIds   = getReadIds();
    notes.forEach(n => { dismissed.add(n.id); readIds.add(n.id); });
    saveDismissedIds(dismissed);
    saveReadIds(readIds);
    setNotes([]);
  };

  const markAllRead = dismissAll; // Same behaviour — clear the feed

  return (
    <div className="AdminDashboard flex h-screen bg-cream font-sans overflow-hidden">
      
      <AdminSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        closeMobile={() => setIsMobileOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
        
        {/* ── Top Header ── */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 md:gap-4">
            <button className="md:hidden p-2 text-gray-500 hover:text-primary transition-colors cursor-pointer" onClick={() => setIsMobileOpen(!isMobileOpen)}>
              <Menu className="w-6 h-6" />
            </button>
            <button className="hidden md:block p-2 -ml-2 text-gray-500 hover:text-primary transition-colors cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
              <Menu className="w-5 h-5" />
            </button>
            <LayoutDashboard className="w-5 h-5 text-gray-400 hidden sm:block" />
            <h1 className="font-serif text-lg md:text-xl font-bold text-brown truncate">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-40 md:w-64 bg-gray-50 transition-all" />
            </div>

            {/* ── Notification Bell ── */}
            <div className="relative flex-shrink-0" ref={notifRef}>
              <button
                onClick={() => { setNotifOpen(o => !o); if (!notifOpen) fetchActivity(); }}
                className="relative p-2 text-gray-400 hover:text-[#2E7D32] transition-colors cursor-pointer"
                title="Activity Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* ── Dropdown Panel ── */}
              {notifOpen && (
                <div className="absolute right-0 top-12 w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in zoom-in-95 fade-in duration-150">
                  
                  {/* Header */}
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#3E2723] text-sm">Activity Feed</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {unreadCount > 0 ? `${unreadCount} new events` : 'All caught up'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs text-[#2E7D32] font-bold hover:underline">
                          Mark all read
                        </button>
                      )}
                      <button onClick={() => setNotifOpen(false)} className="text-gray-300 hover:text-gray-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-50">
                    {notes.length === 0 ? (
                      <div className="py-12 text-center text-sm text-gray-400">
                        <Bell className="w-8 h-8 mx-auto mb-3 text-gray-200" />
                        No recent activity
                      </div>
                    ) : (
                      notes.map(note => (
                        <div
                          key={note.id}
                          onClick={() => { dismissNote(note.id); navigate(note.link); setNotifOpen(false); }}
                          className={`flex items-start gap-3 px-5 py-3.5 hover:bg-red-50/40 transition-colors cursor-pointer group ${!note.isRead ? 'bg-blue-50/40' : ''}`}
                        >
                          {/* Icon */}
                          <div className={`w-9 h-9 rounded-xl ${typeBg[note.type]} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            {typeIcon[note.type]}
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-tight ${!note.isRead ? 'font-bold text-[#3E2723]' : 'font-medium text-gray-700'}`}>
                              {note.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 truncate">{note.subtitle}</p>
                            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {note.time}
                            </p>
                          </div>

                          {/* Dismiss hint */}
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            {!note.isRead && <span className="w-2 h-2 bg-[#2E7D32] rounded-full mt-2"></span>}
                            <span className="text-[10px] text-gray-300 group-hover:text-red-400 transition-colors mt-auto hidden group-hover:block">dismiss</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <span className="text-xs text-gray-400">{notes.length} total events</span>
                    <div className="flex gap-1">
                      {['user','listing','bid','order'].map(t => (
                        <span key={t} className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${typeBg[t]} text-gray-600`}>
                          {notes.filter(n => n.type === t).length} {t}s
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile chip */}
            <div
              className="flex items-center gap-3 pl-3 md:pl-6 border-l border-gray-200 cursor-pointer group flex-shrink-0"
              onClick={() => navigate('/admin/settings')}
              title="Open Profile Settings"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-green-800 transition-colors">
                SA
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-bold text-brown leading-none mb-1">Super Admin</span>
                <span className="text-xs text-gray-500 leading-none">admin@cropconnect.rw</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;