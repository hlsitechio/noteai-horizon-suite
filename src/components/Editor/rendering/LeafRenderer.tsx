
import React from 'react';
import { RenderLeafProps } from 'slate-react';
import { CustomText } from '../types';

const LeafRenderer = ({ attributes, children, leaf }: RenderLeafProps) => {
  const customLeaf = leaf as CustomText;
  
  if (customLeaf.bold) {
    children = <strong className="font-semibold text-gray-900">{children}</strong>;
  }

  if (customLeaf.code) {
    children = (
      <code className="bg-gray-100 px-2 py-1 rounded-md text-sm font-mono border border-gray-200 text-gray-800">
        {children}
      </code>
    );
  }

  if (customLeaf.italic) {
    children = <em className="italic text-gray-700">{children}</em>;
  }

  if (customLeaf.underline) {
    children = <u className="underline decoration-2 underline-offset-2 decoration-blue-500">{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

export default LeafRenderer;
