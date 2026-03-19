#!/usr/bin/env python3
"""
Script to process new photos:
1. Convert NEF files to JPG (pringkuku folder)
2. Create WebP thumbnails for all photos in both folders
3. Maintain folder structure
"""

import os
import sys
from pathlib import Path
from PIL import Image
import rawpy

def convert_nef_to_jpg(nef_path, jpg_path, quality=95):
    """Convert NEF to JPG without quality loss"""
    try:
        print(f"  Converting {os.path.basename(nef_path)} to JPG...", end=" ")
        with rawpy.imread(nef_path) as raw:
            rgb = raw.postprocess()
            img = Image.fromarray(rgb)
            img.save(jpg_path, 'JPEG', quality=quality, optimize=False)
        print("✓")
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def create_webp_thumbnail(photo_path, thumb_path, max_size=500, quality=80):
    """Create WebP thumbnail with size under 1MB"""
    try:
        print(f"  Creating thumbnail for {os.path.basename(photo_path)}...", end=" ")
        img = Image.open(photo_path)
        
        # Maintain aspect ratio, resize to max_size
        img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        
        # Save as WebP
        img.save(thumb_path, 'WEBP', quality=quality, method=6)
        
        # Check size
        file_size = os.path.getsize(thumb_path) / (1024 * 1024)  # Size in MB
        if file_size > 1:
            print(f"⚠ (Size: {file_size:.2f}MB, reducing quality...)", end=" ")
            # Reduce quality if over 1MB
            for q in range(quality - 5, 40, -5):
                img.save(thumb_path, 'WEBP', quality=q, method=6)
                file_size = os.path.getsize(thumb_path) / (1024 * 1024)
                if file_size <= 1:
                    break
        
        print(f"✓ ({os.path.getsize(thumb_path) / 1024 / 1024:.2f}MB)")
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

def process_pringkuku():
    """Convert NEF files in pringkuku to JPG"""
    source_dir = Path("/workspaces/baksos/docs/new photo/pringkuku")
    dest_dir = Path("/workspaces/baksos/docs/pringkuku")
    
    print("\n=== Processing Pringkuku Photos ===")
    print(f"Source: {source_dir}")
    
    nef_files = list(source_dir.glob("*.NEF"))
    if not nef_files:
        nef_files = list(source_dir.glob("*.nef"))
    
    print(f"Found {len(nef_files)} NEF files")
    
    converted_files = []
    for nef_file in nef_files:
        jpg_filename = nef_file.stem + ".jpg"
        jpg_path = dest_dir / jpg_filename
        
        if convert_nef_to_jpg(str(nef_file), str(jpg_path)):
            converted_files.append(str(jpg_path))
    
    return converted_files

def process_tulakan():
    """Copy JPG files from new photo/tulakan to docs/tulakan"""
    source_dir = Path("/workspaces/baksos/docs/new photo/tulakan")
    dest_dir = Path("/workspaces/baksos/docs/tulakan")
    
    print("\n=== Processing Tulakan Photos ===")
    print(f"Source: {source_dir}")
    
    jpg_files = list(source_dir.glob("*.JPG"))
    if not jpg_files:
        jpg_files = list(source_dir.glob("*.jpg"))
    
    print(f"Found {len(jpg_files)} JPG files")
    
    copied_files = []
    for jpg_file in jpg_files:
        dest_path = dest_dir / jpg_file.name
        try:
            print(f"  Copying {jpg_file.name}...", end=" ")
            with open(jpg_file, 'rb') as src:
                with open(dest_path, 'wb') as dst:
                    dst.write(src.read())
            print("✓")
            copied_files.append(str(dest_path))
        except Exception as e:
            print(f"✗ Error: {e}")
    
    return copied_files

def create_thumbnails(file_paths, folder_name):
    """Create WebP thumbnails for given files"""
    dest_thumb_dir = Path(f"/workspaces/baksos/docs/{folder_name}/thumbnails")
    dest_thumb_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"\n=== Creating WebP Thumbnails for {folder_name} ===")
    print(f"Thumbnails destination: {dest_thumb_dir}")
    
    for photo_path in file_paths:
        photo_name = Path(photo_path).stem
        thumb_name = f"{photo_name}.webp"
        thumb_path = dest_thumb_dir / thumb_name
        
        create_webp_thumbnail(photo_path, str(thumb_path))

def main():
    print("📸 Photo Processing Script")
    print("=" * 50)
    
    # Ensure destination directories exist
    Path("/workspaces/baksos/docs/pringkuku").mkdir(parents=True, exist_ok=True)
    Path("/workspaces/baksos/docs/tulakan").mkdir(parents=True, exist_ok=True)
    Path("/workspaces/baksos/docs/pringkuku/thumbnails").mkdir(parents=True, exist_ok=True)
    Path("/workspaces/baksos/docs/tulakan/thumbnails").mkdir(parents=True, exist_ok=True)
    
    # Process pringkuku (NEF to JPG)
    pringkuku_photos = process_pringkuku()
    
    # Process tulakan (copy JPG)
    tulakan_photos = process_tulakan()
    
    # Create thumbnails
    if pringkuku_photos:
        create_thumbnails(pringkuku_photos, "pringkuku")
    if tulakan_photos:
        create_thumbnails(tulakan_photos, "tulakan")
    
    print("\n" + "=" * 50)
    print("✓ Processing complete!")
    print(f"  Pringkuku: {len(pringkuku_photos)} photos processed")
    print(f"  Tulakan: {len(tulakan_photos)} photos processed")

if __name__ == "__main__":
    main()
