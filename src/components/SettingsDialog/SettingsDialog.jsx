import React, { useEffect } from 'react';
import { Moon, Sun, X } from 'lucide-react';
import './SettingsDialog.css';

/**
 * Application settings modal for theme switching and workspace metadata.
 */
export default function SettingsDialog({ isOpen, theme, onChangeTheme, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="dialog-surface"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-dialog-title"
      >
        <div className="dialog-header">
          <h2 id="settings-dialog-title" className="dialog-title">
            Workspace Settings
          </h2>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close settings"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="dialog-body">
          <div className="settings-row">
            <div className="settings-label-group">
              <span className="settings-label">Appearance</span>
              <span className="settings-description">Choose light or dark color mode</span>
            </div>

            <div className="theme-switch-group" role="group" aria-label="Color theme">
              <button
                type="button"
                className={`theme-switch-btn ${theme === 'light' ? 'is-active' : ''}`}
                onClick={() => onChangeTheme('light')}
                aria-pressed={theme === 'light'}
              >
                <Sun size={14} aria-hidden="true" />
                <span>Light</span>
              </button>
              <button
                type="button"
                className={`theme-switch-btn ${theme === 'dark' ? 'is-active' : ''}`}
                onClick={() => onChangeTheme('dark')}
                aria-pressed={theme === 'dark'}
              >
                <Moon size={14} aria-hidden="true" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div className="settings-meta-card">
            <div className="settings-meta-line">
              <span>Application</span>
              <strong>NoteSpace v1.0.0</strong>
            </div>
            <div className="settings-meta-line">
              <span>Storage Engine</span>
              <strong>Browser localStorage (Phase 8)</strong>
            </div>
          </div>
        </div>

        <div className="dialog-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

