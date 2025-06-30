
import React from 'react';
import FontFamilySelector from './FontFamilySelector';
import FontSizeControl from './FontSizeControl';

interface FontControlsSectionProps {
  fontFamily: string;
  fontSize: number;
  onFontFamilyChange: (fontFamily: string) => void;
  onFontSizeChange: (fontSize: number) => void;
}

const FontControlsSection: React.FC<FontControlsSectionProps> = ({
  fontFamily,
  fontSize,
  onFontFamilyChange,
  onFontSizeChange
}) => {
  return (
    <>
      <FontFamilySelector
        value={fontFamily}
        onChange={onFontFamilyChange}
      />
      <FontSizeControl
        fontSize={fontSize}
        onChange={onFontSizeChange}
      />
    </>
  );
};

export default FontControlsSection;
