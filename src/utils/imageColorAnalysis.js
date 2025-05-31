// src/utils/imageColorAnalysis.js
export const analyzeImageColors = (imageElement) => {
 const canvas = document.createElement('canvas');
 const ctx = canvas.getContext('2d');
 
 canvas.width = imageElement.naturalWidth;
 canvas.height = imageElement.naturalHeight;
 ctx.drawImage(imageElement, 0, 0);
 
 const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
 const data = imageData.data;
 
 let cleanPixels = 0;
 let totalPixels = data.length / 4;
 const pollutedRegions = [];
 
 for (let i = 0; i < data.length; i += 4) {
   const r = data[i];
   const g = data[i + 1];
   const b = data[i + 2];
   
   // Check for light colors (white, light gray)
   const isLight = r > 200 && g > 200 && b > 200;
   
   // Check for blue shades (clean water)
   const isBlueWater = b > r && b > g && b > 80;
   
   // Check for polluted colors (dark/brown/black shades)
   const isDark = r < 100 && g < 100 && b < 100; // Dark colors
   const isBrown = r > g && g > b && r > 80 && r < 200; // Brown shades
   const isBlack = r < 50 && g < 50 && b < 50; // Black
   
   const isPolluted = isDark || isBrown || isBlack;
   const isClean = isLight || isBlueWater;
   
   if (isClean && !isPolluted) {
     cleanPixels++;
   } else if (isPolluted) {
     // Mark polluted areas
     const x = (i / 4) % canvas.width;
     const y = Math.floor((i / 4) / canvas.width);
     
     if (Math.random() < 0.02) { // Sample 2% for better coverage
       pollutedRegions.push({ x, y });
     }
   }
 }
 
 const cleanPercentage = (cleanPixels / totalPixels) * 100;
 const waterQuality = Math.min(cleanPercentage, 100);
 
 return {
   waterQuality: Math.round(waterQuality),
   cleanPercentage: Math.round(cleanPercentage),
   pollutedRegions,
   totalPixels
 };
};

export const createPollutionOverlay = (pollutedRegions, imageWidth, imageHeight) => {
 const regions = [];
 const gridSize = 40; // Smaller grid for better detection
 
 for (let y = 0; y < imageHeight; y += gridSize) {
   for (let x = 0; x < imageWidth; x += gridSize) {
     const regionPixels = pollutedRegions.filter(
       p => p.x >= x && p.x < x + gridSize && p.y >= y && p.y < y + gridSize
     );
     
     if (regionPixels.length > 0) {
       regions.push({
         id: `${x}-${y}`,
         x: (x / imageWidth) * 100,
         y: (y / imageHeight) * 100,
         width: (gridSize / imageWidth) * 100,
         height: (gridSize / imageHeight) * 100,
         intensity: Math.min(regionPixels.length * 15, 100)
       });
     }
   }
 }
 
 return regions;
};