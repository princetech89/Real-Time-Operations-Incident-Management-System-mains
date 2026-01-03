
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { IncidentPriority, IncidentStatus } from '../types';
import { ShieldAlert, Send, AlertTriangle } from 'lucide-react';

export const CreateIncident: React.FC = () => {
  const { addIncident, currentUser } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<IncidentPriority>(IncidentPriority.MEDIUM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !currentUser) return;

    addIncident({
      title,
      description,
      priority,
      status: IncidentStatus.OPEN,
      createdBy: currentUser.id,
      creatorName: currentUser.name
    });

    window.location.hash = '#/incidents';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Raise New Incident</h1>
        <p className="text-slate-400">Deploy tactical response protocols.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex items-start gap-4 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl mb-6 text-orange-200 text-sm">
            <AlertTriangle className="text-orange-500 shrink-0" size={20} />
            <p>
              Raising an incident will notify all active operators and admins on the network. 
              Please ensure tactical data is accurate before submission.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Tactical Title</label>
            <input 
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Core Reactor Overheating in Deck 4"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Detailed Description</label>
            <textarea 
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide specific details, error logs, or symptoms observed..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Priority Level</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.values(IncidentPriority).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    priority === p 
                      ? 'bg-slate-800 border-blue-500 text-white shadow-lg' 
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <ShieldAlert size={20} className={`mb-2 ${
                    p === IncidentPriority.CRITICAL ? 'text-red-500' :
                    p === IncidentPriority.HIGH ? 'text-orange-500' :
                    p === IncidentPriority.MEDIUM ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <span className="text-xs font-bold uppercase">{p}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-900/50 border-t border-slate-800 flex items-center justify-between">
          <button 
            type="button"
            onClick={() => window.location.hash = '#/incidents'}
            className="text-slate-400 hover:text-white font-medium transition-colors"
          >
            Cancel Mission
          </button>
          <button 
            type="submit"
            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Send size={18} className="mr-2" />
            Raise Incident
          </button>
        </div>
      </form>
    </div>
  );
};
