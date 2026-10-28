// sweetalert js script
const $favoriteButton = document.querySelector(".favorite-button");
$favoriteButton.addEventListener("click", () => {
    // Swal.fire({
    //     title: 'Error!',
    //     text: 'Do you want to continue',
    //     icon: 'error',
    //     confirmButtonText: 'Cool'
    // });

    Swal.fire({
        title: "هل تريد الاستمرار؟",
        text: "Apakah Anda yakin untuk melanjutkan?",
        icon: "question",
        iconHtml: "؟",
        confirmButtonText: "نعم",
        cancelButtonText: "لا",
        showCancelButton: true,
        showCloseButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("Saved!", "Data berhasil di hapus", "success");
        }        
    });
});

// floating ui js script
const { computePosition, autoUpdate, offset, flip, shift } = window.FloatingUIDOM;
const $infoBtn = document.querySelector("#info-btn");
const $tip = document.querySelector("#tip");
let stopAutoUpdate = null;

function updateTip() {
    computePosition($infoBtn, $tip, {
        placement: "top",
        middleware: [offset(8), flip(), shift({ padding: 8 })]
    }).then(({ x, y }) => {
        Object.assign($tip.style, { left: `${x}px`, top: `${y}px` });
    });
}

function showTip() {
    $tip.classList.add("show");
    stopAutoUpdate = autoUpdate($infoBtn, $tip, updateTip);
}

function hideTip() {
    $tip.classList.remove("show");
    if (stopAutoUpdate) {
        stopAutoUpdate();
        stopAutoUpdate = null;
    }
}

[["mouseenter", showTip], ["mouseleave", hideTip], ["focus", showTip], ["blur", hideTip]]
    .forEach(([event, handler]) => $infoBtn.addEventListener(event, handler));

// tom select js script
const $kategoriResult = document.querySelector("#kategori-result");
new TomSelect("#kategori",{
	persist: false,
	createOnBlur: true,
	create: true,
    plugins: ["remove_button"],
    placeholder: "Pilih kategori...",
    onChange(values) {
        $kategoriResult.textContent = values.length
            ? `Dipilih: ${values.join(", ")}`
            : "Belum ada pilihan";
    }
});

// flatpickr js script
new flatpickr('#tanggal', {
    // enableTime: true,
    mode: "range",
    // d = day, Y = year, H:i = hour:minute
    // M = short month, F = full month 
    dateFormat: "d-F-Y H:i",
    locale: "id"
});
// new flatpickr('#tanggalArab', {
//     enableTime: true,
//     dateFormat: "d-F-Y H:i", // M = short month, F = full month 
//     locale: "ar"
// });

// chart js
const ctx = document.getElementById('chart');
new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3],
        }]
    }
});
// new Chart(ctx, {
//     type: 'bar',
//     data: {
//         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//         datasets: [{
//         label: '# of Votes',
//         data: [12, 19, 3, 5, 2, 3],
//         borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//         y: {
//             beginAtZero: true
//         }
//         }
//     }
// });

// tabulator js script
//create Tabulator on DOM element with id "tabel"
const tabledata = [
 	{id:1, name:"Oli Bob", age:"12", col:"red", dob:""},
 	{id:2, name:"Mary May", age:"1", col:"blue", dob:"14/05/1982"},
 	{id:3, name:"Christine Lobowski", age:"42", col:"green", dob:"22/05/1982"},
 	{id:4, name:"Brendon Philips", age:"125", col:"orange", dob:"01/08/1980"},
 	{id:5, name:"Margret Marmajuke", age:"16", col:"yellow", dob:"31/01/1999"},
];

// ganti target tabel id ke `#tabel` seperti di html
const table = new Tabulator("#tabel", {
 	height:205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
 	data:tabledata, //assign data to table
 	layout:"fitColumns", //fit columns to width of table (optional)
 	columns:[ //Define Table Columns
	 	{title:"Name", field:"name", width:150},
	 	{title:"Age", field:"age", hozAlign:"left", formatter:"progress"},
	 	{title:"Favourite Color", field:"col"},
	 	{title:"Date Of Birth", field:"dob", sorter:"date", hozAlign:"center"},
 	],
});

//trigger an alert message when the row is clicked
table.on("rowClick", function(e, row){ 
	alert("Row " + row.getData().id + " Clicked!!!!");
});