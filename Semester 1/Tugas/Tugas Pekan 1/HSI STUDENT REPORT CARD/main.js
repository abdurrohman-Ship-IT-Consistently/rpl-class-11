/*
==================================================
JS Weekly Challenge #1 - HSI STUDENT REPORT CARD
File: main.js
==================================================
*/

// 1. Tanggal Laporan
const reportDate = new Date();

// 2. Data Siswa (2 Siswa: 1 LULUS & 1 BELUM LULUS)
const students = [
  {
    name: "Ahmad Abdullah",
    className: "Kelas 10A",
    scores: [85, 90, 88], // Rata-rata: 87.67 -> LULUS
    attendance: 90,
    hasViolation: false,
  },
  {
    name: "Budi Santoso",
    className: "Kelas 10A",
    scores: [60, 65, 70], // Rata-rata: 65 -> BELUM LULUS
    attendance: 75,
    hasViolation: true, 
  },
];

// Variabel Tambahan untuk Fitur Bonus
let totalPassed = 0;
let totalFailed = 0;
let highestAverage = 0;
let topStudentName = "";

// Header Laporan
console.log("==================================================");
console.log("          🎓 HSI STUDENT REPORT CARD 🎓          ");
console.log("==================================================");
console.log(`Tanggal Laporan : ${reportDate.toLocaleDateString()}`);
console.log("--------------------------------------------------\n");

// 3. Pengolahan Data Siswa (For Loop Utama)
for (let i = 0; i < students.length; i++) {
  const student = students[i];

  // Hitung Total Nilai Menggunakan For Loop
  let totalScore = 0;
  let scoresText = "";

  for (let j = 0; j < student.scores.length; j++) {
    totalScore += student.scores[j];

    // Format tampilan list nilai tanpa method .join()
    if (j === 0) {
      scoresText = String(student.scores[j]); // Memastikan tipe datanya string
    } else {
      scoresText += ", " + student.scores[j];
    }
  }

  // Hitung Rata-rata
  const averageScore = totalScore / student.scores.length;

  // Penentuan Grade (if / else if / else)
  let grade = "";
  if (averageScore >= 90) {
    grade = "A";
  } else if (averageScore >= 80) {
    grade = "B";
  } else if (averageScore >= 70) {
    grade = "C";
  } else {
    grade = "D";
  }

  // Penentuan Status Kelulusan
  // Syarat: Rata-rata >= 75 && Kehadiran >= 80 && Tidak ada pelanggaran (!hasViolation)
  let status = "";
  if (averageScore >= 75 && student.attendance >= 80 && !student.hasViolation) {
    status = "LULUS ✅";
    totalPassed++;
  } else {
    status = "BELUM LULUS ❌";
    totalFailed++;
  }

  // Cari Siswa dengan Rata-rata Tertinggi (Bonus)
  if (averageScore > highestAverage) {
    highestAverage = averageScore;
    topStudentName = student.name;
  }

  // Output Per Siswa
  console.log(`Student #${i + 1}`);
  console.log(`Nama       : ${student.name}`);
  console.log(`Kelas      : ${student.className}`);
  console.log(`Nilai      : ${scoresText}`);
  console.log(`Total      : ${totalScore}`);
  console.log(`Rata-rata  : ${averageScore.toFixed(2)}`);
  console.log(`Grade      : ${grade}`);
  console.log(`Kehadiran  : ${student.attendance}%`);
  console.log(`Pelanggaran: ${student.hasViolation ? "Ada ⚠️" : "Tidak Ada 🛡️"}`);
  console.log(`Status     : ${status}`);
  console.log("--------------------------------------------------");
}

// 4. Output Ringkasan & Fitur Bonus
console.log("\n==================================================");
console.log("                📊 RINGKASAN LAPORAN             ");
console.log("==================================================");
console.log(`Total Siswa Diproses : ${students.length}`);
console.log(`Siswa LULUS          : ${totalPassed} orang 🎉`);
console.log(`Siswa BELUM LULUS    : ${totalFailed} orang ⚠️`);
console.log(`Siswa Terbaik        : ${topStudentName} (Rata-rata: ${highestAverage.toFixed(2)}) 🏆`);
console.log("==================================================");