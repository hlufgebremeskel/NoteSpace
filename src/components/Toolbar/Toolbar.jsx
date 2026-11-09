import React from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Strikethrough,
  Code,
  FileCode2,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Link,
  Table,
  Minus,
} from 'lucide-react';
import './Toolbar.css';

const TOOLBAR_GROUPS = [
  [
    { action: 'h1', label: 'Heading 1', icon: Heading1 },
    { action: 'h2', label: 'Heading 2', icon: Heading2 },
    { action: 'h3', label: 'Heading 3', icon: Heading3 },
  ],
  [
    { action: 'bold', label: 'Bold (Ctrl+B)', icon: Bold },
    { action: 'italic', label: 'Italic (Ctrl+I)', icon: Italic },
    { action: 'strikethrough', label: 'Strikethrough', icon: Strikethrough },
    { action: 'inline-code', label: 'Inline Code', icon: Code },
  ],
  [
    { action: 'unordered-list', label: 'Unordered List', icon: List },
    { action: 'ordered-list', label: 'Ordered List', icon: ListOrdered },
    { action: 'task-list', label: 'Task List', icon: ListChecks },
    { action: 'blockquote', label: 'Blockquote', icon: Quote },
  ],
  [
    { action: 'link', label: 'Insert Link', icon: Link },
    { action: 'code-block', label: 'Code Block', icon: FileCode2 },
    { action: 'table', label: 'Insert Table', icon: Table },
    { action: 'hr', label: 'Horizontal Rule', icon: Minus },
  ],
];

/**
 * Markdown formatting toolbar that inserts or wraps syntax around cursor selection.
 */
export default function Toolbar({ onFormat, disabled = false }) {
  return (
    <div className="markdown-toolbar" role="toolbar" aria-label="Markdown formatting">
      {TOOLBAR_GROUPS.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {groupIndex > 0 && <span className="toolbar-divider" aria-hidden="true" />}
          <div className="toolbar-group">
            {group.map(({ action, label, icon: Icon }) => (
              <button
                key={action}
                type="button"
                className="toolbar-btn"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onFormat?.(action)}
                disabled={disabled}
                aria-label={label}
                title={label}
              >
                <Icon size={15} aria-hidden="true" />
              </button>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

