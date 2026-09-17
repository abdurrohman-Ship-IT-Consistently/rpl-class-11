console.log('==========================');
console.log('HSI STUDENT MANAGEMENT CRUD');
console.log('==========================');

// State & LocalStorage Key
const STORAGE_KEY = 'students';
let students = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Tangkap elemen DOM
const studentList = document.getElementById("studentList");
const studentForm = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const studentScore = document.getElementById("studentScore");
const studentIndex = document.getElementById("studentIndex");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const alertMessage = document.getElementById("alertMessage");
const totalStudentsEl = document.getElementById("totalStudents");
const averageScoreEl = document.getElementById("averageScore");

// Helper: Simpan ke LocalStorage
function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// Tampilkan notifikasi sementara
function showNotification(message) {
  alertMessage.textContent = message;
  alertMessage.classList.add("success");
  
  setTimeout(() => {
    alertMessage.textContent = "";
    alertMessage.classList.remove("success");
  }, 3000);
}

// Hitung statistik total siswa dan rata-rata
function updateStatistics() {
  const total = students.length;
  totalStudentsEl.textContent = total;

  if (total === 0) {
    averageScoreEl.textContent = "0";
    return;
  }

  const sum = students.reduce((acc, curr) => acc + Number(curr.score), 0);
  const average = sum / total;
  
  averageScoreEl.textContent = Number.isInteger(average) ? average : average.toFixed(2);
}

// Reset form ke mode Tambah
function resetForm() {
  studentForm.reset();
  studentIndex.value = "";
  formTitle.textContent = "➕ Tambah Siswa";
  submitBtn.textContent = "➕ Tambah Siswa";
  cancelBtn.style.display = "none";
}

// Render daftar siswa ke UI
function renderStudentList() {
  if (students.length === 0) {
    studentList.innerHTML = "<div class='empty'>Belum ada data siswa</div>";
    updateStatistics();
    return;
  }

  // Gunakan map().join() untuk efisiensi manipulasi DOM
  studentList.innerHTML = students.map((student, i) => `
    <div class="student-item">
      <div class="student-name">
        <span class="student-number">${i + 1}.</span>
        ${student.name}
      </div>
      <div class="score">${student.score}</div>
      <div class="action-buttons">
        <button class="edit-btn" type="button" data-action="edit" data-index="${i}">✏️ Ubah</button>
        <button class="delete-btn" type="button" data-action="delete" data-index="${i}">🗑 Hapus</button>
      </div>
    </div>
  `).join('');

  updateStatistics();
}

// Siapkan form ke mode Edit
function prepareEdit(index) {
  const student = students[index];
  if (!student) return;

  studentName.value = student.name;
  studentScore.value = student.score;
  studentIndex.value = index;

  formTitle.textContent = "✏️ Edit Siswa";
  submitBtn.textContent = "💾 Simpan Perubahan";
  cancelBtn.style.display = "block";
  studentName.focus();
}

// Hapus data siswa
function deleteStudent(index) {
  const student = students[index];
  if (!student) return;

  // Memperbaiki syntax error template literal pada confirm
  const isConfirmed = confirm(`Apakah Anda yakin ingin menghapus data siswa "${student.name}"?`);
  if (!isConfirmed) return;

  students.splice(index, 1);
  saveStudents();
  renderStudentList();

  // Reset form jika data yang sedang diedit ikut terhapus
  if (studentIndex.value === String(index)) {
    resetForm();
  }

  showNotification("🗑 Data siswa berhasil dihapus!");
}

// --- EVENT LISTENERS ---

// Handle Submit Form (Tambah / Update)
studentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameValue = studentName.value.trim();
  const scoreValue = studentScore.value;
  const indexValue = studentIndex.value;

  if (!nameValue || scoreValue === "") return;

  if (indexValue === "") {
    // CREATE
    students.push({ name: nameValue, score: scoreValue });
    showNotification("✅ Data siswa berhasil ditambahkan!");
  } else {
    // UPDATE
    const idx = Number(indexValue);
    students[idx] = { name: nameValue, score: scoreValue };
    showNotification("🔄 Data siswa berhasil diupdate!");
    resetForm();
  }

  saveStudents();
  renderStudentList();
  
  if (indexValue === "") {
    studentForm.reset();
  }
});

// Handle Tombol Batal Edit
cancelBtn.addEventListener("click", () => {
  resetForm();
});

// Event Delegation untuk tombol Edit & Delete di dalam list
studentList.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const index = Number(button.dataset.index);

  if (action === "edit") {
    prepareEdit(index);
  } else if (action === "delete") {
    deleteStudent(index);
  }
});

// Inisialisasi awal
renderStudentList();