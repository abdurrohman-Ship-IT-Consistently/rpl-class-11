console.log('=== MATERI 5 - CONSUME API ===');
const API_URL = 'https://dummyjson.com/products';

const productGrid = document.getElementById('product-grid');
const loadingState = document.getElementById('loading-state');
const resultSummary = document.getElementById('result-summary');
const categorySelect = document.getElementById('category-select');

function renderProduct(dataProducts) {
    productGrid.innerHTML = ''; // reset isi product grid
    dataProducts.map(dataProduct => {
      // ubah key dari object dataProduct menjadi variabel -> destructuring assignment
      // untuk memudahkan penggunaan variabel di dalam string template
      const { id, title, price, category, thumbnail, rating } = dataProduct;
      // gunakan += untuk menambahkan string ke dalam productGrid.innerHTML 
      // secara iteratif untuk menghindari overwriting atau tertimpa
      productGrid.innerHTML += `
        <article class="product-card">
          <div class="product-image-wrap">
            <img class="product-image" src="${thumbnail}" alt="${title}" loading="lazy">
          </div>
          <div class="product-body">
            <span class="product-category">
              ${category}
            </span>
            <h3 class="product-title">
              ${title}
            </h3>

            <div class="product-meta">
              <span class="product-price">
                $${price}
              </span>

              <span class="product-rating">
                ⭐ ${rating}
              </span>
            </div>

            <button type="button" class="detail-btn" data-id="${id}">
              Lihat Detail
            </button>
          </div>
        </article>
      `;
    });
}

// function di variable disebut juga arrow function atau anonymous function
const getProducts = async (category = 'all') => {
    try {
        const apiUrl = category === 'all' ? API_URL : `${API_URL}/category/${category}`;
        const response = await fetch(apiUrl);        
        const data = await response.json(); // data dijadikan object javascript
        // destructuring assignment { key1, key2, ... }
        // untuk mengambil data berdasarkan key dari object data
        const { limit, products, skip, total } = data;
        renderProduct(products); // memanggil fungsi untuk merender produk ke halaman
        productGrid.hidden = false; // menghilangkan hidden dari productGrid
        resultSummary.hidden = true; // menyembunyikan result summary text 
        loadingState.hidden = true; // menyembunyikan loadingState
    } catch (error) {
        alert('Something went wrong! Please try again later.');
        console.error("Error on getProducts:", error);
    }
};

const getProductCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        categorySelect.innerHTML = '<option value="all">Semua kategori</option>';
        data.map(category => {
            categorySelect.innerHTML += `<option value="${category.slug}">${category.name}</option>`;
        });
    } catch (error) {
        console.error("Error on getProductCategories:", error);
    }
};

// saat kategori select berubah atau di klik render ulang produk berdasarkan kategori yg dipilih
categorySelect.addEventListener('change', () => {
    getProducts(categorySelect.value);
});

// panggil fungsi untuk mengambil data dari API
getProductCategories();
getProducts();
