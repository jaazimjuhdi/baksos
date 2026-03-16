# Video GIF Thumbnail Generator

This project includes a script to automatically generate 3-second animated GIF thumbnails from video files.

## Setup

### Prerequisites
- Node.js installed
- FFmpeg installed on your system

**Install FFmpeg:**
- **Ubuntu/Debian**: `sudo apt-get install ffmpeg`
- **macOS**: `brew install ffmpeg`
- **Windows**: Download from https://ffmpeg.org/download.html

### Install Dependencies
```bash
npm install
```

## Usage

### Generate Video GIF Thumbnails
Place your video files (MP4, WebM, MOV, AVI, MKV, FLV) in the project root, then run:

```bash
npm run generate-video-thumbs
```

This will:
- Extract the first 3 seconds from each video
- Create an animated GIF at 10 FPS
- Scale to 400px width for thumbnails
- Save to `thumbs/VIDEONAME-thumb.gif`

### Update Gallery HTML

When adding video gallery items, use this format:
```html
<a class="gallery-item" href="yourvideofile.mp4">
    <img loading="lazy" decoding="async" 
         src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" 
         data-full="thumbs/yourvideofile-thumb.gif" 
         alt="Description">
</a>
```

The `data-full` attribute will be loaded by the image-loader.js script.

## How It Works

1. **generate-video-thumbs.js** - Node.js script that:
   - Scans the project root for video files
   - Uses FFmpeg to extract 3 seconds of video
   - Converts to an optimized animated GIF
   - Saves thumbnails to the `thumbs/` directory

2. **image-loader.js** - Browser script that:
   - Loads placeholder GIFs from `data-full` attributes
   - Displays them as animated thumbnail previews
   - Handles lazy loading and error recovery

## GIF Settings

Edit `scripts/generate-video-thumbs.js` to customize:
- **duration**: Change `3` to desired seconds (line 24)
- **fps**: Change `10` to adjust animation smoothness (line 25)
- **width**: Change `400` in the vf filter to adjust thumbnail width

Example for 5-second GIF at 8 FPS:
```javascript
const duration = 5;
const fps = 8;
```
