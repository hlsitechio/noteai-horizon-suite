
import React from 'react';
import { RenderElementProps } from 'slate-react';
import { CustomElement } from '../types';

const ElementRenderer = ({ attributes, children, element }: RenderElementProps) => {
  const customElement = element as CustomElement;
  
  switch (customElement.type) {
    case 'block-quote':
      return (
        <blockquote {...attributes} className="border-l-4 border-primary/40 pl-6 py-2 italic text-muted-foreground bg-muted/20 rounded-r-lg my-4 dark:border-blue-500/50 dark:text-slate-400 dark:bg-slate-800/40">
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul {...attributes} className="list-disc list-inside space-y-1 my-4 pl-4 dark:text-slate-300">
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 {...attributes} className="text-3xl font-bold mb-4 text-foreground leading-tight dark:text-slate-100">
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 {...attributes} className="text-2xl font-semibold mb-3 text-foreground leading-tight dark:text-slate-200">
          {children}
        </h2>
      );
    case 'list-item':
      return <li {...attributes} className="py-1 dark:text-slate-300">{children}</li>;
    case 'numbered-list':
      return (
        <ol {...attributes} className="list-decimal list-inside space-y-1 my-4 pl-4 dark:text-slate-300">
          {children}
        </ol>
      );
    case 'code-block':
      return (
        <pre {...attributes} className="bg-muted/50 border border-border p-4 rounded-lg font-mono text-sm my-4 overflow-x-auto dark:bg-slate-800/80 dark:border-slate-600 dark:text-slate-200">
          <code className="text-foreground dark:text-slate-200">{children}</code>
        </pre>
      );
    default:
      return <p {...attributes} className="mb-4 leading-relaxed text-foreground dark:text-slate-300">{children}</p>;
  }
};

export default ElementRenderer;
