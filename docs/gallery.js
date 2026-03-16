document.addEventListener('DOMContentLoaded', function() {
    // Hamburger toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    menuToggle.addEventListener('click', function() {
        sidebar.style.display = sidebar.style.display === 'flex' ? 'none' : 'flex';
    });

    // Gallery setup
    const ratioSequence = [
        '1-1', '1-1', '1-1',      // row 1: tiga foto square
        '3-2', '3-2',              // row 2: dua foto landscape
        '1-2', '1-2',              // row 3: dua foto portrait
        '2-1', '2-1'               // row 4: dua foto wide
    ];

    const gallery = document.getElementById('gallery');
    
    const addPhoto = (src, altName) => {
        const index = gallery.children.length;
        const ratio = ratioSequence[index % ratioSequence.length];
        
        const item = document.createElement('div');
        item.className = `item ratio-${ratio}`;
        
        const img = document.createElement('img');
        img.src = src;
        img.alt = altName || 'Photo';
        
        // Tambahkan event click untuk memperbesar jika diinginkan
        img.style.cursor = 'pointer';
        
        item.appendChild(img);
        gallery.appendChild(item);
    };

    // --- BAGIAN FETCH DINAMIS ---
    
    // 1. Deteksi URL API (Lokal vs Production)
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    // Ganti URL di bawah ini dengan URL dari Render kamu nanti setelah deploy
    const BASE_URL = isLocalhost ? '' : 'https://baksos.onrender.com';

    // 2. Tentukan endpoint berdasarkan nama file HTML saat ini
    let endpoint = '/api/gallery'; // Default
    if (window.location.pathname.includes('tulakan.html')) endpoint = '/api/tulakan';
    if (window.location.pathname.includes('pringkuku.html')) endpoint = '/api/pringkuku';

    // 3. Ambil data dari server.py
    fetch(`${BASE_URL}${endpoint}`)
        .then(response => response.json())
        .then(data => {
            // Bersihkan galeri sebelum mengisi (jika ada isinya)
            gallery.innerHTML = ''; 

            // Jika data berupa objek (dari /api/gallery), ambil semua fotonya
            let photosToDisplay = [];
            if (data.tulakan && data.pringkuku) {
                photosToDisplay = [...data.tulakan, ...data.pringkuku];
            } else {
                photosToDisplay = data; // Jika sudah berupa array langsung
            }

            if (photosToDisplay.length === 0) {
                gallery.innerHTML = '<p style="text-align:center; width:100%;">Tidak ada foto ditemukan.</p>';
                return;
            }

            photosToDisplay.forEach(photo => {
                // Path gambar harus menyertakan BASE_URL jika di production
                // photo.full berisi "tulakan/nama.jpg", browser akan mencarinya di docs/tulakan/nama.jpg
                const fullPath = isLocalhost ? photo.full : `${BASE_URL}/${photo.full}`;
                addPhoto(fullPath, photo.name);
            });
        })
        .catch(error => {
            console.error('Error loading photos:', error);
            gallery.innerHTML = '<p style="text-align:center; width:100%;">Gagal memuat foto dari server.</p>';
        });
});