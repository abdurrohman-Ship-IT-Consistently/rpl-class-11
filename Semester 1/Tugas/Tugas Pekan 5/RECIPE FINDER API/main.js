/**
 * SKL 2 - API PENCARI RESEP (RECIPE FINDER)
 * File: script.js
 */

// ==========================================
// 1. ELEMEN DOM & STATE APLIKASI
// ==========================================
const API_URL = "https://dummyjson.com/recipes?limit=0";

// State Aplikasi
let allRecipes = [];
let favoriteIds = JSON.parse(localStorage.getItem("favorite_recipes")) || [];
let showingFavoritesOnly = false;

// Elemen HTML DOM
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const cuisineFilter = document.getElementById("cuisine-filter");
const difficultyFilter = document.getElementById("difficulty-filter");
const resetFilterButton = document.getElementById("reset-filter-button");

const favoriteButton = document.getElementById("favorite-button");
const favoriteCountEl = document.getElementById("favorite-count");

const sectionTitleEl = document.getElementById("section-title");
const recipeCountEl = document.getElementById("recipe-count");

const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const emptyState = document.getElementById("empty-state");
const recipeGrid = document.getElementById("recipe-grid");

const recipeDialog = document.getElementById("recipe-dialog");
const closeDialogButton = document.getElementById("close-dialog");
const dialogContent = document.getElementById("dialog-content");

// ==========================================
// 2. INISIALISASI APLIKASI
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  updateFavoriteBadge();
  fetchRecipes();
  setupEventListeners();
});

