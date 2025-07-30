
export const getMobileLayoutClasses = (isMobile: boolean, isDistractionFree: boolean, isFocusMode: boolean) => {
  if (isMobile) {
    return {
      containerClass: 'p-2 h-screen overflow-hidden',
      headerClass: isDistractionFree || isFocusMode ? 'hidden' : 'mb-2',
      editorClass: 'h-full',
      titleClass: 'text-xl font-semibold mb-4',
      contentClass: 'h-[calc(100%-80px)]',
    };
  }

  return {
    containerClass: 'p-4 h-screen overflow-hidden',
    headerClass: 'mb-4',
    editorClass: 'h-full',
    titleClass: 'text-2xl font-bold mb-6',
    contentClass: 'h-[calc(100%-120px)]',
  };
};

export const getMobileFocusModeClasses = (isMobile: boolean, isZenMode: boolean) => {
  if (isMobile) {
    return {
      containerClass: 'w-full h-screen p-0',
      titleInputClass: 'pt-12 px-4 text-2xl font-bold',
      editorContentClass: 'h-[calc(100%-140px)] px-4 pb-4',
      placeholderText: 'Start writing...',
    };
  }

  return {
    containerClass: isZenMode ? 'max-w-4xl h-screen p-0' : 'max-w-6xl h-[95vh] p-6',
    titleInputClass: isZenMode ? 'pt-24 px-12 text-4xl font-bold' : 'pt-20 px-12 text-4xl font-bold',
    editorContentClass: isZenMode ? 'h-[calc(100%-140px)] px-12 pb-12' : 'h-[calc(100%-140px)] px-12 pb-6',
    placeholderText: 'Focus on your writing... Let your thoughts flow without any distractions.',
  };
};
