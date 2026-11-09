import React from 'react';
import {
  FileText,
  Plus,
  Layers,
  Star,
  Clock,
  Archive,
  Settings,
  X,
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'all', label: 'All Notes', icon: Layers },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'recent', label: 'Recently Updated', icon: Clock },
  { id: 'archived', label: 'Archived', icon: Archive },
];

/**
 * Primary workspace navigation sidebar.
 * Converts to a slide-over drawer on tablet and mobile screens.
 */
export default function Sidebar({
  activeNav = 'all',
  selectedCategoryId = null,
  categories = [],
  counts = { all: 0, favorites: 0, recent: 0, archived: 0 },
  onSelectNav,
  onSelectCategory,
  onNewNote,
  onCreateCategory,
  onOpenSettings,
  onClose,
}) {
  return (
    <aside className="sidebar" aria-label="Primary sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-logo" aria-hidden="true">
            <FileText size={16} />
          </div>
          <span className="sidebar-title">NoteSpace</span>
        </div>
        <button
          type="button"
          className="btn-icon sidebar-close-btn"
          onClick={onClose}
          aria-label="Close navigation menu"
          title="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <div className="sidebar-action">
        <button
          type="button"
          className="btn btn-primary sidebar-new-note-btn"
          onClick={onNewNote}
        >
          <Plus size={16} aria-hidden="true" />
          <span>New Note</span>
        </button>
      </div>

      <div className="sidebar-content">
        <nav aria-label="Notes views">
          <ul className="sidebar-nav-list">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const isActive = activeNav === id && !selectedCategoryId;
              const count = counts[id] ?? 0;
              return (
                <li key={id}>
                  <button
                    type="button"
                    className={`sidebar-nav-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => onSelectNav(id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="sidebar-nav-label">
                      <Icon size={16} aria-hidden="true" />
                      <span>{label}</span>
                    </span>
                    <span className="sidebar-nav-count" aria-label={`${count} notes`}>
                      {count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <section aria-label="Categories">
          <div className="sidebar-section-header">
            <h2 className="sidebar-section-title">Categories</h2>
            <button
              type="button"
              className="sidebar-section-add"
              onClick={onCreateCategory}
              aria-label="Create category"
              title="Create category"
            >
              <Plus size={15} />
            </button>
          </div>

          {categories.length === 0 ? (
            <p className="sidebar-categories-empty">No categories yet</p>
          ) : (
            <ul className="sidebar-nav-list">
              {categories.map((category) => {
                const isSelected = selectedCategoryId === category.id;
                return (
                  <li key={category.id}>
                    <button
                      type="button"
                      className={`sidebar-nav-item ${isSelected ? 'is-active' : ''}`}
                      onClick={() => onSelectCategory(category.id)}
                      aria-current={isSelected ? 'page' : undefined}
                    >
                      <span className="sidebar-nav-label">
                        <span
                          className="sidebar-category-dot"
                          style={{ backgroundColor: category.color || 'var(--color-accent)' }}
                          aria-hidden="true"
                        />
                        <span>{category.name}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-nav-item"
          onClick={onOpenSettings}
          aria-label="Open settings"
        >
          <span className="sidebar-nav-label">
            <Settings size={16} aria-hidden="true" />
            <span>Settings</span>
          </span>
        </button>
      </div>
    </aside>
  );
}

