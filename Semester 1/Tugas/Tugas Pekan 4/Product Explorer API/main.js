console.log('=== MATERI 5 - CONSUME API ===');
const API_URL = 'https://dummyjson.com/products';

// === DOM ELEMENTS ===
const productGrid = document.getElementById('product-grid');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const emptyState = document.getElementById('empty-state');
const resultSummary = document.getElementById('result-summary');

// Controls
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const sortSelect = document.getElementById('sort-select');
const resetBtn = document.getElementById('reset-btn');
const reloadBtn = document.getElementById('reload-btn');
const retryBtn = document.getElementById('retry-btn');

// Dialog / Modal Elements
const productDialog = document.getElementById('product-dialog');
const dialogContent = document.getElementById('dialog-content');
const dialogCloseBtn = document.getElementById('dialog-close');

// === GLOBAL STATE ===
// Menyimpan semua produk secara lokal agar pencarian/filter lebih cepat
let allProducts = [];

// === HELPER: MANAJEMEN STATUS UI ===
function showState(state) {
  productGrid.hidden = true;
  loadingState.hidden = true;
  errorState.hidden = true;
  emptyState.hidden = true;

  if (state === 'loading') loadingState.hidden = false;
  if (state === 'error') errorState.hidden = false;
  if (state === 'empty') emptyState.hidden = false;
  if (state === 'success') productGrid.hidden = false;
}

// === 1. FETCH KATEGORI ===
const getProductCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();
    
    categorySelect.innerHTML = '<option value="all">Semua kategori</option>';
    data.forEach(category => {
      // Menangani format API dummyjson (bisa berupa object atau string)
      const value = category.slug || category;
      const name = category.name || category;
      categorySelect.innerHTML += `<option value="${value}">${name}</option>`;
    });
  } catch (error) {
    console.error("Error on getProductCategories:", error);
  }
};

// === 2. FETCH PRODUK ===
const getProducts = async () => {
  showState('loading');
  resultSummary.textContent = 'Mengambil data dari API...';
  
  try {
    // Menggunakan limit=0 agar DummyJSON mengembalikan SELURUH produk (tanpa batas 100)
    const response = await fetch(`${API_URL}?limit=0`); 
    if (!response.ok) throw new Error('Gagal mengambil data');
    const data = await response.json();
    
    allProducts = data.products; 
    applyFilters(); // Render berdasarkan filter yang aktif
  } catch (error) {
    console.error("Error on getProducts:", error);
    showState('error');
    resultSummary.textContent = 'Gagal memuat data.';
  }
};

// === 3. RENDER PRODUK ===
function renderProduct(dataProducts) {
  if (dataProducts.length === 0) {
    showState('empty');
    resultSummary.textContent = '0 produk ditemukan.';
    return;
  }

  // Menggunakan map & join untuk performa DOM yang lebih baik
  const productCards = dataProducts.map(dataProduct => {
    const { id, title, price, category, thumbnail, rating } = dataProduct;
    return `
      <article class="product-card">
        <div class="product-image-wrap">
          <img class="product-image" src="${thumbnail}" alt="${title}" loading="lazy">
        </div>
        <div class="product-body">
          <span class="product-category">${category}</span>
          <h3 class="product-title">${title}</h3>
          <div class="product-meta">
            <span class="product-price">$${price}</span>
            <span class="product-rating">⭐ ${rating}</span>
          </div>
          <button type="button" class="detail-btn" data-id="${id}">Lihat Detail</button>
        </div>
      </article>
    `;
  }).join('');

  productGrid.innerHTML = productCards;
  showState('success');
  resultSummary.textContent = `Menampilkan ${dataProducts.length} produk`;
}

// === 4. LOGIKA FILTER, PENCARIAN & SORTING (LEBIH AMAN & LENGKAP) ===
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const categoryFilter = categorySelect.value;
  const sortMode = sortSelect.value;

  // Proses Filter (Pencarian & Kategori)
  let filtered = allProducts.filter(product => {
    // Gunakan optional chaining (?.) agar aman jika ada field data yang kosong
    const titleMatch = product.title?.toLowerCase().includes(searchTerm) ?? false;
    const descMatch = product.description?.toLowerCase().includes(searchTerm) ?? false;
    const brandMatch = product.brand?.toLowerCase().includes(searchTerm) ?? false;
    const catTextMatch = product.category?.toLowerCase().includes(searchTerm) ?? false;

    // Pencarian mencakup: Judul, Deskripsi, Brand, dan Kategori
    const matchSearch = !searchTerm || titleMatch || descMatch || brandMatch || catTextMatch;

    // Filter Kategori Dropdown
    const matchCategory = categoryFilter === 'all' || product.category === categoryFilter;

    return matchSearch && matchCategory;
  });

  // Proses Sorting (Pengurutan)
  filtered.sort((a, b) => {
    if (sortMode === 'price-asc') return a.price - b.price;
    if (sortMode === 'price-desc') return b.price - a.price;
    if (sortMode === 'rating-desc') return b.rating - a.rating;
    if (sortMode === 'name-asc') return a.title.localeCompare(b.title);
    return 0; // Default
  });

  renderProduct(filtered);
}

// === 5. EVENT LISTENERS KONTROL UI ===
searchInput.addEventListener('input', applyFilters);
categorySelect.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);

resetBtn.addEventListener('click', () => {
  searchInput.value = '';
  categorySelect.value = 'all';
  sortSelect.value = 'default';
  applyFilters();
});

reloadBtn.addEventListener('click', getProducts);
retryBtn.addEventListener('click', getProducts);

// === 6. FITUR BONUS: MODAL POP-UP DETAIL PRODUK ===
// Event delegation pada product grid untuk menangkap klik tombol "Lihat Detail"
productGrid.addEventListener('click', (e) => {
  if (e.target.classList.contains('detail-btn')) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    showProductDetail(productId);
  }
});

function showProductDetail(id) {
  // Cari produk dari state array kita berdasarkan ID
  const product = allProducts.find(p => p.id === id);
  if (!product) return;

  // Injeksi data ke dalam modal menyesuaikan desain CSS yang ada
  dialogContent.innerHTML = `
    <div class="dialog-detail">
      <img class="dialog-image" src="${product.thumbnail}" alt="${product.title}">
      <div class="dialog-copy">
        <span class="product-category">${product.category}</span>
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        
        <div class="detail-list">
          <div class="detail-row">
            <span>💰 Harga</span>
            <strong>$${product.price}</strong>
          </div>
          <div class="detail-row">
            <span>⭐ Rating</span>
            <strong>${product.rating}</strong>
          </div>
          <div class="detail-row">
            <span>📦 Stock</span>
            <strong>${product.stock}</strong>
          </div>
          <div class="detail-row">
            <span>🏢 Brand</span>
            <strong>${product.brand || 'Tidak Ada Merk'}</strong>
          </div>
        </div>
      </div>
    </div>
  `;
  
  productDialog.showModal(); // Buka native HTML dialog
}

// Tutup dialog saat tombol X diklik
dialogCloseBtn.addEventListener('click', () => {
  productDialog.close();
});

// Tutup dialog saat area di luar kotak modal diklik
productDialog.addEventListener('click', (e) => {
  const dialogDimensions = productDialog.getBoundingClientRect();
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    productDialog.close();
  }
});

// === INISIALISASI APLIKASI ===
getProductCategories();
getProducts();