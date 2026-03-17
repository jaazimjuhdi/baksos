document.addEventListener('DOMContentLoaded', function() {
    // Ambil parameter dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const folder = urlParams.get('folder');
    const filename = urlParams.get('file');

    const content = document.getElementById('content');

    if (!folder || !filename) {
        content.innerHTML = '<div class="error-message">Parameter tidak lengkap. Silakan kembali ke galeri.</div>';
        return;
    }

    // Validasi folder hanya "tulakan" atau "pringkuku"
    if (folder !== 'tulakan' && folder !== 'pringkuku') {
        content.innerHTML = '<div class="error-message">Folder tidak valid.</div>';
        return;
    }

    // Decode filename jika perlu (dalam kasus filename dengan karakter khusus)
    const decodedFilename = decodeURIComponent(filename);
    const imageUrl = `${folder}/${decodedFilename}`;

    // Buat HTML untuk preview
    const photoName = decodedFilename;
    const folderDisplay = folder.charAt(0).toUpperCase() + folder.slice(1);

    const previewHTML = `
        <div class="photo-info">
            <p class="photo-folder">📁 ${folderDisplay}</p>
            <p class="photo-name">${photoName}</p>
        </div>
        <div class="photo-container">
            <img id="preview-image" src="${imageUrl}" alt="${photoName}" onerror="handleImageError()">
        </div>
        <div class="action-buttons">
            <button class="download-button" onclick="downloadImage('${imageUrl}', '${decodedFilename}')">
                <span class="download-icon"></span>
                Download Gambar
            </button>
        </div>
    `;

    content.innerHTML = previewHTML;
});

function downloadImage(imagePath, filename) {
    // Buat element <a> untuk download
    const link = document.createElement('a');
    link.href = imagePath;
    link.download = filename; // Nama file saat didownload
    
    // Tambahkan ke body (diperlukan untuk beberapa browser)
    document.body.appendChild(link);
    
    // Trigger click
    link.click();
    
    // Hapus element setelah download
    document.body.removeChild(link);
}

function goBack() {
    // Kembali ke halaman galeri
    window.history.back();
    // Alternatif: window.location.href = 'galeri.html';
}

function handleImageError() {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="error-message">Gagal memuat foto. File mungkin tidak ditemukan.</div>';
}
