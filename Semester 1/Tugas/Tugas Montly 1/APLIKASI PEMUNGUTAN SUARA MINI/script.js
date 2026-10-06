// 1. Inisialisasi Variabel Data
let totalVotes = 0;
let isVotingClosed = false;

// Objek untuk menyimpan data setiap kandidat
const candidates = {
    html: { name: "HTML Structure", votes: 0, color: "#ef4444" },
    css: { name: "CSS Styling", votes: 0, color: "#3b82f6" },
    js: { name: "JavaScript DOM", votes: 0, color: "#eab308" },
    project: { name: "Mini Project", votes: 0, color: "#22c55e" }
};

// 2. Pemilihan Elemen DOM
const voteButtons = document.querySelectorAll('.vote-btn');
const totalCountEl = document.getElementById('total-count');
const progressContainer = document.getElementById('progress-container');
const feedbackToast = document.getElementById('feedback-toast');
const resetButton = document.getElementById('reset-btn');
const closeButton = document.getElementById('close-voting-btn');
const fullscreenButton = document.getElementById('fullscreen-btn');

// 3. Fungsi Utama
// Render awal progress bars ke dalam DOM
function renderProgressBars() {
    progressContainer.innerHTML = ''; // Kosongkan container
    
    // Konversi object ke array, lalu urutkan berdasarkan jumlah suara terbanyak (Bonus: Pemenang Saat Ini)
    const sortedCandidates = Object.values(candidates).sort((a, b) => b.votes - a.votes);

    sortedCandidates.forEach(candidate => {
        // Hitung persentase
        let percentage = totalVotes === 0 ? 0 : Math.round((candidate.votes / totalVotes) * 100);

        // Buat elemen HTML untuk progress bar
        const progressItem = document.createElement('div');
        progressItem.className = 'progress-item';
        
        progressItem.innerHTML = `
            <div class="progress-header">
                <span>${candidate.name}</span>
                <span>${candidate.votes} (${percentage}%)</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" style="width: ${percentage}%; background-color: ${candidate.color};"></div>
            </div>
        `;
        progressContainer.appendChild(progressItem);
    });
}

// Fungsi untuk menangani proses voting
function handleVote(choiceKey) {
    if (isVotingClosed) return; // Hentikan jika voting ditutup

    // Tambah nilai suara (Perhitungan Dasar)
    candidates[choiceKey].votes++;
    totalVotes++;

    // Update DOM UI
    totalCountEl.textContent = totalVotes;
    renderProgressBars();

    // Tampilkan Umpan Balik (Bonus: Konfirmasi Pemungutan Suara)
    showFeedback(`✅ Vote masuk: ${candidates[choiceKey].name}`);
}

// Fungsi memunculkan pesan umpan balik
function showFeedback(message) {
    feedbackToast.textContent = message;
    feedbackToast.classList.add('show');
    
    // Hilangkan pesan setelah 3 detik
    setTimeout(() => {
        feedbackToast.classList.remove('show');
    }, 3000);
}

// 4. Event Listeners
// Event untuk tombol-tombol pilihan voting
voteButtons.forEach(button => {
    button.addEventListener('click', function() {
        const choice = this.getAttribute('data-choice');
        handleVote(choice);
    });
});

// Event untuk tombol Reset (Bonus Level 1)
resetButton.addEventListener('click', function() {
    // Kembalikan semua nilai ke 0
    totalVotes = 0;
    for (let key in candidates) {
        candidates[key].votes = 0;
    }
    
    // Update ulang DOM
    totalCountEl.textContent = totalVotes;
    renderProgressBars();
    showFeedback("🔄 Voting telah di-reset");
    
    // Buka kembali jika sebelumnya dikunci
    isVotingClosed = false;
    closeButton.textContent = "🔒 Close Voting";
    voteButtons.forEach(btn => btn.disabled = false);
});

// Event untuk tombol Tutup Voting
closeButton.addEventListener('click', function() {
    isVotingClosed = !isVotingClosed; // Toggle status
    
    if (isVotingClosed) {
        this.textContent = "🔓 Open Voting";
        voteButtons.forEach(btn => btn.disabled = true);
        showFeedback("🔒 Sesi voting ditutup");
    } else {
        this.textContent = "🔒 Close Voting";
        voteButtons.forEach(btn => btn.disabled = false);
        showFeedback("🔓 Sesi voting dibuka kembali");
    }
});

// Event untuk Fullscreen (Bonus Level 8)
fullscreenButton.addEventListener('click', function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error: ${err.message}`);
        });
        this.textContent = "🗗 Exit Fullscreen";
    } else {
        document.exitFullscreen();
        this.textContent = "⛶ Fullscreen";
    }
});

// Inisialisasi tampilan pertama kali aplikasi dimuat
renderProgressBars();