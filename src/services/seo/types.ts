export interface FixableIssue {
  id: string;
  type: 'missing_h1' | 'broken_link' | 'large_image' | 'missing_alt' | 'duplicate_meta' | 'mobile_friendly' | 'https_certificate' | 'core_web_vitals' | 'page_speed' | 'technical_issue';
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  page_path?: string;
  element?: string;
  current_value?: string;
  target_value?: string;
}

export interface AutoFixResult {
  success: boolean;
  message: string;
  promptId?: string;
}