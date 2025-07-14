// Core type definitions for the application

export type { User, Session } from '@supabase/supabase-js'

// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  success: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Component props types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Form types
export interface FormState<T = Record<string, any>> {
  data: T
  errors: Partial<Record<keyof T, string>>
  isLoading: boolean
  isValid: boolean
}

// Dashboard types
export interface DashboardWorkspace {
  id: string
  user_id: string
  workspace_name: string
  is_default: boolean
  dashboard_layout?: any
  sidebar_layout?: any
  theme_settings?: any
  banner_settings?: any
  custom_settings?: any
  panel_sizes?: any
  created_at: string
  updated_at: string
}

// Security types
export interface SecurityContext {
  userId?: string
  ipAddress?: string
  userAgent?: string
  sessionId?: string
}

export interface SecurityResult {
  allowed: boolean
  reason?: string
}

// Error types
export interface AppError extends Error {
  code?: string
  statusCode?: number
  context?: Record<string, any>
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}