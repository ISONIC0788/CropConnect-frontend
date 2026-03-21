import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  icon: ReactNode;
  value: string;
  trendValue: string;
  trendDirection: 'up' | 'down';
  trendColorClass?: string; // Optional: Allows us to pass custom colors (like gray vs green)
}

const KPICard = ({ 
  title, 
  icon, 
  value, 
  trendValue, 
  trendDirection, 
  trendColorClass = "text-primary" 
}: KPICardProps) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
          <div className="p-2 bg-gray-50 rounded-lg">
            {icon}
          </div>
          {title}
        </div>
        <div className={`flex items-center text-xs font-bold ${trendColorClass}`}>
          {trendDirection === 'up' ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {trendValue}
        </div>
      </div>
      {/* tracking-tight makes large numbers look better clustered together */}
      <div className="text-3xl font-bold text-brown tracking-tight">
        {value}
      </div>
    </div>
  );
};

export default KPICard;