# NoteSpace

A modern, minimalist, Markdown-powered note-taking application inspired by Notion — built with React, Vite, pure CSS, and GitHub Flavored Markdown.

> **Current Status:** Phase 5 of 12 complete (UI Foundation, Note Display, Note CRUD, and Markdown Editor & Preview).

---

## Implemented Features (Through Phase 5)

- **Three-Column Responsive Workspace:**
  - Desktop three-column layout (`Sidebar`, `NotesList`, `Editor`)
  - Tablet collapsible slide-over navigation drawer (`<= 1024px`)
  - Mobile list/editor view switching with `Edit` / `Preview` tabs (`<= 768px`)
- **Complete Note CRUD Operations:**
  - Create new notes (`"Untitled Note"`, empty content, UUID v4 ID, ISO 8601 timestamps) placed at the top of the list and selected automatically
  - Live immutable editing of note titles, Markdown content, and category assignments
  - Safe note deletion via an accessible `ConfirmDialog` (`role="alertdialog"`, `Escape` support) with graceful handling when clearing selection or deleting the final note
- **Markdown Editor & Formatting Toolbar:**
  - Textarea-based Markdown editor with live word count and character count
  - 15-action formatting toolbar using `useRef` cursor & selection manipulation (H1–H3, Bold, Italic, Strikethrough, Inline Code, Unordered/Ordered/Task Lists, Blockquote, Link, Code Block, Table, Horizontal Rule)
- **Live GitHub Flavored Markdown Preview:**
  - Powered by `react-markdown` and `remark-gfm`
  - Supports headings, tables, task checkboxes, fenced code blocks, inline code, blockquotes, links, and horizontal rules
  - XSS-safe by design: raw HTML rendering is disabled, `dangerouslySetInnerHTML` is never used, and external links open safely with `rel="noopener noreferrer"`
- **Theme Support & Views:**
  - Light and Dark mode switching via CSS variables in `SettingsDialog`
  - View filtering for `All Notes`, `Favorites`, `Recently Updated`, `Archived`, and categories

---

## Tech Stack (v1.0)

- **Frontend:** React 18, JavaScript (ES6+), Vite 6, HTML5, CSS3 (CSS Custom Properties — no CSS frameworks)
- **Markdown:** `react-markdown`, `remark-gfm`
- **Icons:** `lucide-react`
- **IDs:** `uuid`
- **Testing:** Vitest, React Testing Library, `@testing-library/jest-dom`, `@testing-library/user-event`

---

## Project Architecture

```text
NoteSpace/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ConfirmDialog/    # Accessible confirmation modal
│   │   ├── Editor/           # Split-screen / tabbed Markdown editor & stats footer
│   │   ├── EmptyState/       # Reusable empty view indicator
│   │   ├── MarkdownPreview/  # Safe GFM Markdown renderer
│   │   ├── NoteCard/         # Note summary card with preview, category, & timestamp
│   │   ├── NotesList/        # Middle panel with heading, search bar, & list
│   │   ├── SearchBar/        # Controlled search input with clear control
│   │   ├── SettingsDialog/   # Workspace settings & Light/Dark theme switcher
│   │   ├── Sidebar/          # Primary workspace navigation & categories list
│   │   └── Toolbar/          # 15-action Markdown formatting toolbar
│   ├── data/
│   │   └── initialData.js    # Initial sample notes & categories
│   ├── styles/
│   │   ├── global.css        # Reset, accessibility utilities, & button primitives
│   │   ├── layout.css        # Responsive 3-column grid & drawer layout
│   │   └── variables.css     # Light & dark design tokens
│   ├── test/
│   │   └── setup.js          # Vitest + jest-dom setup
│   ├── utils/
│   │   ├── dateHelpers.js        # Relative & localized date formatting
│   │   ├── markdownFormatting.js # Cursor & selection Markdown transform helpers
│   │   └── noteHelpers.js        # Pure immutable CRUD, filtering, & preview helpers
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation & Local Development

```bash
git clone <your-github-repo-url>
cd NoteSpace
npm install
npm run dev
```

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run unit and component tests with Vitest |
| `npm run test:watch` | Run Vitest in watch mode |

---

## Testing

Unit and component tests are written with **Vitest** and **React Testing Library**.

```bash
npm test
```

Current coverage through Phase 5 includes **10 test files (32 tests)** covering date/note/Markdown utilities, `NoteCard`, `NotesList`, `ConfirmDialog`, `Toolbar`, `MarkdownPreview`, `Editor`, and full `App` CRUD flows.

---

## Development Roadmap

- [x] **Phase 1:** Project Initialization (Vite, React, Vitest, design tokens)
- [x] **Phase 2:** UI Foundation (3-column responsive layout, drawer, empty states)
- [x] **Phase 3:** Note Display (`NoteCard`, sample notes, selected-note navigation)
- [x] **Phase 4:** Note CRUD (Create, Edit, Delete, `ConfirmDialog`)
- [x] **Phase 5:** Markdown Editor & GFM Live Preview (`Toolbar` + `MarkdownPreview`)
- [ ] **Phase 6:** Search & Combined Filtering
- [ ] **Phase 7:** Category Management (Create, Rename, Recolor, Delete)
- [ ] **Phase 8:** `localStorage` Persistence (`useLocalStorage`)
- [ ] **Phase 9:** Favorites, Archive Actions, Sorting, & Keyboard Shortcuts
- [ ] **Phase 10:** Responsive & Touch Interaction Refinement
- [ ] **Phase 11:** Comprehensive Testing & Accessibility Audit
- [ ] **Phase 12:** Final Documentation, Screenshots, & Deployment

### Future v2.0 Architecture

Version 1.0 isolates data helpers and storage layers so a future **NestJS + PostgreSQL (TypeORM)** backend with JWT authentication, cloud sync, note sharing, and version history can replace local persistence cleanly.
