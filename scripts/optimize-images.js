const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../public/images/hero');
const outputDir = path.join(__dirname, '../public/images/hero/optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all jpg files
const files = fs.readdirSync(inputDir).filter(file =>
  file.toLowerCase().endsWith('.jpg') && !file.includes('optimized')
);

console.log(`Found ${files.length} images to optimize...\n`);

async function optimizeImages() {
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    try {
      const stats = fs.statSync(inputPath);
      const originalSize = stats.size;

      await sharp(inputPath)
        .resize(1920, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({
          quality: 85,
          progressive: true,
          mozjpeg: true
        })
        .toFile(outputPath);

      const newStats = fs.statSync(outputPath);
      const newSize = newStats.size;
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

      console.log(`✓ ${file}`);
      console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`  Optimized: ${(newSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`  Savings: ${savings}%\n`);
    } catch (error) {
      console.error(`✗ Error optimizing ${file}:`, error.message);
    }
  }

  console.log('Image optimization complete!');
  console.log(`\nOptimized images saved to: ${outputDir}`);
  console.log('\nTo use optimized images, update your code to reference /images/hero/optimized/');
}

optimizeImages();
