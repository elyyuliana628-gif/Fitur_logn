
// MENGAMBIL ELEMEN HTML
const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

const notesForm = document.getElementById("notesForm");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const notesList = document.getElementById("notesList");

// MENGAMBIL DATA DARI LOCALSTORAGE
let notes = JSON.parse(localStorage.getItem("myNotes")) || [];
let editId = null;

// FITUR LOGIN
loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "12345") {
        sessionStorage.setItem("login", username);
        showDashboard();
    } else {
        alert("Username atau password salah!");
    }
});

// MENAMPILKAN DASHBOARD
function showDashboard() {
    loginPage.style.display = "none";
    dashboard.style.display = "block";

    document.getElementById("userDisplay").textContent =
        sessionStorage.getItem("login");

    renderNotes();
}

// FITUR LOGOUT
logoutBtn.addEventListener("click", function() {
    sessionStorage.removeItem("login");

    dashboard.style.display = "none";
    loginPage.style.display = "flex";

    loginForm.reset();
});

// MENYIMPAN CATATAN
function saveNotes() {
    localStorage.setItem("myNotes", JSON.stringify(notes));
}

// MENAMBAHKAN DAN MENGEDIT CATATAN
notesForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (editId !== null) {
        const note = notes.find(n => n.id === editId);

        if (note) {
            note.title = title;
            note.content = content;
        }

        editId = null;

        document.getElementById("saveBtn").textContent =
            "Simpan Catatan";

        document.getElementById("formTitle").textContent =
            "Tambah Catatan";

    } else {
        notes.push({
            id: Date.now(),
            title: title,
            content: content,
            date: new Date().toLocaleDateString("id-ID")
        });
    }

    saveNotes();
    renderNotes();
    notesForm.reset();
});

// MENAMPILKAN CATATAN
function renderNotes() {
    notesList.textContent = "";

    const keyword = document.getElementById("searchNote")
        .value.toLowerCase();

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(keyword) ||
        note.content.toLowerCase().includes(keyword)
    );

    if (filteredNotes.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = "Belum ada catatan.";
        notesList.appendChild(empty);
    }

    filteredNotes.forEach(function(note) {
        const card = document.createElement("div");
        card.className = "note-card";

        const title = document.createElement("h3");
        title.textContent = note.title;

        const content = document.createElement("p");
        content.textContent = note.content;

        const date = document.createElement("small");
        date.className = "note-date";
        date.textContent = "Tanggal: " + note.date;

        const actions = document.createElement("div");
        actions.className = "actions";

        // TOMBOL EDIT
        const editBtn = document.createElement("button");
        editBtn.className = "edit";
        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", function() {
            noteTitle.value = note.title;
            noteContent.value = note.content;

            editId = note.id;

            document.getElementById("saveBtn").textContent =
                "Simpan Perubahan";

            document.getElementById("formTitle").textContent =
                "Edit Catatan";

            noteTitle.focus();
        });

        // TOMBOL HAPUS
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete";
        deleteBtn.textContent = "Hapus";

        deleteBtn.addEventListener("click", function() {
            if (confirm("Yakin ingin menghapus catatan?")) {
                notes = notes.filter(n => n.id !== note.id);

                if (editId === note.id) {
                    editId = null;
                    notesForm.reset();

                    document.getElementById("saveBtn").textContent =
                        "Simpan Catatan";

                    document.getElementById("formTitle").textContent =
                        "Tambah Catatan";
                }

                saveNotes();
                renderNotes();
            }
        });

        actions.append(editBtn, deleteBtn);

        card.append(title, content, date, actions);
        notesList.appendChild(card);
    });

    document.getElementById("totalNotes").textContent =
        notes.length;
}

// FITUR PENCARIAN
document.getElementById("searchNote")
    .addEventListener("input", renderNotes);

// MEMERIKSA LOGIN
if (sessionStorage.getItem("login")) {
    showDashboard();
                  }
