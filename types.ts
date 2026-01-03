
export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR'
}

export enum IncidentStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum IncidentPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  enabled: boolean;
}

export interface IncidentComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  createdBy: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  comments: IncidentComment[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityId: string;
  entityType: 'INCIDENT' | 'USER' | 'AUTH';
  timestamp: string;
  details: string;
}

export interface SystemStats {
  total: number;
  open: number;
  investigating: number;
  resolved: number;
  critical: number;
}
