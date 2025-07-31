
export const utilitiesPlugin = function({ addUtilities }: any) {
  const newUtilities = {
    '.text-balance': {
      textWrap: 'balance',
    },
    '.text-pretty': {
      textWrap: 'pretty',
    },
  }
  addUtilities(newUtilities)
};
