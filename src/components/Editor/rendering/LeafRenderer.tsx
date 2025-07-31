
import React from 'react';
import { RenderLeafProps } from 'slate-react';
import { CustomText } from '../types';

const LeafRenderer = ({ attributes, children, leaf }: RenderLeafProps) => {
  const customLeaf = leaf as CustomText;
  
  if (customLeaf.bold) {
    children = <strong className="font-semibold text-slate-100">{children}</strong>;
  }

  if (customLeaf.code) {
    children = (
      <code className="bg-slate-800 px-2 py-1 rounded-md text-sm font-mono border border-slate-600 text-blue-300">
        {children}
      </code>
    );
  }

  if (customLeaf.italic) {
    children = <em className="italic text-slate-200">{children}</em>;
  }

  if (customLeaf.underline) {
    children = <u className="underline decoration-2 underline-offset-2 decoration-blue-400">{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

export default LeafRenderer;
