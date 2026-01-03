
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Zap, ShieldCheck, User as UserIcon, Loader2 } from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { setCurrentUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = (role: UserRole) => {
    setLoading(true);
    setTimeout(() => {
      const user = role === UserRole.ADMIN 
        ? { id: 'u1', email: 'admin@sentinel.ops', name: 'Commander Shepard', role: UserRole.ADMIN, avatar: 'https://picsum.photos/seed/admin/200', enabled: true }
        : { id: 'u2', email: 'op@sentinel.ops', name: 'Garrus Vakarian', role: UserRole.OPERATOR, avatar: 'https://picsum.photos/seed/op/200', enabled: true };
      
      setCurrentUser(user);
      window.location.hash = '#/dashboard';
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      
      <div className="max-w-md w-full p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 rounded-xl mb-4">
            <Zap className="text-blue-500 w-10 h-10 fill-blue-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Sentinel Ops</h1>
          <p className="text-slate-400">Mission Critical Incident Management</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-slate-400 mb-1">Email / Tactical ID</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="id@sentinel.ops"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-3 pt-4">
            <button 
              disabled={loading}
              onClick={() => handleLogin(UserRole.ADMIN)}
              className="w-full group relative flex items-center justify-center py-4 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <ShieldCheck className="mr-2 group-hover:scale-110 transition-transform" />}
              Login as Admin
            </button>
            <button 
              disabled={loading}
              onClick={() => handleLogin(UserRole.OPERATOR)}
              className="w-full group relative flex items-center justify-center py-4 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all border border-slate-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <UserIcon className="mr-2 group-hover:scale-110 transition-transform" />}
              Login as Operator
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Secure biometric handshake required for field deployments.
          <br />© 2185 Systems Alliance / Cerberus Network.
        </p>
      </div>
    </div>
  );
};
