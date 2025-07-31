import React from 'react';

interface FormattedMessageProps {
  content: string;
  isUser: boolean;
}

const FormattedMessage: React.FC<FormattedMessageProps> = ({ content, isUser }) => {
  if (isUser) {
    return <p className="text-sm whitespace-pre-wrap">{content}</p>;
  }

  // Format AI messages with markdown-like parsing
  const formatContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];
    let currentListType: 'ul' | 'ol' | null = null;
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          currentListType === 'ol' ? (
            <ol key={elements.length} className="list-decimal list-inside space-y-1 ml-4">
              {currentList}
            </ol>
          ) : (
            <ul key={elements.length} className="list-disc list-inside space-y-1 ml-4">
              {currentList}
            </ul>
          )
        );
        currentList = [];
        currentListType = null;
      }
    };

    const flushCodeBlock = () => {
      if (codeBlockContent.length > 0) {
        elements.push(
          <pre key={elements.length} className="bg-muted/50 rounded p-3 text-xs font-mono overflow-x-auto border">
            <code>{codeBlockContent.join('\n')}</code>
          </pre>
        );
        codeBlockContent = [];
        inCodeBlock = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Handle code blocks
      if (trimmedLine === '```' || trimmedLine.startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock();
        } else {
          flushList();
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Handle horizontal rules
      if (trimmedLine === '---' || trimmedLine === '___') {
        flushList();
        elements.push(<hr key={elements.length} className="my-4 border-border" />);
        return;
      }

      // Handle headings
      if (trimmedLine.startsWith('###')) {
        flushList();
        const text = trimmedLine.replace(/^###\s*/, '');
        elements.push(
          <h3 key={elements.length} className="text-lg font-semibold mt-4 mb-2 text-foreground">
            {formatInlineText(text)}
          </h3>
        );
        return;
      }

      if (trimmedLine.startsWith('##')) {
        flushList();
        const text = trimmedLine.replace(/^##\s*/, '');
        elements.push(
          <h2 key={elements.length} className="text-xl font-semibold mt-4 mb-2 text-foreground">
            {formatInlineText(text)}
          </h2>
        );
        return;
      }

      if (trimmedLine.startsWith('#')) {
        flushList();
        const text = trimmedLine.replace(/^#\s*/, '');
        elements.push(
          <h1 key={elements.length} className="text-2xl font-bold mt-4 mb-3 text-foreground">
            {formatInlineText(text)}
          </h1>
        );
        return;
      }

      // Handle numbered lists
      if (/^\d+\.\s/.test(trimmedLine)) {
        if (currentListType !== 'ol') {
          flushList();
          currentListType = 'ol';
        }
        const text = trimmedLine.replace(/^\d+\.\s*/, '');
        currentList.push(
          <li key={`${elements.length}-${currentList.length}`} className="text-sm">
            {formatInlineText(text)}
          </li>
        );
        return;
      }

      // Handle bullet points and checkboxes
      if (trimmedLine.startsWith('- [ ]') || trimmedLine.startsWith('- [x]') || 
          trimmedLine.startsWith('* [ ]') || trimmedLine.startsWith('* [x]')) {
        if (currentListType !== 'ul') {
          flushList();
          currentListType = 'ul';
        }
        const isChecked = trimmedLine.includes('[x]');
        const text = trimmedLine.replace(/^[-*]\s*\[[ x]\]\s*/, '');
        currentList.push(
          <li key={`${elements.length}-${currentList.length}`} className="text-sm flex items-start gap-2">
            <input 
              type="checkbox" 
              checked={isChecked} 
              readOnly 
              className="mt-0.5 rounded border-border"
            />
            <span className={isChecked ? 'line-through text-muted-foreground' : ''}>
              {formatInlineText(text)}
            </span>
          </li>
        );
        return;
      }

      // Handle regular bullet points
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        if (currentListType !== 'ul') {
          flushList();
          currentListType = 'ul';
        }
        const text = trimmedLine.replace(/^[-*]\s*/, '');
        currentList.push(
          <li key={`${elements.length}-${currentList.length}`} className="text-sm">
            {formatInlineText(text)}
          </li>
        );
        return;
      }

      // Handle regular paragraphs
      if (trimmedLine) {
        flushList();
        elements.push(
          <p key={elements.length} className="text-sm leading-relaxed mb-2">
            {formatInlineText(trimmedLine)}
          </p>
        );
      } else if (elements.length > 0) {
        // Add spacing for empty lines
        flushList();
        elements.push(<div key={elements.length} className="h-2" />);
      }
    });

    // Flush any remaining content
    flushList();
    flushCodeBlock();

    return elements;
  };

  const formatInlineText = (text: string) => {
    // Handle inline code
    text = text.replace(/`([^`]+)`/g, '<code class="bg-muted/50 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
    
    // Handle bold text
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>');
    
    // Handle italic text
    text = text.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
    
    // Handle links (basic)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <div className="space-y-2">
      {formatContent(content)}
    </div>
  );
};

export default FormattedMessage;