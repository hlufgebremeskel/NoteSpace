import React, { useState, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Check,
  Columns2,
  Eye,
  FileEdit,
  Menu,
  PenLine,
  Star,
  Archive,
  Trash2,
} from 'lucide-react';
import EmptyState from '../EmptyState/EmptyState';
import Toolbar from '../Toolbar/Toolbar';
import MarkdownPreview from '../MarkdownPreview/MarkdownPreview';
import { getNoteStats, resolveCategory } from '../../utils/noteHelpers';
import { formatNoteDate } from '../../utils/dateHelpers';
import { applyMarkdownFormat } from '../../utils/markdownFormatting';
import './Editor.css';

/**
 * Right-hand workspace panel for viewing and editing the selected note.
 * Integrates the Markdown formatting toolbar (via useRef selection control)
 * and live GitHub Flavored Markdown preview.
 */
export default function Editor({
  note = null,
  categories = [],
  onChangeTitle,
  onChangeContent,
  onChangeCategory,
  onToggleFavorite,
  onToggleArchive,
  onDeleteNote,
  onNewNote,
  onBackToList,
  onOpenSidebar,
  readOnly = false,
  saveStatus = 'Saved',
  titleInputRef = null,
  textareaRef = null,
  renderToolbar,
  renderPreview,
  renderCategorySelector,
}) {
  const [viewMode, setViewMode] = useState('split'); // 'edit' | 'split' | 'preview'
  const internalTextareaRef = useRef(null);
  const activeTextareaRef = textareaRef || internalTextareaRef;

  const content = note?.content ?? '';

  const handleFormat = useCallback(
    (action) => {
      if (!note || readOnly || !onChangeContent) return;

      const textarea = activeTextareaRef.current;
      const selectionStart = textarea ? textarea.selectionStart : content.length;
      const selectionEnd = textarea ? textarea.selectionEnd : content.length;

      const { nextValue, nextSelectionStart, nextSelectionEnd } =
        applyMarkdownFormat({
          value: content,
          selectionStart,
          selectionEnd,
          action,
        });

      onChangeContent(nextValue);

      setTimeout(() => {
        const el = activeTextareaRef.current;
        if (el) {
          el.focus();
          el.setSelectionRange(nextSelectionStart, nextSelectionEnd);
        }
      }, 0);
    },
    [note, readOnly, onChangeContent, activeTextareaRef, content]
  );

  if (!note) {
    return (
      <main className="editor-panel" aria-label="Note editor">
        <div className="editor-empty-bar">
          <button
            type="button"
            className="btn-icon mobile-only-btn"
            onClick={onOpenSidebar}
            aria-label="Open navigation menu"
            title="Open menu"
          >
            <Menu size={18} />
          </button>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
            NoteSpace Editor
          </span>
        </div>
        <EmptyState
          icon={PenLine}
          title="No note selected"
          description="Select a note from the list or create a new note to start writing in Markdown."
          actionLabel={onNewNote ? 'New Note' : undefined}
          onAction={onNewNote}
        />
      </main>
    );
  }

  const { wordCount, charCount } = getNoteStats(content);
  const validCategory = resolveCategory(categories, note.categoryId);
  const selectedCategoryValue = validCategory ? validCategory.id : '';

  const isEditVisible = viewMode === 'edit' || viewMode === 'split';
  const isPreviewVisible = viewMode === 'preview' || viewMode === 'split';

  return (
    <main className="editor-panel" aria-label="Note editor">
      <header className="editor-header">
        <div className="editor-header-left">
          {onBackToList && (
            <button
              type="button"
              className="btn-icon editor-back-btn"
              onClick={onBackToList}
              aria-label="Back to notes list"
              title="Back to notes list"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <input
            ref={titleInputRef}
            type="text"
            className="editor-title-input"
            value={note.title ?? ''}
            onChange={(e) => onChangeTitle?.(e.target.value)}
            placeholder="Untitled Note"
            aria-label="Note title"
            readOnly={readOnly}
          />
        </div>

        <div className="editor-header-controls">
          {renderCategorySelector
            ? renderCategorySelector()
            : onChangeCategory && (
                <select
                  className="editor-category-select"
                  value={selectedCategoryValue}
                  onChange={(e) => onChangeCategory(e.target.value || null)}
                  aria-label="Note category"
                  disabled={readOnly}
                >
                  <option value="">Uncategorized</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}

          <div className="editor-mode-tabs" role="tablist" aria-label="Editor view mode">
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'edit'}
              className={`editor-mode-tab ${viewMode === 'edit' ? 'is-active' : ''}`}
              onClick={() => setViewMode('edit')}
            >
              <FileEdit size={13} aria-hidden="true" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'split'}
              className={`editor-mode-tab editor-mode-tab-split ${viewMode === 'split' ? 'is-active' : ''}`}
              onClick={() => setViewMode('split')}
            >
              <Columns2 size={13} aria-hidden="true" />
              <span>Split</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'preview'}
              className={`editor-mode-tab ${viewMode === 'preview' ? 'is-active' : ''}`}
              onClick={() => setViewMode('preview')}
            >
              <Eye size={13} aria-hidden="true" />
              <span>Preview</span>
            </button>
          </div>

          {onToggleFavorite && (
            <button
              type="button"
              className="btn-icon"
              onClick={onToggleFavorite}
              aria-label={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star size={17} fill={note.isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}

          {onToggleArchive && (
            <button
              type="button"
              className="btn-icon"
              onClick={onToggleArchive}
              aria-label={note.isArchived ? 'Restore note' : 'Archive note'}
              title={note.isArchived ? 'Restore note' : 'Archive note'}
            >
              <Archive size={17} />
            </button>
          )}

          {onDeleteNote && (
            <button
              type="button"
              className="btn-icon btn-icon-danger"
              onClick={onDeleteNote}
              aria-label="Delete note"
              title="Delete note"
            >
              <Trash2 size={17} />
            </button>
          )}
        </div>
      </header>

      {isEditVisible &&
        (renderToolbar ? (
          renderToolbar()
        ) : (
          <Toolbar onFormat={handleFormat} disabled={readOnly} />
        ))}

      <div className={`editor-workspace ${viewMode === 'split' ? 'is-split' : ''}`}>
        {isEditVisible && (
          <div className="editor-pane editor-pane-write">
            <textarea
              ref={activeTextareaRef}
              className="editor-textarea"
              value={content}
              onChange={(e) => onChangeContent?.(e.target.value)}
              placeholder="Start writing in Markdown..."
              aria-label="Markdown editor"
              readOnly={readOnly}
            />
          </div>
        )}

        {isPreviewVisible && (
          <div className="editor-pane editor-pane-preview">
            <div className="editor-preview-scroll">
              {renderPreview ? (
                renderPreview(content)
              ) : (
                <MarkdownPreview content={content} />
              )}
            </div>
          </div>
        )}
      </div>

      <footer className="editor-footer">
        <span className="editor-save-status">
          {!readOnly && <Check size={13} aria-hidden="true" />}
          <span>
            {readOnly
              ? 'Read-only preview'
              : `${saveStatus} · Updated ${formatNoteDate(note.updatedAt)}`}
          </span>
        </span>
        <div className="editor-stats">
          <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          <span>{charCount} {charCount === 1 ? 'character' : 'characters'}</span>
        </div>
      </footer>
    </main>
  );
}
