// src/utils/imageAnalysis.js
export const generateImageHash = (filename, size) => {
  // Simple hash based on filename and size for consistent results
  let hash = 0;
  const str = filename + size;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

export const analyzeImageCharacteristics = (image) => {
  const hash = generateImageHash(image.filename, image.size || 1000000);
  
  // Use hash to generate consistent results for same image
  const seed = hash % 1000;
  
  return {
    waterQuality: 50 + (seed % 40), // 50-90
    turbidity: 10 + (seed % 50), // 10-60
    phLevel: (6.5 + (seed % 200) / 100).toFixed(1), // 6.5-8.5
    pollutionLevel: seed % 100,
    detectedObjects: Math.floor(seed / 100) + 3, // 3-12 objects
    confidence: 75 + (seed % 25), // 75-100%
  };
};