/**
 * RYZAFILMS Main Script - Complete Advanced Features
 */

// ==========================================
// 1. TOAST NOTIFICATION MODERN
// ==========================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
  
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => toast.remove(), 3000);
}

// ==========================================
// 2. MODAL TRAILER
// ==========================================
function openTrailerModal(embedUrl, title) {
  document.getElementById('trailerTitle').innerText = 'Trailer: ' + title;
  document.getElementById('trailerIframe').src = embedUrl + '?autoplay=1';
  document.getElementById('trailerModal').style.display = 'flex';
}

function closeTrailerModal() {
  document.getElementById('trailerModal').style.display = 'none';
  document.getElementById('trailerIframe').src = '';
}

// ==========================================
// 3. CHECKOUT & KOLEKSI SAYA (MY LIBRARY)
// ==========================================
function openCheckout(title, type, price) {
  const modal = document.getElementById('checkoutModal');
  document.getElementById('modalMovieTitle').innerText = title;
  document.getElementById('modalAccessType').innerText = type;
  document.getElementById('modalPrice').innerText = 'Rp ' + price;
  modal.style.display = 'flex';
}

function closeCheckout() {
  document.getElementById('checkoutModal').style.display = 'none';
}

function processPayment() {
  const title = document.getElementById('modalMovieTitle').innerText;
  const type = document.getElementById('modalAccessType').innerText;
  
  closeCheckout();
  
  // Simpan ke Koleksi Saya (Library) di localStorage
  let library = JSON.parse(localStorage.getItem('ryzafilms_library')) || [];
  if (!library.some(item => item.title === title)) {
    // Cari gambar poster berdasarkan judul
    let posterImg = 'Image/Danur.png';
    if (title.includes('Mie Ayam')) posterImg = 'Image/Seporsi mie ayam.jpg';
    if (title.includes('Spider-Man')) posterImg = 'Image/Spiderman.png';
    if (title.includes('Bapak')) posterImg = 'Image/Bapak Jujur.png';

    library.push({ title: title, type: type, poster: posterImg });
    localStorage.setItem('ryzafilms_library', JSON.stringify(library));
  }

  showToast(`Pembayaran "${title}" (${type}) berhasil! Masuk ke pemutar...`);
  setTimeout(() => {
    window.location.href = `watch.html?title=${encodeURIComponent(title)}`;
  }, 1500);
}

function openLibraryModal() {
  const container = document.getElementById('libraryContainer');
  let library = JSON.parse(localStorage.getItem('ryzafilms_library')) || [];
  
  if (library.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px;">Belum ada film di koleksi Anda. Silakan sewa atau beli film terlebih dahulu.</p>`;
  } else {
    container.innerHTML = library.map(item => `
      <div class="library-item">
        <img src="${item.poster}" alt="${item.title}">
        <div class="library-info">
          <h4>${item.title}</h4>
          <p>Akses: ${item.type}</p>
        </div>
        <button class="btn-play-lib" onclick="window.location.href='watch.html?title=${encodeURIComponent(item.title)}'">Putar</button>
      </div>
    `).join('');
  }
  document.getElementById('libraryModal').style.display = 'flex';
}

function closeLibraryModal() {
  document.getElementById('libraryModal').style.display = 'none';
}

// ==========================================
// 4. WATCHLIST / DAFTAR SAYA (FAVORIT)
// ==========================================
function toggleWatchlist(title, poster, btnElement) {
  let watchlist = JSON.parse(localStorage.getItem('ryzafilms_watchlist')) || [];
  const index = watchlist.findIndex(item => item.title === title);

  if (index > -1) {
    watchlist.splice(index, 1);
    btnElement.classList.remove('active');
    btnElement.innerHTML = '<i class="fa-regular fa-heart"></i>';
    showToast(`"${title}" dihapus dari Daftar Saya.`, 'info');
  } else {
    watchlist.push({ title, poster });
    btnElement.classList.add('active');
    btnElement.innerHTML = '<i class="fa-solid fa-heart"></i>';
    showToast(`"${title}" ditambahkan ke Daftar Saya!`);
  }

  localStorage.setItem('ryzafilms_watchlist', JSON.stringify(watchlist));
  updateWatchlistCount();
}

function updateWatchlistCount() {
  let watchlist = JSON.parse(localStorage.getItem('ryzafilms_watchlist')) || [];
  const countEl = document.getElementById('watchlistCount');
  if (countEl) countEl.innerText = watchlist.length;
}

