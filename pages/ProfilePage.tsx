
import React from 'react';
import { useApp } from '../store/AppContext';
import { UserCircle, Shield, Mail, Calendar, Key, ShieldCheck, Activity, LogOut } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, logout, stats } = useApp();

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 pb-4 border-b border-slate-800/60">
        <div className="relative group">
          <img 
            src={currentUser.avatar} 
            className="w-32 h-32 rounded-3xl border-4 border-slate-800 shadow-2xl transition-transform group-hover:scale-105" 
            alt={currentUser.name} 
          />
          <div className="absolute -bottom-2 -right-2 p-3 bg-blue-600 rounded-2xl shadow-xl">
            <ShieldCheck className="text-white" size={24} />
          </div>
        </div>
        <div className="text-center md:text-left space-y-2">
          <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
            <h1 className="text-4xl font-extrabold tracking-tight">{currentUser.name}</h1>
            <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border border-blue-500/30">
              {currentUser.role}
            </span>
          </div>
          <p className="text-slate-400 text-lg flex items-center justify-center md:justify-start">
            <UserCircle size={18} className="mr-2 opacity-50" />
            Operative ID: <span className="text-slate-200 ml-1 font-mono">{currentUser.id}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Operative Metadata */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-sm hover:border-slate-700 transition-colors">
          <h3 className="text-xl font-bold mb-6 flex items-center text-slate-100">
            <UserCircle size={20} className="mr-3 text-blue-500" />
            Deployment Data
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3 border-b border-slate-800/50">
              <div className="flex items-center text-slate-400">
                <Mail size={18} className="mr-3" />
                <span className="text-sm">Tactical Channel</span>
              </div>
              <span className="font-semibold text-slate-200">{currentUser.email}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-800/50">
              <div className="flex items-center text-slate-400">
                <Shield size={18} className="mr-3" />
                <span className="text-sm">Access Clearance</span>
              </div>
              <span className="font-semibold text-slate-200">
                {currentUser.role === 'ADMIN' ? 'Level 5 (Full Authority)' : 'Level 2 (Active Field)'}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center text-slate-400">
                <Calendar size={18} className="mr-3" />
                <span className="text-sm">Enlisted Epoch</span>
              </div>
              <span className="font-semibold text-slate-200">Nov 2183.04</span>
            </div>
          </div>
        </div>

        {/* Security & Access */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-sm hover:border-slate-700 transition-colors flex flex-col">
          <h3 className="text-xl font-bold mb-6 flex items-center text-slate-100">
            <Key size={20} className="mr-3 text-orange-500" />
            Auth Configuration
          </h3>
          <p className="text-slate-400 text-sm mb-auto leading-relaxed">
            Biometric signatures and multi-factor hardware keys are synchronized with your device. 
            Rotate your tactical pass-key every 30 terrestrial cycles for maximum security.
          </p>
          <div className="mt-8 space-y-3">
            <button className="w-full py-4 px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center">
              Rotate Tactical Keys
            </button>
            <button 
              onClick={logout}
              className="w-full py-4 px-6 bg-red-900/10 hover:bg-red-900/20 text-red-500 font-bold rounded-xl border border-red-500/20 transition-all flex items-center justify-center lg:hidden"
            >
              <LogOut size={18} className="mr-2" />
              Terminate Session
            </button>
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Assigned Tasks', value: '14', icon: Activity, color: 'text-blue-500' },
          { label: 'Resolutions', value: stats.resolved, icon: ShieldCheck, color: 'text-emerald-500' },
          { label: 'Clearance Score', value: '98%', icon: Shield, color: 'text-purple-500' },
          { label: 'Avg Pulse', value: '72bpm', icon: Activity, color: 'text-red-500' },
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center md:text-left">
            <item.icon size={20} className={`${item.color} mb-3 mx-auto md:mx-0`} />
            <p className="text-2xl font-bold text-white">{item.value}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-red-950/10 border border-red-900/30 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2 text-red-500">Decommission Account</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Immediate suspension of all tactical clearance and removal from active rotation. 
              This action is immutable and requires Command-level authorization.
            </p>
          </div>
          <button className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white border border-red-500 rounded-xl transition-all font-bold text-sm shadow-lg shadow-red-500/20 whitespace-nowrap">
            Confirm Decommission
          </button>
        </div>
      </div>
    </div>
  );
};
