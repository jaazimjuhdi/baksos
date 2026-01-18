#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Use ffmpeg-static if available, otherwise use system ffmpeg
let ffmpegPath;
try {
  ffmpegPath = require('ffmpeg-static');
} catch (e) {
  ffmpegPath = 'ffmpeg';
}

const srcDir = path.resolve('.');
const outDir = path.join(srcDir, 'thumbs');

// Create thumbs directory if it doesn't exist
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Find all video files
const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.MP4', '.WEBM'];
const files = fs.readdirSync(srcDir).filter(f => {
  const ext = path.extname(f);
  const fullPath = path.join(srcDir, f);
  const stats = fs.statSync(fullPath);
  
  // Check if extension matches and file is not empty
  if (videoExtensions.includes(ext)) {
    if (stats.size === 0) {
      console.warn(`⚠ Skipping ${f}: file is empty`);
      return false;
    }
    return true;
  }
  return false;
});

if (files.length === 0) {
  console.log('No video files found in project root.');
  process.exit(0);
}

// Function to generate GIF from video (3 seconds)
function generateGifFromVideo(inputFile, outputFile) {
  return new Promise((resolve) => {
    const duration = 3; // 3 seconds
    const fps = 10; // frames per second for smooth animation
    
    console.log(`Generating GIF: ${outputFile}`);
    
    // ffmpeg command to extract 3 seconds and convert to GIF
    const args = [
      '-i', inputFile,
      '-ss', '0',
      '-t', duration.toString(),
      '-vf', `fps=${fps},scale=400:-1:flags=lanczos`,
      '-y',
      outputFile
    ];

    const ffmpeg = spawn(ffmpegPath, args, { 
      stdio: ['ignore', 'pipe', 'pipe']
    });

    ffmpeg.stderr.on('data', (data) => {
      // ffmpeg writes progress to stderr, we'll ignore it
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log(`✓ Created: ${outputFile}`);
        resolve(true);
      } else {
        console.error(`✗ Failed to process ${inputFile}`);
        resolve(false);
      }
    });

    ffmpeg.on('error', (err) => {
      console.error(`✗ Error with ${inputFile}: ${err.message}`);
      resolve(false);
    });
  });
}

// Process each video file
(async () => {
  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    const name = path.parse(file).name;
    const inputPath = path.join(srcDir, file);
    const outputPath = path.join(outDir, `${name}-thumb.gif`);

    if (await generateGifFromVideo(inputPath, outputPath)) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\nCompleted: ${successCount} succeeded, ${failCount} failed`);
  if (failCount > 0) {
    process.exit(1);
  }
})();
