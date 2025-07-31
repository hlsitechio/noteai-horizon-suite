import React from 'react';
import FontFamilySelector from './FontFamilySelector';
import FontSizeControl from './FontSizeControl';

interface FontControlsGroupProps {
  fontFamily: string;
  fontSize: number;
  onFontFamilyChange: (fontFamily: string) => void;
  onFontSizeChange: (fontSize: number) => void;
}

const FontControlsGroup: React.FC<FontControlsGroupProps> = ({
  fontFamily,
  fontSize,
  onFontFamilyChange,
  onFontSizeChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <FontFamilySelector
        value={fontFamily}
        onChange={onFontFamilyChange}
      />
      <FontSizeControl
        fontSize={fontSize}
        onChange={onFontSizeChange}
      />
    </div>
  );
};

export default FontControlsGroup;