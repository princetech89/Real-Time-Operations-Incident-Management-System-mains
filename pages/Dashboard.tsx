import React from 'react';
import { useApp } from '../store/AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Activity, 
  TrendingUp,
  ExternalLink,
  PieChart as PieChartIcon
} from 'lucide-react';
import { IncidentPriority, IncidentStatus } from '../types';

const PRIORITY_COLORS: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#eab308',
  LOW: '#3b82f6',
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: '#ef4444',
  INVESTIGATING: '#f97316',
  RESOLVED: '#22c55e',
  CLOSED: '#64748b',
};

const StatCard: React.FC<{ icon: React.ElementType, label: string, value: number, color: string, trend?: string }> = ({ 
  icon: Icon, label, value, color, trend 
}) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all group">
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-500 mb-4 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className="flex items-center text-emerald-500 text-xs font-bold">
          <TrendingUp size={14} className="mr-1" />
          {trend}
        </span>
      )}
    </div>
    <p className="text-slate-400 text-sm font-medium">{label}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

export const Dashboard: React.FC = () => {
  const { stats, incidents } = useApp();

  const pieData = [
    { name: 'Open', value: stats.open, color: STATUS_COLORS.OPEN },
    { name: 'Investigating', value: stats.investigating, color: STATUS_COLORS.INVESTIGATING },
    { name: 'Resolved', value: stats.resolved, color: STATUS_COLORS.RESOLVED },
  ].filter(d => d.value > 0);

  const priorityData = Object.values(IncidentPriority).map(p => ({
    name: p,
    count: incidents.filter(i => i.priority === p).length,
    fill: PRIORITY_COLORS[p]
  }));

  const recentIncidents = [...incidents].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Operational Command</h1>
        <p className="text-slate-400">Real-time system health and incident metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Activity} label="Total Incidents" value={stats.total} color="blue" trend="+12%" />
        <StatCard icon={AlertCircle} label="Active Issues" value={stats.open + stats.investigating} color="orange" trend="+2" />
        <StatCard icon={CheckCircle2} label="Resolved (24h)" value={stats.resolved} color="emerald" trend="+5" />
        <StatCard icon={Clock} label="Avg. Resolution" value={42} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            {/* Fix: Use aliased PieChartIcon from lucide-react to avoid conflict with recharts PieChart */}
            <PieChartIcon size={18} className="mr-2 text-purple-500" />
            Priority Distribution
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            {/* Fix: Use Activity icon since PieChart is already used above as a header icon, or use another appropriate icon */}
            <Activity size={18} className="mr-2 text-purple-500" />
            Incident Status
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold">Recently Raised</h3>
          <a href="#/incidents" className="text-sm text-blue-500 hover:text-blue-400 flex items-center">
            View Feed <ExternalLink size={14} className="ml-1" />
          </a>
        </div>
        <div className="divide-y divide-slate-800">
          {recentIncidents.map(inc => (
            <div key={inc.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: PRIORITY_COLORS[inc.priority] }}></div>
                <div>
                  <p className="font-medium text-sm text-slate-100">{inc.title}</p>
                  <p className="text-xs text-slate-500">Raised by {inc.creatorName} • {new Date(inc.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  inc.status === IncidentStatus.OPEN ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                  inc.status === IncidentStatus.INVESTIGATING ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                  'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                }`}>
                  {inc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};