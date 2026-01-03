
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { IncidentStatus, IncidentPriority } from '../types';
import { 
  Filter, 
  Search, 
  ArrowUpDown, 
  MoreVertical, 
  ChevronRight,
  ShieldAlert,
  Clock,
  User as UserIcon
} from 'lucide-react';

const PRIORITY_THEMES: Record<IncidentPriority, { bg: string, text: string, dot: string }> = {
  [IncidentPriority.LOW]: { bg: 'bg-blue-500/10', text: 'text-blue-500', dot: 'bg-blue-500' },
  [IncidentPriority.MEDIUM]: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', dot: 'bg-yellow-500' },
  [IncidentPriority.HIGH]: { bg: 'bg-orange-500/10', text: 'text-orange-500', dot: 'bg-orange-500' },
  [IncidentPriority.CRITICAL]: { bg: 'bg-red-500/10', text: 'text-red-500', dot: 'bg-red-500' },
};

const STATUS_ICONS: Record<IncidentStatus, React.ElementType> = {
  [IncidentStatus.OPEN]: ShieldAlert,
  [IncidentStatus.INVESTIGATING]: Clock,
  [IncidentStatus.RESOLVED]: ChevronRight,
  [IncidentStatus.CLOSED]: ChevronRight,
};

export const IncidentFeed: React.FC = () => {
  const { incidents } = useApp();
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filteredIncidents = incidents.filter(i => {
    const matchesFilter = filter === 'ALL' || i.status === filter || i.priority === filter;
    const matchesSearch = i.title.toLowerCase().includes(search.toLowerCase()) || 
                          i.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incident Feed</h1>
          <p className="text-slate-400">Live operational events across all regions.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search tactical logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <a 
            href="#/incidents/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center"
          >
            New Incident
          </a>
        </div>
      </div>

      <div className="flex items-center space-x-2 pb-2 overflow-x-auto">
        <Filter size={16} className="text-slate-500 mr-2 shrink-0" />
        {['ALL', ...Object.values(IncidentStatus), ...Object.values(IncidentPriority)].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              filter === f 
                ? 'bg-blue-600 border-blue-500 text-white' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredIncidents.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <div className="flex justify-center mb-4 text-slate-600">
              <ShieldAlert size={48} />
            </div>
            <h3 className="text-lg font-medium text-slate-300">No matching incidents found</h3>
            <p className="text-slate-500">The sector appears to be clear of active threats.</p>
          </div>
        ) : (
          filteredIncidents.map(inc => (
            <a 
              key={inc.id}
              href={`#/incidents/${inc.id}`}
              className="block bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-all group"
            >
              <div className="p-5 flex items-start gap-4">
                <div className={`mt-1 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${PRIORITY_THEMES[inc.priority].bg} ${PRIORITY_THEMES[inc.priority].text}`}>
                  <ShieldAlert size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold truncate group-hover:text-blue-400 transition-colors">{inc.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${PRIORITY_THEMES[inc.priority].bg} ${PRIORITY_THEMES[inc.priority].text}`}>
                        {inc.priority}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">#{inc.id}</span>
                  </div>
                  
                  <p className="text-slate-400 text-sm line-clamp-1 mb-4">{inc.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs">
                    <div className="flex items-center text-slate-500">
                      <UserIcon size={14} className="mr-1.5" />
                      {inc.creatorName}
                    </div>
                    <div className="flex items-center text-slate-500">
                      <Clock size={14} className="mr-1.5" />
                      {new Date(inc.createdAt).toLocaleString()}
                    </div>
                    <div className="ml-auto">
                      <span className={`flex items-center px-2.5 py-1 rounded-full font-bold uppercase tracking-widest text-[10px] border ${
                        inc.status === IncidentStatus.OPEN ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        inc.status === IncidentStatus.INVESTIGATING ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          inc.status === IncidentStatus.OPEN ? 'bg-red-500 animate-pulse' :
                          inc.status === IncidentStatus.INVESTIGATING ? 'bg-orange-500 animate-pulse' :
                          'bg-emerald-500'
                        }`} />
                        {inc.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="self-center pl-4 text-slate-600 group-hover:text-slate-300 transition-colors">
                  <ChevronRight size={24} />
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
};
