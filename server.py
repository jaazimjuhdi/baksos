from http.server import HTTPServer, SimpleHTTPRequestHandler, ThreadingHTTPServer  # Add ThreadingHTTPServer
from urllib.parse import urlparse
import json
import os
import sys

class MyHandler(SimpleHTTPRequestHandler):
    def get_photos_with_thumbnails(self, folder):
        """Get list of photos with their thumbnails from a folder"""
        photos = []
        
        # Tambahkan awalan 'docs/' agar python mencari di tempat yang benar
        real_folder = os.path.join('docs', folder)
        
        if not os.path.exists(real_folder):
            print(f"Folder tidak ditemukan: {real_folder}")
            return photos
        
        try:
            files = [f for f in os.listdir(real_folder) 
                    if os.path.isfile(os.path.join(real_folder, f)) and 
                    f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))]
            
            files.sort()
            
            thumb_folder = os.path.join(real_folder, 'thumbnails')
            thumbnails = []
            if os.path.exists(thumb_folder):
                thumbnails = [f for f in os.listdir(thumb_folder) 
                            if os.path.isfile(os.path.join(thumb_folder, f)) and 
                            f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))]
                thumbnails.sort()
            
            for photo in files:
                name_without_ext = os.path.splitext(photo)[0]
                
                thumb = None
                for t in thumbnails:
                    if os.path.splitext(t)[0] == name_without_ext:
                        thumb = f'{folder}/thumbnails/{t}'
                        break
                
                # Perhatikan: kita tetap mengirimkan '{folder}/{photo}' (misal: tulakan/foto.jpg)
                photos.append({
                    'name': photo,
                    'full': f'{folder}/{photo}',
                    'thumb': thumb if thumb else f'{folder}/{photo}'
                })
        
        except Exception as e:
            print(f"Error reading {real_folder}: {e}")
        
        return photos

    def end_headers(self):
    # Tambah CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        # API endpoint untuk tulakan
        if self.path == '/api/tulakan':
            photos = self.get_photos_with_thumbnails('tulakan')
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(photos).encode())
        
        # API endpoint untuk pringkuku
        elif self.path == '/api/pringkuku':
            photos = self.get_photos_with_thumbnails('pringkuku')
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(photos).encode())
        
        # API endpoint untuk galeri (kombinasi tulakan + pringkuku)
        elif self.path == '/api/gallery':
            tulakan_photos = self.get_photos_with_thumbnails('tulakan')
            pringkuku_photos = self.get_photos_with_thumbnails('pringkuku')
            gallery = {
                'tulakan': tulakan_photos,
                'pringkuku': pringkuku_photos
            }
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(gallery).encode())
        
        # API lama untuk backward compatibility
        elif self.path == '/api/photos':
            photos = []
            if os.path.exists('Photo'):
                files = os.listdir('Photo')
                photos = [f'Photo/{f}' for f in sorted(files) 
                         if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))]
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(photos).encode())
        else:
            super().do_GET()
            
# Replace HTTPServer with ThreadingHTTPServer
port = int(os.environ.get('PORT', 8000))
server = ThreadingHTTPServer(('0.0.0.0', port), MyHandler)  # Changed this line
print(f"Server berjalan di port {port}")
server.serve_forever()