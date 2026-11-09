import React from 'react';
import { FileText } from 'lucide-react';
import './EmptyState.css';

/**
 * Reusable empty state component for lists, search results, and blank panels.
 */
export default function EmptyState({
  icon: Icon = FileText,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon" aria-hidden="true">
        <Icon size={22} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          className="btn btn-primary empty-state-action"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

