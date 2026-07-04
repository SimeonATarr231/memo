# Memo — Personal Notes

A minimal personal note-taking workspace. Create, pin, color-tag,
search, and delete notes. Everything persists across sessions.

Built as an original reimagining of the freeCodeCamp Note Taker project.

## Live Demo

[View Live](https://simeonatarr231.github.io/memo)

---

## About

Memo is a single-page note-taking application with full CRUD operations
and localStorage persistence. Notes can be color-tagged across four
colors, pinned to the top of the grid, and searched in real time.
A live character counter tracks body length with visual warnings
approaching the limit. Ctrl+Enter submits a note from the keyboard.
Ctrl+F jumps to search.

---

## Features

- Create notes with title and body
- Four color tags per note — yellow, blue, pink, green
- Pin notes to the top of the grid
- Delete notes
- Real-time search across title and body
- Live character counter with near-limit and at-limit warnings
- All notes persist via localStorage across sessions
- Keyboard shortcuts — Ctrl+Enter to add, Ctrl+F to search
- Full light and dark mode
- Responsive down to mobile

---

## Built With

- HTML5 — semantic structure
- CSS3 — custom properties, auto-fill grid, color token system
- Vanilla JavaScript — CRUD operations, localStorage, search,
  escapeHTML for XSS prevention, crypto.randomUUID()
- Google Fonts — Lora, Inter

---

## JavaScript Concepts Practiced

- Full CRUD — Create, Read, Update (pin toggle), Delete
- localStorage with try/catch error handling
- crypto.randomUUID() for unique note IDs
- escapeHTML() for XSS prevention
- Array.unshift() for newest-first insertion
- Pinned/unpinned sort with array spread
- getComputedStyle() for reading CSS token values
- Date.toLocaleDateString() for timestamp formatting
- Ctrl+Enter and Ctrl+F keyboard shortcuts
- Threshold-based character count warnings

---

## Project Structure
memo/
├── index.html
├── style.css
├── script.js
└── README.md

---

## Local Setup

```bash
git clone https://github.com/SimeonATarr231/memo.git
cd memo
```

---

## Designed & Built by [Simeon Aseon Tarr](https://github.com/SimeonATarr231)

© 2025 Tarr. All rights reserved.