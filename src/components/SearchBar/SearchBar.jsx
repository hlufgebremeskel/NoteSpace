import React from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

/**
 * Controlled search input with clear button.
 */
export default function SearchBar({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search notes...',
  inputRef = null,
}) {
  return (
    <div className="search-bar" role="search">
      <label htmlFor="notes-search-input" className="sr-only">
        Search notes
      </label>
      <span className="search-bar-icon" aria-hidden="true">
        <Search size={15} />
      </span>
      <input
        ref={inputRef}
        id="notes-search-input"
        type="search"
        className="search-bar-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search notes"
      />
      {value && (
        <button
          type="button"
          className="search-bar-clear"
          onClick={onClear}
          aria-label="Clear search"
          title="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

