const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = path.resolve('.');
const outDir = path.join(srcDir, 'thumbs');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

// sizes to create (width in px)
const sizes = [400, 800];

// filetypes to read
const files = fs.readdirSync(srcDir).filter(f => /\.(png|jpe?g)$/i.test(f));

if (files.length === 0) {
  console.log('No source images found in project root. Put your full-resolution images in the project root (e.g., city.png).');
  process.exit(0);
}

(async () => {
  for (const file of files) {
    const name = path.parse(file).name;
    const input = path.join(srcDir, file);
    for (const size of sizes) {
      const outPath = path.join(outDir, `${name}-${size}.jpg`);
      try {
        await sharp(input)
          .resize({ width: size, withoutEnlargement: true })
          .jpeg({ quality: 78 })
          .toFile(outPath);
        console.log(`wrote ${outPath}`);
      } catch (err) {
        console.error(`failed to process ${file} -> ${outPath}`);
        console.error(err);
      }
    }
  }
})();