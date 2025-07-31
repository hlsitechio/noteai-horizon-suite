import { FileText, Clock, Search, Trash2, PenTool, BookOpen, Languages, Zap, Type, Filter, Sparkles } from 'lucide-react';

export const getActionIcon = (actionType: string) => {
  switch (actionType) {
    case 'create_note': return <FileText className="w-3 h-3" />;
    case 'set_reminder': return <Clock className="w-3 h-3" />;
    case 'search_notes': return <Search className="w-3 h-3" />;
    case 'delete_note': return <Trash2 className="w-3 h-3" />;
    case 'improve_text': return <PenTool className="w-3 h-3" />;
    case 'summarize_text': return <BookOpen className="w-3 h-3" />;
    case 'translate_text': return <Languages className="w-3 h-3" />;
    case 'check_grammar': return <Zap className="w-3 h-3" />;
    case 'adjust_tone': return <Type className="w-3 h-3" />;
    case 'expand_content': return <Filter className="w-3 h-3" />;
    case 'extract_keywords': return <Search className="w-3 h-3" />;
    default: return <Sparkles className="w-3 h-3" />;
  }
};