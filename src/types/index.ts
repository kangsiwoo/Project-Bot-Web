// 백엔드 API 스키마에 매칭되는 TypeScript 타입 정의

// ── Auth ──
export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  email: string;
  username: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// ── Projects ──
export interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  name: string;
  description: string;
}

export interface ProjectMember {
  id: string;
  user_id: string;
  project_id: string;
  role: "owner" | "admin" | "member";
  user: User;
}

// ── Teams ──
export interface Team {
  id: string;
  name: string;
  project_id: string;
  created_at: string;
}

export interface TeamCreate {
  name: string;
}

// ── Channels ──
export interface Channel {
  id: string;
  name: string;
  team_id: string;
  channel_type: "text" | "notification";
  created_at: string;
}

export interface ChannelCreate {
  name: string;
  channel_type: "text" | "notification";
}

// ── Notifications ──
export type NotificationEventType =
  | "plan"
  | "question"
  | "complete"
  | "error"
  | "build"
  | "test"
  | "deploy";

export interface Notification {
  id: string;
  project_id: string;
  project_name: string;
  message: string;
  event_type: NotificationEventType;
  created_at: string;
}

export interface NotificationCreate {
  project_name: string;
  message: string;
  event_type: NotificationEventType;
}

export interface PaginatedNotifications {
  items: Notification[];
  next_cursor: string | null;
}

// ── Chat (WebSocket) ──
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  tool_calls?: ToolCall[];
  timestamp: string;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: string;
  duration_ms?: number;
}

// ── Devices ──
export interface Device {
  id: string;
  user_id: string;
  fcm_token: string;
  created_at: string;
}

export interface DeviceCreate {
  fcm_token: string;
}
