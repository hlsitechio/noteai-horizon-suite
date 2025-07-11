export interface ThemeColors {
  light: Record<string, string>;
  dark: Record<string, string>;
}

export interface PresetTheme {
  id: string;
  name: string;
  description: string;
  icon: any;
  colors: ThemeColors;
  preview: string;
}