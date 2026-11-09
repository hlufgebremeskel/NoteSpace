import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './MarkdownPreview.css';

function isExternalUrl(href = '') {
  return /^https?:\/\//i.test(href);
}

function isSafeHref(href = '') {
  if (!href) return false;
  const trimmed = href.trim();
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) return true;
  return /^(https?:|mailto:)/i.test(trimmed);
}

function SafeLink({ href, children, ...props }) {
  if (!isSafeHref(href)) {
    return <span>{children}</span>;
  }

  if (isExternalUrl(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

/**
 * Renders Markdown source safely into formatted React elements with GFM support.
 */
export default function MarkdownPreview({ content = '' }) {
  if (!content || !content.trim()) {
    return (
      <div className="markdown-preview-empty" role="status">
        Nothing to preview yet. Start writing Markdown in the editor.
      </div>
    );
  }

  return (
    <div className="markdown-preview">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: SafeLink,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

