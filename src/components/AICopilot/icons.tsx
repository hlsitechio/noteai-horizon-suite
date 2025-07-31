
import React from 'react';
import { 
  Sparkles, 
  Languages, 
  FileText, 
  Expand, 
  Minimize2, 
  Wand2, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  BarChart3, 
  X,
  Check
} from 'lucide-react';

export const ImproveIcon = () => <Sparkles className="w-4 h-4" />;
export const TranslateIcon = () => <Languages className="w-4 h-4" />;
export const SummarizeIcon = () => <FileText className="w-4 h-4" />;
export const ExpandIcon = () => <Expand className="w-4 h-4" />;
export const SimplifyIcon = () => <Minimize2 className="w-4 h-4" />;
export const CustomIcon = () => <Wand2 className="w-4 h-4" />;
export const ThumbsUpIcon = () => <ThumbsUp className="w-4 h-4" />;
export const ThumbsDownIcon = () => <ThumbsDown className="w-4 h-4" />;
export const AnalyticsIcon = () => <BarChart3 className="w-4 h-4" />;
export const CloseIcon = () => <X className="w-4 h-4" />;

interface CopyIconProps {
  isCopied?: boolean;
}

export const CopyIcon: React.FC<CopyIconProps> = ({ isCopied = false }) => (
  isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />
);
