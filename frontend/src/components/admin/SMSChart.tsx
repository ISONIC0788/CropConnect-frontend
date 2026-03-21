import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const SMSChart = () => {
  // Mock data mimicking the curve from your reference design
  const data = [
    { time: '00:00', latency: 120, throughput: 45 },
    { time: '02:00', latency: 100, throughput: 30 },
    { time: '04:00', latency: 105, throughput: 20 },
    { time: '06:00', latency: 135, throughput: 75 },
    { time: '08:00', latency: 185, throughput: 155 },
    { time: '10:00', latency: 225, throughput: 215 },
    { time: '12:00', latency: 260, throughput: 255 },
    { time: '14:00', latency: 195, throughput: 200 },
    { time: '16:00', latency: 215, throughput: 190 },
    { time: '18:00', latency: 165, throughput: 145 },
    { time: '20:00', latency: 140, throughput: 95 },
    { time: '22:00', latency: 125, throughput: 55 },
    { time: 'Now', latency: 160, throughput: 75 },
  ];

  // Custom tooltip to make hover states look clean and professional
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-100 shadow-lg rounded-xl">
          <p className="font-bold text-brown mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-primary font-medium">
              Latency: {payload[0].value} ms
            </p>
            <p className="text-accent font-medium">
              Throughput: {payload[1].value} msg/min
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[300px] mt-4 font-sans text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data} 
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          {/* Subtle grid background */}
          <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#F3F4F6" />
          
          {/* X Axis: Time */}
          <XAxis 
            dataKey="time" 
            tick={{ fill: '#9CA3AF' }} 
            axisLine={false} 
            tickLine={false} 
            dy={10}
          />
          
          {/* Left Y Axis: Latency (ms) */}
          <YAxis 
            yAxisId="left" 
            tick={{ fill: '#9CA3AF' }} 
            axisLine={false} 
            tickLine={false} 
            tickCount={5}
            label={{ value: 'ms', angle: 0, position: 'insideLeft', offset: 25, fill: '#9CA3AF' }} 
          />
          
          {/* Right Y Axis: Throughput (msg/min) */}
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            tick={{ fill: '#9CA3AF' }} 
            axisLine={false} 
            tickLine={false}
            tickCount={5}
            label={{ value: 'msg/min', angle: 0, position: 'insideRight', offset: 15, fill: '#9CA3AF' }} 
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Solid Green Line: Latency */}
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="latency" 
            stroke="var(--color-primary)" 
            strokeWidth={2} 
            dot={{ r: 4, fill: 'var(--color-primary)', strokeWidth: 0 }} 
            activeDot={{ r: 6, strokeWidth: 0 }} 
          />
          
          {/* Dashed Gold Line: Throughput */}
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="throughput" 
            stroke="var(--color-accent)" 
            strokeWidth={2} 
            strokeDasharray="5 5" 
            dot={{ r: 4, fill: 'var(--color-accent)', strokeWidth: 0 }} 
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SMSChart;