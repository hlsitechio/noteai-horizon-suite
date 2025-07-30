
export interface ExtractedColor {
  hex: string;
  hsl: string;
  rgb: { r: number; g: number; b: number };
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const rgbToHsl = (r: number, g: number, b: number): string => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const getColorDistance = (color1: number[], color2: number[]): number => {
  const [r1, g1, b1] = color1;
  const [r2, g2, b2] = color2;
  return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2));
};

const quantizeColors = (imageData: Uint8ClampedArray): number[][] => {
  const colorMap = new Map<string, number>();
  const step = 4;
  
  for (let i = 0; i < imageData.length; i += step * 4) {
    const r = Math.floor(imageData[i] / 32) * 32;
    const g = Math.floor(imageData[i + 1] / 32) * 32;
    const b = Math.floor(imageData[i + 2] / 32) * 32;
    const alpha = imageData[i + 3];
    
    if (alpha < 128) continue;
    
    const key = `${r},${g},${b}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }
  
  return Array.from(colorMap.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([color]) => color.split(',').map(Number));
};

export const extractDominantColor = async (file: File | string): Promise<ExtractedColor> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    if (file instanceof File && file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      
      video.onloadeddata = () => {
        video.currentTime = Math.min(2, video.duration / 4);
      };
      
      video.onseeked = () => {
        canvas.width = Math.min(video.videoWidth, 400);
        canvas.height = Math.min(video.videoHeight, 300);
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        try {
          const dominantColor = extractColorFromImageData(imageData.data);
          resolve(dominantColor);
        } catch (error) {
          reject(error);
        }
        
        video.remove();
      };
      
      video.onerror = () => reject(new Error('Error loading video'));
      video.src = URL.createObjectURL(file);
    } else {
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        canvas.width = Math.min(img.width, 400);
        canvas.height = Math.min(img.height, 300);
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        try {
          const dominantColor = extractColorFromImageData(imageData.data);
          resolve(dominantColor);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Error loading image'));
      
      if (typeof file === 'string') {
        img.src = file;
      } else {
        img.src = URL.createObjectURL(file);
      }
    }
  });
};

const extractColorFromImageData = (data: Uint8ClampedArray): ExtractedColor => {
  const colors = quantizeColors(data);
  
  if (colors.length === 0) {
    throw new Error('No colors found in image');
  }
  
  let bestColor = colors[0];
  let bestScore = 0;
  
  for (const color of colors) {
    const [r, g, b] = color;
    const saturation = Math.max(r, g, b) - Math.min(r, g, b);
    const brightness = (r + g + b) / 3;
    const score = saturation * 0.7 + brightness * 0.3;
    
    if (score > bestScore && brightness > 50 && brightness < 200) {
      bestScore = score;
      bestColor = color;
    }
  }
  
  const [r, g, b] = bestColor;
  const adjustedColor = adjustColorForAccent(r, g, b);
  
  return {
    hex: rgbToHex(adjustedColor.r, adjustedColor.g, adjustedColor.b),
    hsl: rgbToHsl(adjustedColor.r, adjustedColor.g, adjustedColor.b),
    rgb: adjustedColor
  };
};

const adjustColorForAccent = (r: number, g: number, b: number): { r: number; g: number; b: number } => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  const brightness = max / 255;
  
  let adjustedR = r, adjustedG = g, adjustedB = b;
  
  if (saturation < 0.3) {
    const factor = 1.5;
    const avg = (r + g + b) / 3;
    adjustedR = Math.min(255, avg + (r - avg) * factor);
    adjustedG = Math.min(255, avg + (g - avg) * factor);
    adjustedB = Math.min(255, avg + (b - avg) * factor);
  }
  
  if (brightness < 0.3) {
    const brightnessFactor = 1.3;
    adjustedR = Math.min(255, adjustedR * brightnessFactor);
    adjustedG = Math.min(255, adjustedG * brightnessFactor);
    adjustedB = Math.min(255, adjustedB * brightnessFactor);
  }
  
  return {
    r: Math.round(adjustedR),
    g: Math.round(adjustedG),
    b: Math.round(adjustedB)
  };
};
