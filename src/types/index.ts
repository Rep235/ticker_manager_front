// Authentication & User
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  role?: 'ADMIN' | 'AGENT' | 'CLIENT';
}

export interface AuthResponse {
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Setup / Bootstrap
export interface SetupStatus {
  needsAdmin: boolean;
  hasUsers: boolean;
  message?: string;
}

export interface BootstrapAdminPayload {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName?: string;
}

export interface BootstrapAdminResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN';
  companyId: string;
  isActive: boolean;
  token: string;
}
}

// Tickets
export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_ON_CLIENT'
  | 'WAITING_ON_AGENT'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ClosureReason =
  | 'RESOLVED'
  | 'DUPLICATE'
  | 'WONT_FIX'
  | 'CANNOT_REPRODUCE'
  | 'CLIENT_NO_RESPONSE'
  | 'CANCELLED_BY_CLIENT'
  | 'SPAM'
  | 'OTHER';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  clientId: string;
  assignedAgentId?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  closureReason?: ClosureReason;
  closureNote?: string;
  tags?: string[];
  client?: Client;
  assignedAgent?: User;
  commentsCount?: number;
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  clientId: string;
  priority?: TicketPriority;
  assignedAgentId?: string;
  tags?: string[];
  dueDate?: string;
}

export interface UpdateTicketPayload {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedAgentId?: string;
  closureReason?: ClosureReason;
  closureNote?: string;
  tags?: string[];
  dueDate?: string;
}

// Clients
export type ClientTier = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  tier: ClientTier;
  isActive: boolean;
  createdAt: string;
}

export interface CreateClientPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  tier?: ClientTier;
}

export interface UpdateClientPayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  tier?: ClientTier;
  isActive?: boolean;
}

// Comments
export interface Comment {
  id: string;
  content: string;
  ticketId: string;
  authorId: string;
  author?: User;
  isInternal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentPayload {
  content: string;
  ticketId: string;
  authorId: string;
  isInternal?: boolean;
}

export interface UpdateCommentPayload {
  content?: string;
  isInternal?: boolean;
}

// Permissions
export interface Permission {
  id: string;
  resource: string;
  action: string;
  description?: string;
}

// API Errors
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
