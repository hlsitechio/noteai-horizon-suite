
import React from 'react';
import { RenderElementProps } from 'slate-react';
import { CustomElement } from '../types';

const ElementRenderer = ({ attributes, children, element }: RenderElementProps) => {
  const customElement = element as CustomElement;
  
  switch (customElement.type) {
    case 'block-quote':
      return (
        <blockquote {...attributes} className="border-l-4 border-blue-400 pl-6 py-2 italic text-gray-700 bg-gray-50 rounded-r-lg my-4">
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul {...attributes} className="list-disc list-inside space-y-1 my-4 pl-4 text-gray-700">
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 {...attributes} className="text-3xl font-bold mb-4 text-gray-900 leading-tight">
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 {...attributes} className="text-2xl font-semibold mb-3 text-gray-800 leading-tight">
          {children}
        </h2>
      );
    case 'list-item':
      return <li {...attributes} className="py-1 text-gray-700">{children}</li>;
    case 'numbered-list':
      return (
        <ol {...attributes} className="list-decimal list-inside space-y-1 my-4 pl-4 text-gray-700">
          {children}
        </ol>
      );
    case 'code-block':
      return (
        <pre {...attributes} className="bg-gray-900 border border-gray-200 p-4 rounded-lg font-mono text-sm my-4 overflow-x-auto text-gray-100">
          <code className="text-gray-100">{children}</code>
        </pre>
      );
    default:
      return <p {...attributes} className="mb-4 leading-relaxed text-gray-700">{children}</p>;
  }
};

export default ElementRenderer;