function openWatchlistModal() {
  const container = document.getElementById('watchlistContainer');
  let watchlist = JSON.parse(localStorage.getItem('ryzafilms_watchlist')) || [];

  if (watchlist.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:20px;">Daftar Saya masih kosong.</p>`;
  } else {
    container.innerHTML = watchlist.map(item => `
      <div class="library-item">
        <img src="${item.poster}" alt="${item.title}">
        <div class="library-info">
          <h4>${item.title}</h4>
          <p>Status: Disimpan</p>
        </div>
        <button class="btn-play-lib" onclick="openCheckout('${item.title}', 'Sewa', '25.000')">Sewa/Beli</button>
      </div>
    `).join('');
  }
  document.getElementById('watchlistModal').style.display = 'flex';
}

function closeWatchlistModal() {
  document.getElementById('watchlistModal').style.display = 'none';
}

// Inisialisasi status ikon hati saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  updateWatchlistCount();
  let watchlist = JSON.parse(localStorage.getItem('ryzafilms_watchlist')) || [];
  document.querySelectorAll('.movie-card').forEach(card => {
    const title = card.getAttribute('data-title');
    // Cocokan sederhana
    watchlist.forEach(item => {
      if (card.querySelector('h3').innerText === item.title) {
        const btn = card.querySelector('.watchlist-btn');
        if (btn) {
          btn.classList.add('active');
          btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        }
      }
    });
  });
});

// ==========================================
// 5. PENCARIAN & FILTER GENRE
// ==========================================
let currentSelectedGenre = 'all';

function setGenre(genre, element) {
    currentSelectedGenre = genre;
    document.querySelectorAll('.genre-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    filterMovies();
}

function filterMovies() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase().trim();
    const movieCards = document.querySelectorAll('.movie-card');
    let visibleCount = 0;

    movieCards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        const genre = card.getAttribute('data-genre');

        const matchesSearch = title.includes(searchInput);
        const matchesGenre = (currentSelectedGenre === 'all') || (genre === currentSelectedGenre);

        if (matchesSearch && matchesGenre) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = (visibleCount === 0) ? 'block' : 'none';
    }
}

// ==========================================
// 6. RATING BINTANG & ULASAN INTERAKTIF
// ==========================================
let selectedRating = 0;
let currentMovieForReview = '';

function openReviewModal(movieTitle) {
    currentMovieForReview = movieTitle;
    document.getElementById('reviewMovieTitle').innerText = 'Ulasan: ' + movieTitle;
    document.getElementById('reviewModal').style.display = 'flex';
}

function closeReviewModal() {
    document.getElementById('reviewModal').style.display = 'none';
    resetStars();
}

const interactiveStars = document.querySelectorAll('#starInput i');
interactiveStars.forEach(star => {
    star.addEventListener('click', function() {
        selectedRating = this.getAttribute('data-rating');
        updateStarDisplay(selectedRating);
    });
});

function updateStarDisplay(rating) {
    interactiveStars.forEach(star => {
        const starRating = star.getAttribute('data-rating');
        if (starRating <= rating) {
            star.classList.remove('fa-regular');
            star.classList.add('fa-solid');
        } else {
            star.classList.remove('fa-solid');
            star.classList.add('fa-regular');
        }
    });
}

function resetStars() {
    selectedRating = 0;
    updateStarDisplay(0);
    document.getElementById('reviewComment').value = '';
}

function submitReview() {
    if (selectedRating === 0) {
        showToast('Silakan pilih jumlah bintang terlebih dahulu!', 'info');
        return;
    }
    closeReviewModal();
    showToast(`Ulasan bintang ${selectedRating} untuk "${currentMovieForReview}" berhasil dikirim!`);
}

// ==========================================
// 7. DARK / LIGHT MODE TOGGLE
// ==========================================
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');

const currentTheme = localStorage.getItem('ryzafilms_theme');
if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
    if(themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
    if(themeText) themeText.innerText = 'Dark Mode';
}

if(themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      let isLight = document.body.classList.contains('light-mode');

      if (isLight) {
          themeIcon.classList.replace('fa-sun', 'fa-moon');
          themeText.innerText = 'Dark Mode';
          localStorage.setItem('ryzafilms_theme', 'light');
      } else {
          themeIcon.classList.replace('fa-moon', 'fa-sun');
          themeText.innerText = 'Light Mode';
          localStorage.setItem('ryzafilms_theme', 'dark');
      }
  });
}

// Tutup modal saat klik area luar
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
};document.addEventListener("DOMContentLoaded", () => {
    const bgm = document.getElementById("bgm");
    
    // Coba putar musik secara otomatis
    bgm.volume = 0.5; // Atur volume (0.0 sampai 1.0)
    bgm.play().catch(error => {
        console.log("Autoplay dicegah oleh browser, menunggu interaksi pengguna...");
        
        // Jika diblokir, musik akan langsung menyala saat pengguna mengklik bagian layar mana pun pertama kali
        document.addEventListener("click", () => {
            bgm.play();
        }, { once: true });
    });
});