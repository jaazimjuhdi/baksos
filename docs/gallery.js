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
    
    // Fungsi untuk mengambil data dari API Railway
    async function loadGallery() {
        try {
            // Kita panggil endpoint /api/gallery yang sudah kamu buat di server.py
            const response = await fetch('/api/gallery');
            const data = await response.json();

            // Kosongkan galeri sebelum diisi foto asli
            gallery.innerHTML = '';

            // Gabungkan foto dari tulakan dan pringkuku untuk ditampilkan
            const allPhotos = [...data.tulakan, ...data.pringkuku];

            if (allPhotos.length === 0) {
                gallery.innerHTML = '<p>Belum ada foto di folder docs.</p>';
                return;
            }

           allPhotos.forEach(photo => {
                // Pilih thumbnail agar loading cepat dan server tidak overload (502)
                // Jika thumbnail tidak ada, baru pakai foto asli
                const imagePath = photo.thumb ? photo.thumb : photo.full;

                // Gabungkan dengan folder 'docs' tanpa simbol $ tambahan
                const finalUrl = `docs/${imagePath}`;

                // Panggil fungsi addPhoto
                addPhoto(finalUrl);
            });
        } catch (error) {
            console.error('Gagal memuat galeri:', error);
            gallery.innerHTML = '<p>Gagal mengambil data dari server.</p>';
        }
    }

    // Jalankan fungsi untuk memuat foto
    loadGallery();
});