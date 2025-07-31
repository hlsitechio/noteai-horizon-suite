
export type Step = 'name' | 'email' | 'password' | 'confirmPassword' | 'summary';

export interface StepContent {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  placeholder: string;
  value: string;
  type: 'text' | 'email' | 'password';
  showEye?: boolean;
}

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
