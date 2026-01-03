
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { IncidentStatus, IncidentPriority } from '../types';
import { getIncidentResolutionSuggestion } from '../services/geminiService';
import { 
  ShieldAlert, 
  MessageSquare, 
  Clock, 
  User as UserIcon, 
  History, 
  CheckCircle2, 
  Play,
  Send,
  Loader2,
  Sparkles,
  Zap,
  ArrowLeft
} from 'lucide-react';

export const IncidentDetail: React.FC<{ id: string }> = ({ id }) => {
  const { incidents, updateIncidentStatus, addComment, currentUser } = useApp();
  const incident = incidents.find(i => i.id === id);
  const [newComment, setNewComment] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  if (!incident) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShieldAlert size={64} className="text-red-500 mb-6" />
      <h2 className="text-2xl font-bold">Tactical Data Unavailable</h2>
      <p className="text-slate-400 mb-8">The requested incident ID does not exist in the active records.</p>
      <a href="#/incidents" className="flex items-center px-6 py-3 bg-slate-800 rounded-xl font-bold text-sm">
        <ArrowLeft size={18} className="mr-2" />
        Return to Feed
      </a>
    </div>
  );

  const handleStatusChange = (status: IncidentStatus) => {
    updateIncidentStatus(incident.id, status);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(incident.id, newComment);
      setNewComment('');
    }
  };

  const generateAiHelp = async () => {
    setLoadingAi(true);
    const suggestion = await getIncidentResolutionSuggestion(incident);
    setAiSuggestion(suggestion);
    setLoadingAi(false);
  };

  const STATUS_CONFIG = {
    [IncidentStatus.OPEN]: { label: 'Open', color: 'text-red-500', bg: 'bg-red-500/10' },
    [IncidentStatus.INVESTIGATING]: { label: 'Investigating', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    [IncidentStatus.RESOLVED]: { label: 'Resolved', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    [IncidentStatus.CLOSED]: { label: 'Closed', color: 'text-slate-500', bg: 'bg-slate-500/10' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <a href="#/incidents" className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </a>
        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-2">Back to Incident Feed</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Left Column: Details & Comments */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className={`px-6 py-2 ${STATUS_CONFIG[incident.status].bg} border-b border-slate-800/50 flex justify-between items-center`}>
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${STATUS_CONFIG[incident.status].color}`}>
                Mission Status: {incident.status}
              </span>
              <span className="text-xs text-slate-500 font-mono">Incident #{incident.id}</span>
            </div>
            
            <div className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white">{incident.title}</h1>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Priority</p>
                  <p className={`font-semibold text-sm ${
                    incident.priority === 'CRITICAL' ? 'text-red-400' : 'text-slate-200'
                  }`}>{incident.priority}</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Reporter</p>
                  <p className="font-semibold text-sm text-slate-200">{incident.creatorName}</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Raised</p>
                  <p className="font-semibold text-sm text-slate-200">{new Date(incident.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">Last Update</p>
                  <p className="font-semibold text-sm text-slate-200">{new Date(incident.updatedAt).toLocaleTimeString()}</p>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-semibold mb-3 flex items-center text-slate-200">
                  <ShieldAlert size={18} className="mr-2 text-blue-500" />
                  Incident Narrative
                </h3>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {incident.description}
                </p>
              </div>
            </div>
          </div>

          {/* AI Assistant Section */}
          <div className="bg-slate-900 border border-blue-500/20 rounded-2xl p-6 shadow-lg shadow-blue-500/5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="text-blue-400" size={20} />
                <h3 className="text-lg font-bold text-slate-100">Sentinel AI Advisor</h3>
              </div>
              {!aiSuggestion && (
                <button 
                  onClick={generateAiHelp}
                  disabled={loadingAi}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold flex items-center justify-center transition-all disabled:opacity-50"
                >
                  {loadingAi ? <Loader2 className="animate-spin mr-2" size={16} /> : <Zap size={16} className="mr-2" />}
                  Run Diagnostics
                </button>
              )}
            </div>
            
            {aiSuggestion ? (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl overflow-auto max-h-96 animate-in fade-in slide-in-from-top-4">
                <div className="text-sm text-slate-300 space-y-4 prose prose-invert prose-sm max-w-none">
                  {aiSuggestion.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                </div>
                <button 
                  onClick={() => setAiSuggestion(null)} 
                  className="mt-6 text-xs text-slate-500 hover:text-white underline underline-offset-4"
                >
                  Dismiss Analysis
                </button>
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-950/50 rounded-xl border border-slate-800/50">
                <p className="text-slate-500 text-sm">Deploy AI analysis to identify patterns and mitigation steps.</p>
              </div>
            )}
          </div>

          {/* Comments/Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-semibold flex items-center text-slate-100">
                <MessageSquare size={18} className="mr-2 text-slate-400" />
                Tactical Comm Channel
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-6 mb-8">
                {incident.comments.length === 0 ? (
                  <div className="text-center py-12 bg-slate-950/30 rounded-xl border border-dashed border-slate-800">
                    <p className="text-slate-500 text-sm italic">Silence on the airwaves. No comms reported yet.</p>
                  </div>
                ) : (
                  incident.comments.map(c => (
                    <div key={c.id} className="flex gap-4 animate-in fade-in duration-300">
                      <img src={`https://picsum.photos/seed/${c.userId}/100`} alt={c.userName} className="w-9 h-9 rounded-full border border-slate-700 shrink-0" />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-200">{c.userName}</span>
                          <span className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700/50 shadow-sm">
                          <p className="text-sm text-slate-300 leading-relaxed">{c.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddComment} className="relative">
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Broadcast a tactical update..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-4 pb-14 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none shadow-inner"
                  rows={3}
                />
                <button 
                  type="submit"
                  disabled={!newComment.trim()}
                  className="absolute right-3 bottom-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-500/10 disabled:opacity-50 disabled:bg-slate-700"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase">Send</span>
                    <Send size={16} />
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Meta */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-6">
            <h3 className="font-bold text-lg mb-6 flex items-center text-slate-100">
              <History size={18} className="mr-2 text-slate-400" />
              Tactical Actions
            </h3>
            
            <div className="space-y-3">
              {[
                { status: IncidentStatus.INVESTIGATING, label: 'Start Investigating', icon: Play, color: 'orange' },
                { status: IncidentStatus.RESOLVED, label: 'Mark Resolved', icon: CheckCircle2, color: 'emerald' },
                { status: IncidentStatus.CLOSED, label: 'Close Incident', icon: History, color: 'slate' },
              ].map(action => (
                <button 
                  key={action.status}
                  disabled={incident.status === action.status}
                  onClick={() => handleStatusChange(action.status)}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border border-slate-700 transition-all disabled:opacity-30 group
                    ${action.color === 'orange' ? 'bg-slate-800/40 hover:bg-orange-950/20 hover:text-orange-400 hover:border-orange-500/30' : ''}
                    ${action.color === 'emerald' ? 'bg-slate-800/40 hover:bg-emerald-950/20 hover:text-emerald-400 hover:border-emerald-500/30' : ''}
                    ${action.color === 'slate' ? 'bg-slate-800/40 hover:bg-slate-700 hover:text-slate-200' : ''}
                  `}
                >
                  <div className="flex items-center">
                    <action.icon size={18} className="mr-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <span className="font-bold text-xs uppercase tracking-widest">{action.label}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <h3 className="font-bold text-sm mb-4 flex items-center text-slate-400 uppercase tracking-widest">
                <UserIcon size={14} className="mr-2" />
                Response Team
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                  <img src={`https://picsum.photos/seed/${incident.createdBy}/200`} className="w-8 h-8 rounded-full border border-slate-700" alt={incident.creatorName} />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-200 truncate">{incident.creatorName}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Primary Responder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
