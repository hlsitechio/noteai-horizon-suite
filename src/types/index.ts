// Comprehensive TypeScript interfaces to replace 'any' types
export interface Note {
  id: string;
  title: string;
  content: string | null;
  content_type?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  folder_id: string | null;
  tags: string[] | null;
  is_favorite?: boolean | null;
  reminder_date?: string | null;
  reminder_enabled?: boolean | null;
  reminder_frequency?: string | null;
  reminder_status?: string | null;
  // Common date aliases
  createdAt?: string;
  updatedAt?: string;
  isFavorite?: boolean | null;
}

export interface Folder {
  id: string;
  name: string;
  parent_folder_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  welcome_message: string | null;
}

export interface DashboardSettings {
  id: string;
  user_id: string;
  settings: DashboardConfig;
  dashboard_edit_mode: boolean | null;
  sidebar_edit_mode: boolean | null;
  edit_mode_expires_at: string | null;
  selected_banner_type: string | null;
  selected_banner_url: string | null;
  sidebar_panel_sizes: PanelSizes | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardConfig {
  theme: string;
  layout: LayoutConfig;
  components: ComponentConfig[];
  preferences: UserPreferences;
}

export interface LayoutConfig {
  type: 'grid' | 'flex' | 'custom';
  columns: number;
  gap: number;
  padding: number;
}

export interface ComponentConfig {
  id: string;
  type: string;
  position: Position;
  size: Size;
  config: Record<string, unknown>;
  enabled: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface PanelSizes {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  ai: AISettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  reminders: boolean;
  updates: boolean;
}

export interface AISettings {
  model: string;
  suggestions_enabled: boolean;
  auto_save_enabled: boolean;
  context_awareness_enabled: boolean;
  smart_formatting_enabled: boolean;
}

export interface AnalyticsData {
  totalNotes: number;
  favoriteNotes: number;
  categoryCounts: Record<string, number>;
  weeklyNotes: number;
  notes: Note[];
  timeBasedData: TimeSeriesData[];
}

export interface TimeSeriesData {
  date: string;
  count: number;
  favorites: number;
  categories: Record<string, number>;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TooltipData {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload?: Record<string, unknown>;
  }>;
  label?: string;
}

export interface CustomEventData {
  type: string;
  data: Record<string, unknown>;
  timestamp: number;
  userId?: string;
}

export interface ErrorInfo {
  message: string;
  stack?: string;
  component?: string;
  timestamp: number;
  userId?: string;
}

export interface PerformanceMetrics {
  renderTime: number;
  loadTime: number;
  memoryUsage?: number;
  component: string;
  timestamp: number;
}

// Particle system types
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius?: number;
  size: number;
  opacity: number;
  color: string;
  phase?: number;
  pulsePhase?: number;
  connectionDistance?: number;
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}

// Editor types
export interface EditorElement {
  type: string;
  children: EditorNode[];
  [key: string]: unknown;
}

export interface EditorLeaf {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  [key: string]: unknown;
}

export type EditorNode = EditorElement | EditorLeaf;

export interface EditorSelection {
  anchor: EditorPoint;
  focus: EditorPoint;
  [key: string]: unknown;
}

export interface EditorPoint {
  path: number[];
  offset: number;
}

// API Response types
export interface APIResponse<T = unknown> {
  data: T;
  error: string | null;
  status: number;
  timestamp: number;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form types
export interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Error handling types
export interface AppError extends Error {
  code?: string;
  context?: Record<string, unknown>;
  timestamp: number;
  userId?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: {
    componentStack?: string;
  };
}