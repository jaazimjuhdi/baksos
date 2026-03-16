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
    
    const addPhoto = src => {
        const index = gallery.children.length;
        const ratio = ratioSequence[index % ratioSequence.length];
        
        const item = document.createElement('div');
        item.className = `item ratio-${ratio}`;
        
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Photo';
        
        item.appendChild(img);
        gallery.appendChild(item);
    };

    // Contoh foto - ganti dengan URL foto asli kamu
    const photos = [
        'landscape.jpg', 'landscape.jpg', 'landscape.jpg',
        'landscape.jpg', 'landscape.jpg',
        'landscape.jpg', 'landscape.jpg',
        'landscape.jpg', 'landscape.jpg'
    ];

    photos.forEach(addPhoto);
});