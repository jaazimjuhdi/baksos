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
    
    const addPhoto = (src, altName, folder, filename) => {
        const index = gallery.children.length;
        const ratio = ratioSequence[index % ratioSequence.length];
        
        const item = document.createElement('div');
        item.className = `item ratio-${ratio}`;
        
        const img = document.createElement('img');
        img.src = src;
        img.alt = altName || 'Photo';
        
        // Tambahkan event click untuk navigasi ke halaman preview
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            // Navigasi ke preview page dengan parameter folder dan filename
            const encodedFilename = encodeURIComponent(filename);
            window.location.href = `preview.html?folder=${folder}&file=${encodedFilename}`;
        });
        
        item.appendChild(img);
        gallery.appendChild(item);
    };

    // --- BAGIAN FETCH DINAMIS ---
    
    // Fungsi untuk mengambil data dari API Railway
    async function loadGallery() {
        try {
            // Deteksi halaman mana yang sedang dibuka
            const currentPage = window.location.pathname;
            let apiEndpoint = '/api/gallery'; // Default: semua foto
            
            if (currentPage.includes('tulakan.html')) {
                apiEndpoint = '/api/tulakan';
            } else if (currentPage.includes('pringkuku.html')) {
                apiEndpoint = '/api/pringkuku';
            }
            
            // Kita panggil endpoint yang sesuai
            const response = await fetch(apiEndpoint);
            const data = await response.json();

            // Kosongkan galeri sebelum diisi foto
            gallery.innerHTML = '';

            // Tentukan array foto yang akan ditampilkan
            let photosToDisplay = [];
            
            if (apiEndpoint === '/api/gallery') {
                // Jika galeri.html, gabungkan semua foto
                photosToDisplay = [...data.tulakan, ...data.pringkuku];
            } else {
                // Jika kategori spesifik, gunakan array dari response
                photosToDisplay = data;
            }

            if (photosToDisplay.length === 0) {
                gallery.innerHTML = '<p>Belum ada foto di folder ini.</p>';
                return;
            }

            photosToDisplay.forEach(photo => {
                // 1. Pilih thumbnail jika ada, kalau tidak ada pakai foto asli
                const imagePath = photo.thumb ? photo.thumb : photo.full;
                
                // 2. Extract folder dari path (e.g., "tulakan/DSC_3908.webp" -> folder="tulakan")
                const pathParts = photo.full.split('/');
                const folder = pathParts[0];
                const filename = pathParts[1];

                // 3. Panggil addPhoto dengan parameter folder dan filename
                addPhoto(`${imagePath}`, filename, folder, filename); 
            });
        } catch (error) {
            console.error('Gagal memuat galeri:', error);
            gallery.innerHTML = '<p>Gagal mengambil data dari server.</p>';
        }
    }

    // Jalankan fungsi untuk memuat foto
    loadGallery();
});