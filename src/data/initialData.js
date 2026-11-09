export const INITIAL_CATEGORIES = [
  {
    id: 'cat-engineering',
    name: 'Engineering',
    color: '#2563eb',
    createdAt: '2026-11-01T09:00:00.000Z',
  },
  {
    id: 'cat-university',
    name: 'University',
    color: '#7c3aed',
    createdAt: '2026-11-02T10:30:00.000Z',
  },
  {
    id: 'cat-personal',
    name: 'Personal',
    color: '#059669',
    createdAt: '2026-11-03T14:15:00.000Z',
  },
  {
    id: 'cat-ideas',
    name: 'Ideas',
    color: '#d97706',
    createdAt: '2026-11-04T16:45:00.000Z',
  },
];

export const INITIAL_NOTES = [
  {
    id: 'note-welcome',
    title: 'Welcome to NoteSpace',
    content: `# Welcome to NoteSpace

A clean, minimalist **Markdown workspace** built for engineering notes, university lectures, and daily planning.

## Key Capabilities
- **GitHub Flavored Markdown** with tables, task lists, and fenced code blocks
- **Category organization** with custom color badges
- **Instant search** across note titles and body content
- **Favorites & Archive** views to keep active workspaces focused

> "Simplicity is about subtracting the obvious and adding the meaningful."

### Quick Task Checklist
- [x] Initialize workspace architecture
- [x] Design responsive three-column layout
- [ ] Add custom categories and personal notes
`,
    categoryId: 'cat-personal',
    createdAt: '2026-11-07T08:00:00.000Z',
    updatedAt: '2026-11-09T13:30:00.000Z',
    isFavorite: true,
    isArchived: false,
  },
  {
    id: 'note-react-architecture',
    title: 'React State & Storage Architecture',
    content: `# React State & Storage Architecture

## Design Goals for v1.0 → v2.0
Keep UI components decoupled from persistence details so \`localStorage\` can later be replaced by a **NestJS + PostgreSQL** API.

\`\`\`javascript
// Pure domain helpers stay independent of React components
export function updateNoteImmutable(notes, noteId, patch) {
  return notes.map((note) =>
    note.id === noteId
      ? { ...note, ...patch, updatedAt: new Date().toISOString() }
      : note
  );
}
\`\`\`

| Layer | v1.0 Implementation | v2.0 Upgrade Path |
| --- | --- | --- |
| Persistence | Browser \`localStorage\` | PostgreSQL + TypeORM |
| Auth | Single local workspace | JWT authentication |
| Sync | Immediate local writes | REST API + optimistic UI |
`,
    categoryId: 'cat-engineering',
    createdAt: '2026-11-06T11:20:00.000Z',
    updatedAt: '2026-11-09T11:15:00.000Z',
    isFavorite: true,
    isArchived: false,
  },
  {
    id: 'note-algorithms-review',
    title: 'Algorithms Study Plan — Week 7',
    content: `## Topics to Cover
1. Graph traversal: BFS vs. DFS complexity \`O(V + E)\`
2. Shortest paths: Dijkstra's algorithm with min-heap
3. Dynamic programming memoization vs. bottom-up tabulation

### Practice Problems
- [x] Implement topological sort using Kahn's algorithm
- [ ] Solve 3 weighted shortest-path exercises
- [ ] Review recurrence relations for knapsack variants
`,
    categoryId: 'cat-university',
    createdAt: '2026-11-05T15:10:00.000Z',
    updatedAt: '2026-11-08T18:45:00.000Z',
    isFavorite: false,
    isArchived: false,
  },
  {
    id: 'note-product-ideas',
    title: 'Version 2.0 Feature Backlog',
    content: `### Collaboration & Sync Ideas
- Public read-only share links for published study guides
- Export workspace notes as \`.md\` bundle or JSON backup
- Version history snapshots before major edits
- Keyboard command palette (\`Ctrl/Cmd + K\`)
`,
    categoryId: 'cat-ideas',
    createdAt: '2026-11-04T09:30:00.000Z',
    updatedAt: '2026-11-07T10:05:00.000Z',
    isFavorite: false,
    isArchived: false,
  },
  {
    id: 'note-archived-q3',
    title: 'Q3 Sprint Retrospective (Archived)',
    content: `## Summary
Completed core UI component library and automated testing setup.

- Velocity stayed consistent across sprints
- Reduced CSS bundle footprint by using native CSS custom properties
`,
    categoryId: 'cat-engineering',
    createdAt: '2026-10-15T12:00:00.000Z',
    updatedAt: '2026-10-28T17:00:00.000Z',
    isFavorite: false,
    isArchived: true,
  },
];

