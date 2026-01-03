
import React from 'react';
import { useApp } from '../store/AppContext';
import { UserRole } from '../types';
import { Shield, ShieldAlert, User as UserIcon, Settings, CheckCircle, XCircle } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { users, currentUser, updateUserRole, toggleUserStatus } = useApp();

  if (currentUser?.role !== UserRole.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-6" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-slate-400">Personnel management requires High Command clearance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personnel Directory</h1>
          <p className="text-slate-400">Manage operative access and tactical roles.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-all">
          Enlist Operative
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            {!user.enabled && <div className="absolute inset-0 bg-red-500/10 backdrop-blur-[1px] z-0 pointer-events-none" />}
            
            <div className="relative z-10 flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img src={user.avatar} className="w-14 h-14 rounded-full border-2 border-slate-800 shadow-lg" alt={user.name} />
                <div>
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <div className={`p-2 rounded-lg ${user.role === UserRole.ADMIN ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                {user.role === UserRole.ADMIN ? <Shield size={20} /> : <UserIcon size={20} />}
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Clearance</p>
                <p className="text-sm font-medium">{user.role}</p>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                <p className={`text-sm font-medium ${user.enabled ? 'text-emerald-500' : 'text-red-500'}`}>
                  {user.enabled ? 'ACTIVE' : 'SUSPENDED'}
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center space-x-2">
              <button 
                onClick={() => updateUserRole(user.id, user.role === UserRole.ADMIN ? UserRole.OPERATOR : UserRole.ADMIN)}
                className="flex-1 flex items-center justify-center p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-xs font-semibold"
              >
                <Settings size={14} className="mr-2" />
                Shift Role
              </button>
              <button 
                onClick={() => toggleUserStatus(user.id)}
                className={`flex-1 flex items-center justify-center p-2 rounded-lg border transition-all text-xs font-semibold ${
                  user.enabled 
                    ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' 
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                }`}
              >
                {user.enabled ? <XCircle size={14} className="mr-2" /> : <CheckCircle size={14} className="mr-2" />}
                {user.enabled ? 'Suspend' : 'Reinstate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
