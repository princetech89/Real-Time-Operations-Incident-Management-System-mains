
import React from 'react';
import { useApp } from '../store/AppContext';
import { UserRole } from '../types';
import { History, ShieldAlert, Eye, User as UserIcon, Calendar } from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const { auditLogs, currentUser } = useApp();

  if (currentUser?.role !== UserRole.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-6" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-slate-400">Tactical logs are restricted to Administrative clearance levels.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Archive</h1>
        <p className="text-slate-400">Immutable record of all operational activity.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Operator</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Action</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Target</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">No historical logs available yet.</td>
                </tr>
              ) : (
                auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-xs text-slate-300 font-mono">
                        <Calendar size={14} className="mr-2 text-slate-500" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon size={14} className="mr-2 text-blue-500" />
                        <span className="text-sm font-medium">{log.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        log.action.includes('CREATE') ? 'bg-blue-500/10 text-blue-500' :
                        log.action.includes('UPDATE') ? 'bg-orange-500/10 text-orange-500' :
                        log.action.includes('LOGIN') ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-slate-500/10 text-slate-400'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-mono">
                      {log.entityType}:{log.entityId}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-300 truncate max-w-xs">{log.details}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
