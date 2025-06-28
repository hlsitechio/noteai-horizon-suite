
import React from 'react';
import { RenderLeafProps } from 'slate-react';
import { CustomText } from '../types';

const LeafRenderer = ({ attributes, children, leaf }: RenderLeafProps) => {
  const customLeaf = leaf as CustomText;
  
  if (customLeaf.bold) {
    children = <strong className="font-semibold dark:text-slate-100">{children}</strong>;
  }

  if (customLeaf.code) {
    children = (
      <code className="bg-muted px-2 py-1 rounded-md text-sm font-mono border border-border dark:bg-slate-800 dark:text-blue-300 dark:border-slate-600">
        {children}
      </code>
    );
  }

  if (customLeaf.italic) {
    children = <em className="italic dark:text-slate-300">{children}</em>;
  }

  if (customLeaf.underline) {
    children = <u className="underline decoration-2 underline-offset-2 dark:decoration-blue-400/70">{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

export default LeafRenderer;
