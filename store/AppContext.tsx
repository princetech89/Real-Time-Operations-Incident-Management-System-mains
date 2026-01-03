import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Incident, AuditLog, UserRole, IncidentStatus, IncidentPriority, SystemStats, IncidentComment } from '../types';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  incidents: Incident[];
  addIncident: (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  addComment: (incidentId: string, content: string) => void;
  auditLogs: AuditLog[];
  users: User[];
  updateUserRole: (id: string, role: UserRole) => void;
  toggleUserStatus: (id: string) => void;
  stats: SystemStats;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_USERS: User[] = [
  { id: 'u1', email: 'admin@sentinel.ops', name: 'Commander Shepard', role: UserRole.ADMIN, avatar: 'https://picsum.photos/seed/admin/200', enabled: true },
  { id: 'u2', email: 'op@sentinel.ops', name: 'Garrus Vakarian', role: UserRole.OPERATOR, avatar: 'https://picsum.photos/seed/op/200', enabled: true },
];

const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-1',
    title: 'Database Latency Spike - Region EU-WEST-1',
    description: 'Significant latency observed in RDS instances. Response times > 2000ms.',
    status: IncidentStatus.INVESTIGATING,
    priority: IncidentPriority.CRITICAL,
    createdBy: 'u2',
    creatorName: 'Garrus Vakarian',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    comments: [
      { id: 'c1', userId: 'u2', userName: 'Garrus Vakarian', content: 'Calibrating scanners. Investigating read replicas.', createdAt: new Date(Date.now() - 3000000).toISOString() }
    ]
  },
  {
    id: 'inc-2',
    title: 'UI Component Library Deprecation',
    description: 'Need to migrate legacy buttons to new Sentinel v2 specs.',
    status: IncidentStatus.OPEN,
    priority: IncidentPriority.LOW,
    createdBy: 'u1',
    creatorName: 'Commander Shepard',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    comments: []
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sentinel_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sentinel_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sentinel_user');
    }
  }, [currentUser]);

  const addLog = useCallback((action: string, entityId: string, entityType: 'INCIDENT' | 'USER' | 'AUTH', details: string) => {
    if (!currentUser) return;
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      entityId,
      entityType,
      timestamp: new Date().toISOString(),
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [currentUser]);

  const addIncident = (data: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    if (!currentUser) return;
    const newIncident: Incident = {
      ...data,
      id: `inc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    setIncidents(prev => [newIncident, ...prev]);
    addLog('CREATE', newIncident.id, 'INCIDENT', `Created: ${newIncident.title}`);
  };

  const updateIncidentStatus = (id: string, status: IncidentStatus) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        addLog('UPDATE_STATUS', id, 'INCIDENT', `Status changed from ${inc.status} to ${status}`);
        return { ...inc, status, updatedAt: new Date().toISOString() };
      }
      return inc;
    }));
  };

  const addComment = (incidentId: string, content: string) => {
    if (!currentUser) return;
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        // Fix: Use IncidentComment interface imported from types.ts
        const newComment: IncidentComment = {
          id: `comment-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          content,
          createdAt: new Date().toISOString()
        };
        addLog('ADD_COMMENT', incidentId, 'INCIDENT', `New comment added`);
        return { ...inc, comments: [...inc.comments, newComment], updatedAt: new Date().toISOString() };
      }
      return inc;
    }));
  };

  const updateUserRole = (id: string, role: UserRole) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        addLog('UPDATE_USER_ROLE', id, 'USER', `Role changed to ${role}`);
        return { ...u, role };
      }
      return u;
    }));
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        addLog('TOGGLE_USER_STATUS', id, 'USER', `Status toggled to ${!u.enabled}`);
        return { ...u, enabled: !u.enabled };
      }
      return u;
    }));
  };

  const logout = () => {
    if (currentUser) addLog('LOGOUT', currentUser.id, 'AUTH', 'User logged out');
    setCurrentUser(null);
  };

  const stats: SystemStats = {
    total: incidents.length,
    open: incidents.filter(i => i.status === IncidentStatus.OPEN).length,
    investigating: incidents.filter(i => i.status === IncidentStatus.INVESTIGATING).length,
    resolved: incidents.filter(i => i.status === IncidentStatus.RESOLVED).length,
    critical: incidents.filter(i => i.priority === IncidentPriority.CRITICAL).length
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      incidents, addIncident, updateIncidentStatus, addComment,
      auditLogs, users, updateUserRole, toggleUserStatus,
      stats, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
