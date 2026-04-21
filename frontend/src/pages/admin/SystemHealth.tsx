import { 
  Server, MessageSquare, Wifi, Database, Cpu
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Bar, Line, BarChart
} from 'recharts';

// --- MOCK DATA ---

const serviceStatus = [
  { id: 1, name: 'API Server', icon: <Server className="w-5 h-5 text-gray-500" />, status: 'Operational', value: '99.98%', isUp: true },
  { id: 2, name: 'SMS Gateway (AT)', icon: <MessageSquare className="w-5 h-5 text-gray-500" />, status: 'Operational', value: '99.91%', isUp: true },
  { id: 3, name: 'USSD Gateway', icon: <Wifi className="w-5 h-5 text-gray-500" />, status: 'Degraded', value: '98.72%', isUp: false },
  { id: 4, name: 'PostgreSQL', icon: <Database className="w-5 h-5 text-gray-500" />, status: 'Operational', value: '100%', isUp: true },
  { id: 5, name: 'Worker Queue', icon: <Cpu className="w-5 h-5 text-gray-500" />, status: 'Operational', value: '99.95%', isUp: true },
];

const latencyData = [
  { time: '00:00', ms: 120 }, { time: '02:00', ms: 95 }, { time: '04:00', ms: 105 },
  { time: '06:00', ms: 135 }, { time: '08:00', ms: 185 }, { time: '10:00', ms: 225 },
  { time: '12:00', ms: 260 }, { time: '14:00', ms: 195 }, { time: '16:00', ms: 215 },
  { time: '18:00', ms: 165 }, { time: '20:00', ms: 140 }, { time: '22:00', ms: 125 },
  { time: 'Now', ms: 160 },
];

const weeklyData = [
  { day: 'Mon', uptime: 99.9, volume: 12000 },
  { day: 'Tue', uptime: 99.8, volume: 13500 },
  { day: 'Wed', uptime: 100.0, volume: 14000 },
  { day: 'Thu', uptime: 99.95, volume: 12500 },
  { day: 'Fri', uptime: 99.6, volume: 18000 }, // High volume, lower uptime
  { day: 'Sat', uptime: 100.0, volume: 8000 },
  { day: 'Sun', uptime: 99.98, volume: 7500 },
];

const throughputData = [
  { time: '00:00', msg: 45 }, { time: '02:00', msg: 30 }, { time: '04:00', msg: 20 },
  { time: '06:00', msg: 75 }, { time: '08:00', msg: 155 }, { time: '10:00', msg: 215 },
  { time: '12:00', msg: 255 }, { time: '14:00', msg: 200 }, { time: '16:00', msg: 190 },
  { time: '18:00', msg: 145 }, { time: '20:00', msg: 95 }, { time: '22:00', msg: 55 },
  { time: 'Now', msg: 75 },
];

// --- MAIN COMPONENT ---

const SystemHealth = () => {
  return (
    <div className="space-y-6">
      
      {/* 1. TOP ROW: SERVICE STATUS KPIs */}
      <div>
        <h3 className="text-sm font-bold text-brown mb-4 font-serif">Service Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {serviceStatus.map((service) => (
            <div key={service.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="mb-2">{service.icon}</div>
              <h4 className="text-xs font-bold text-gray-500 mb-2">{service.name}</h4>
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${service.isUp ? 'bg-green-500' : 'bg-accent'}`}></span>
                <span className="text-[11px] font-semibold text-gray-600">{service.status}</span>
              </div>
              <div className="text-2xl font-bold text-brown mt-1 tracking-tight">{service.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MIDDLE ROW: SPLIT CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Chart: SMS Gateway Latency (Area Chart) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif font-bold text-brown flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              SMS Gateway Latency
            </h3>
            <span className="text-[10px] font-bold border border-gray-200 text-gray-500 px-2 py-1 rounded-md">24h</span>
          </div>
          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#F3F4F6" />
                <XAxis dataKey="time" tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickCount={5} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="ms" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorMs)" activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Weekly Uptime & Volume (Composed Chart) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif font-bold text-brown flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              Weekly Uptime & Request Volume
            </h3>
            <span className="text-[10px] font-bold border border-gray-200 text-gray-500 px-2 py-1 rounded-md">7 days</span>
          </div>
          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={weeklyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="day" tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} dy={10} />
                
                {/* Left Y Axis for Uptime % */}
                <YAxis yAxisId="left" domain={[99.5, 100.05]} tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                
                {/* Right Y Axis for Volume */}
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                {/* Yellow bars for volume */}
                <Bar yAxisId="right" dataKey="volume" fill="#FEF08A" radius={[4, 4, 0, 0]} barSize={40} />
                {/* Green line for uptime */}
                <Line yAxisId="left" type="monotone" dataKey="uptime" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-primary)', strokeWidth: 0 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. BOTTOM ROW: THROUGHPUT BAR CHART */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col h-[350px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif font-bold text-brown flex items-center gap-2">
            <Wifi className="w-4 h-4 text-blue-500" />
            SMS Throughput (messages/min)
          </h3>
          <span className="text-[10px] font-bold border border-gray-200 text-gray-500 px-2 py-1 rounded-md">24h</span>
        </div>
        <div className="flex-1 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={throughputData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="time" tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#3B82F6', fontWeight: 'bold' }}
              />
              <Bar dataKey="msg" fill="#3498DB" radius={[4, 4, 0, 0]} barSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default SystemHealth;