// Mengambil data resep dari DummyJSON API menggunakan Fetch API
async function fetchRecipes() {
  showState("loading");
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Gagal mengambil data HTTP: ${response.status}`);
    }
    const data = await response.json();
    allRecipes = data.recipes || [];

    populateCuisineFilter(allRecipes);
    renderRecipes();
  } catch (error) {
    console.error("Error saat mengunduh data resep:", error);
    showState("error");
  }
}

// ==========================================
// 3. EVENT LISTENERS
// ==========================================
function setupEventListeners() {
  // Event Form Pencarian & Live Input
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    renderRecipes();
  });

  searchInput.addEventListener("input", () => {
    renderRecipes();
  });

  // Event Dropdown Filter
  cuisineFilter.addEventListener("change", () => {
    renderRecipes();
  });

  difficultyFilter.addEventListener("change", () => {
    renderRecipes();
  });

  // Event Tombol Reset Filter
  resetFilterButton.addEventListener("click", resetAllFilters);

  // Event Toggle Tampilan Favorit (Navbar)
  favoriteButton.addEventListener("click", () => {
    showingFavoritesOnly = !showingFavoritesOnly;
    if (showingFavoritesOnly) {
      sectionTitleEl.textContent = "Favorite Recipes";
    } else {
      sectionTitleEl.textContent = "Explore Recipes";
    }
    renderRecipes();
  });

  // Event Delegation pada Recipe Grid (Tombol Detail & Tombol Favorit/Like)
  recipeGrid.addEventListener("click", (e) => {
    const detailBtn = e.target.closest(".detail-button");
    const likeBtn = e.target.closest(".like-button");

    if (detailBtn) {
      const recipeId = parseInt(detailBtn.dataset.id, 10);
      openRecipeModal(recipeId);
    } else if (likeBtn) {
      const recipeId = parseInt(likeBtn.dataset.id, 10);
      toggleFavorite(recipeId);
    }
  });

  // Event Penutupan Modal / Dialog Detail
  closeDialogButton.addEventListener("click", () => {
    recipeDialog.close();
  });

  // Menutup dialog saat klik di luar area modal (backdrop click)
  recipeDialog.addEventListener("click", (e) => {
    if (e.target === recipeDialog) {
      recipeDialog.close();
    }
  });
}

// ==========================================
// 4. LOGIKA PENCARIAN & FILTER
// ==========================================

// Mengisi opsi Cuisine secara dinamis dari data API
function populateCuisineFilter(recipes) {
  const cuisines = [...new Set(recipes.map((r) => r.cuisine))].sort();
  cuisines.forEach((cuisine) => {
    const option = document.createElement("option");
    option.value = cuisine;
    option.textContent = cuisine;
    cuisineFilter.appendChild(option);
  });
}

// Memfilter resep berdasarkan keyword, cuisine, difficulty, dan status favorit
function getFilteredRecipes() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCuisine = cuisineFilter.value;
  const selectedDifficulty = difficultyFilter.value;

  return allRecipes.filter((recipe) => {
    // Mode Tampil Favorit
    if (showingFavoritesOnly && !favoriteIds.includes(recipe.id)) {
      return false;
    }

    // Filter Kata Kunci Pencarian (Pencarian Nama, Cuisine, atau Bahan)
    const matchesSearch =
      query === "" ||
      recipe.name.toLowerCase().includes(query) ||
      recipe.cuisine.toLowerCase().includes(query) ||
      (recipe.ingredients &&
        recipe.ingredients.some((ing) => ing.toLowerCase().includes(query)));

    // Filter Cuisine
    const matchesCuisine =
      selectedCuisine === "" || recipe.cuisine === selectedCuisine;

    // Filter Difficulty
    const matchesDifficulty =
      selectedDifficulty === "" || recipe.difficulty === selectedDifficulty;

    return matchesSearch && matchesCuisine && matchesDifficulty;
  });
}

// Mengembalikan seluruh filter ke kondisi awal
function resetAllFilters() {
  searchInput.value = "";
  cuisineFilter.value = "";
  difficultyFilter.value = "";
  showingFavoritesOnly = false;
  sectionTitleEl.textContent = "Explore Recipes";
  renderRecipes();
}

// Mengecek kondisi filter aktif untuk mengontrol visibilitas tombol Reset
function checkActiveFilters() {
  const isSearchActive = searchInput.value.trim() !== "";
  const isCuisineActive = cuisineFilter.value !== "";
  const isDifficultyActive = difficultyFilter.value !== "";

  if (
    isSearchActive ||
    isCuisineActive ||
    isDifficultyActive ||
    showingFavoritesOnly
  ) {
    resetFilterButton.removeAttribute("hidden");
  } else {
    resetFilterButton.setAttribute("hidden", "true");
  }
}

// ==========================================
// 5. RENDER TAMPILAN RESEP
// ==========================================

function renderRecipes() {
  const filtered = getFilteredRecipes();
  checkActiveFilters();

  // Update jumlah resep
  recipeCountEl.textContent = `${filtered.length} recipe${
    filtered.length !== 1 ? "s" : ""
  }`;

  if (filtered.length === 0) {
    showState("empty");
    return;
  }

  showState("content");
  recipeGrid.innerHTML = filtered.map((recipe) => createCardHTML(recipe)).join("");
}

// Membuat elemen HTML untuk Kartu Resep
function createCardHTML(recipe) {
  const isFav = favoriteIds.includes(recipe.id);
  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  return `
    <article class="recipe-card">
      <img 
        src="${recipe.image}" 
        alt="${escapeHtml(recipe.name)}" 
        class="recipe-image" 
        loading="lazy"
        onerror="this.onerror=null; this.src='https://via.placeholder.com/300x190?text=No+Image';"
      />
      <div class="recipe-body">
        <span class="recipe-cuisine">${escapeHtml(recipe.cuisine)}</span>
        <h3 class="recipe-title">${escapeHtml(recipe.name)}</h3>
        <div class="recipe-meta">
          <span>⏱️ ${totalTime} min</span>
          <span>⭐ ${recipe.rating || 0}</span>
          <span>📊 ${escapeHtml(recipe.difficulty)}</span>
        </div>
        <div class="recipe-actions">
          <button class="detail-button" data-id="${recipe.id}">Detail</button>
          <button 
            class="like-button" 
            data-id="${recipe.id}" 
            aria-label="${isFav ? "Remove from Favorites" : "Add to Favorites"}"
            title="${isFav ? "Hapus dari Favorit" : "Tambah ke Favorit"}"
          >
            ${isFav ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    </article>
  `;
}

// Helper untuk mengontrol State Tampilan (Loading, Error, Empty, Content)
function showState(state) {
  loadingState.hidden = state !== "loading";
  errorState.hidden = state !== "error";
  emptyState.hidden = state !== "empty";
  recipeGrid.hidden = state !== "content";
}

// ==========================================
// 6. LOGIKA FAVORIT & LOCALSTORAGE
// ==========================================

function toggleFavorite(id) {
  const index = favoriteIds.indexOf(id);
  if (index === -1) {
    favoriteIds.push(id);
  } else {
    favoriteIds.splice(index, 1);
  }

  // Menyimpan array ID ke LocalStorage
  localStorage.setItem("favorite_recipes", JSON.stringify(favoriteIds));
  updateFavoriteBadge();
  renderRecipes();
}

function updateFavoriteBadge() {
  favoriteCountEl.textContent = favoriteIds.length;
}

// ==========================================
// 7. MODAL / DETAIL RESEP
// ==========================================

function openRecipeModal(id) {
  const recipe = allRecipes.find((r) => r.id === id);
  if (!recipe) return;

  dialogContent.innerHTML = `
    <img 
      src="${recipe.image}" 
      alt="${escapeHtml(recipe.name)}" 
      class="dialog-image" 
    />
    <div class="dialog-body">
      <span class="recipe-cuisine">${escapeHtml(recipe.cuisine)}</span>
      <h2>${escapeHtml(recipe.name)}</h2>
      
      <div class="dialog-meta">
        <span>⏱️ Prep: ${recipe.prepTimeMinutes || 0} min</span>
        <span>🔥 Cook: ${recipe.cookTimeMinutes || 0} min</span>
        <span>🍽️ Servings: ${recipe.servings || 0}</span>
        <span>📊 Difficulty: ${escapeHtml(recipe.difficulty)}</span>
        <span>⭐ Rating: ${recipe.rating || 0} (${recipe.reviewCount || 0} reviews)</span>
        <span>🔥 ${recipe.caloriesPerServing || 0} kcal/serving</span>
      </div>

      <h3>Bahan-bahan (Ingredients)</h3>
      <ul class="ingredients">
        ${(recipe.ingredients || [])
          .map((ing) => `<li>${escapeHtml(ing)}</li>`)
          .join("")}
      </ul>

      <h3>Langkah-langkah (Instructions)</h3>
      <div class="instructions">
        ${(recipe.instructions || [])
          .map((step, idx) => `<p><strong>Langkah ${idx + 1}:</strong>${escapeHtml(step)}</p>`)
          .join("")}
      </div>
    </div>
  `;

  recipeDialog.showModal();
}

// Sanitisasi sederhana untuk keamanan HTML
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}