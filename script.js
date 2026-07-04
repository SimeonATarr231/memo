// MEMO — STATE & STORAGE
const STORAGE_KEY = "memo-notes";
const MAX_CHARS   = 1000;


// LOAD & SAVE
function loadNotes() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}


// STATE
let notes       = loadNotes();
let activeColor = "yellow";
let searchQuery = "";


// DOM REFERENCES
const notesGrid    = document.getElementById("notesGrid");
const emptyState   = document.getElementById("emptyState");
const noteCount    = document.getElementById("noteCount");
const composeTitle = document.getElementById("composeTitle");
const composeBody  = document.getElementById("composeBody");
const charCount    = document.getElementById("charCount");
const addBtn       = document.getElementById("addBtn");
const colorPicker  = document.getElementById("colorPicker");
const searchInput  = document.getElementById("searchInput");
const resultCount  = document.getElementById("resultCount");
const themeToggle  = document.getElementById("themeToggle");


// COLOR CONFIG
const COLOR_MAP = {
  yellow: { bg: "--note-yellow", border: "--note-yellow-border" },
  blue:   { bg: "--note-blue",   border: "--note-blue-border"   },
  pink:   { bg: "--note-pink",   border: "--note-pink-border"   },
  green:  { bg: "--note-green",  border: "--note-green-border"  },
};


// RENDER ENGINE
function getFilteredNotes() {
  if (searchQuery === "") return [...notes];
  return notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery) ||
    note.body.toLowerCase().includes(searchQuery)
  );
}

function getSortedNotes(filtered) {
  const pinned   = filtered.filter((n) => n.pinned);
  const unpinned = filtered.filter((n) => !n.pinned);
  return [...pinned, ...unpinned];
}

function renderNotes() {
  const filtered = getSortedNotes(getFilteredNotes());
  notesGrid.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;

    filtered.forEach((note) => {
      const colors = COLOR_MAP[note.color] || COLOR_MAP.yellow;
      const bgVal     = getComputedStyle(document.documentElement).getPropertyValue(colors.bg).trim();
      const borderVal = getComputedStyle(document.documentElement).getPropertyValue(colors.border).trim();

      const card = document.createElement("div");
      card.className = `note-card${note.pinned ? " is-pinned" : ""}`;
      card.style.setProperty("--note-bg",     bgVal);
      card.style.setProperty("--note-border", borderVal);
      card.dataset.id = note.id;

      card.innerHTML = `
        <div class="note-header">
          <span class="note-title">${escapeHTML(note.title)}</span>
          <div class="note-actions">
            <button
              class="note-action-btn pin-btn ${note.pinned ? "is-pinned" : ""}"
              data-action="pin"
              data-id="${note.id}"
              aria-label="${note.pinned ? "Unpin" : "Pin"} note"
            >${note.pinned ? "📌" : "📍"}</button>
            <button
              class="note-action-btn delete-btn"
              data-action="delete"
              data-id="${note.id}"
              aria-label="Delete note"
            >✕</button>
          </div>
        </div>
        ${note.body ? `<p class="note-body">${escapeHTML(note.body)}</p>` : ""}
        <span class="note-timestamp">${formatTimestamp(note.createdAt)}</span>
      `;

      notesGrid.appendChild(card);
    });
  }

  const total = notes.length;
  noteCount.textContent = `${total} ${total === 1 ? "note" : "notes"}`;

  if (searchQuery !== "") {
    resultCount.textContent = `${filtered.length} result${filtered.length === 1 ? "" : "s"}`;
    resultCount.hidden = false;
  } else {
    resultCount.hidden = true;
  }
}


// CRUD OPERATIONS
function addNote() {
  const title = composeTitle.value.trim();
  const body  = composeBody.value.trim();

  if (!title && !body) return;

  const note = {
    id:        crypto.randomUUID(),
    title:     title,
    body:      body,
    color:     activeColor,
    pinned:    false,
    createdAt: Date.now(),
  };

  notes.unshift(note);
  saveNotes(notes);
  renderNotes();
  resetCompose();
}

function deleteNote(id) {
  notes = notes.filter((n) => n.id !== id);
  saveNotes(notes);
  renderNotes();
}

function togglePin(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;
  note.pinned = !note.pinned;
  saveNotes(notes);
  renderNotes();
}


// COMPOSE HELPERS
function resetCompose() {
  composeTitle.value = "";
  composeBody.value  = "";
  updateCharCount();
  composeTitle.focus();
}

function updateCharCount() {
  const len = composeBody.value.length;
  charCount.textContent = `${len} / ${MAX_CHARS}`;
  charCount.classList.toggle("is-near-limit", len >= 800 && len < MAX_CHARS);
  charCount.classList.toggle("is-at-limit",   len >= MAX_CHARS);
  addBtn.disabled = len >= MAX_CHARS;
}


// UTILITIES
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatTimestamp(ts) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
    hour:  "2-digit",
    minute: "2-digit",
  });
}


// EVENT DELEGATION — NOTES GRID
function handleGridClick(event) {
  const btn = event.target.closest(".note-action-btn");
  if (!btn) return;

  const id     = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === "delete") deleteNote(id);
  if (action === "pin")    togglePin(id);
}


// EVENT DELEGATION — COLOR PICKER
function handleColorPick(event) {
  const dot = event.target.closest(".color-dot");
  if (!dot) return;

  activeColor = dot.dataset.color;

  document.querySelectorAll(".color-dot").forEach((d) => {
    d.classList.toggle("is-active", d.dataset.color === activeColor);
  });
}


// EVENT LISTENERS
addBtn.addEventListener("click", addNote);

composeBody.addEventListener("input", updateCharCount);

composeTitle.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    composeBody.focus();
  }
});

composeBody.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    addNote();
  }
});

colorPicker.addEventListener("click", handleColorPick);
notesGrid.addEventListener("click", handleGridClick);

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.trim().toLowerCase();
  renderNotes();
});

themeToggle.addEventListener("click", () => {
  const root    = document.documentElement;
  const current = root.getAttribute("data-theme");
  const next    = current === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  themeToggle.textContent = next === "dark" ? "☀" : "☾";
  renderNotes();
});

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "f") {
    e.preventDefault();
    searchInput.focus();
  }
});


// INITIALISE
updateCharCount();
renderNotes();