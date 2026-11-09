/**
 * Pure Markdown cursor & selection formatting utility.
 * Given textarea value, selection offsets, and an action identifier,
 * computes the next text value and updated selection range.
 */

function wrapSelection({
  value,
  selectionStart,
  selectionEnd,
  prefix,
  suffix,
  placeholder,
}) {
  const selected = value.slice(selectionStart, selectionEnd);
  const before = value.slice(0, selectionStart);
  const after = value.slice(selectionEnd);

  if (selected) {
    // Unwrap if already wrapped with the exact prefix/suffix
    if (before.endsWith(prefix) && after.startsWith(suffix)) {
      const nextValue =
        before.slice(0, before.length - prefix.length) +
        selected +
        after.slice(suffix.length);
      return {
        nextValue,
        nextSelectionStart: selectionStart - prefix.length,
        nextSelectionEnd: selectionEnd - prefix.length,
      };
    }

    const nextValue = `${before}${prefix}${selected}${suffix}${after}`;
    return {
      nextValue,
      nextSelectionStart: selectionStart + prefix.length,
      nextSelectionEnd: selectionEnd + prefix.length,
    };
  }

  const nextValue = `${before}${prefix}${placeholder}${suffix}${after}`;
  const start = selectionStart + prefix.length;
  return {
    nextValue,
    nextSelectionStart: start,
    nextSelectionEnd: start + placeholder.length,
  };
}

function prefixSelectedLines({
  value,
  selectionStart,
  selectionEnd,
  getPrefix,
  placeholder,
  stripRegex = null,
}) {
  const lineStart = value.lastIndexOf('\n', Math.max(0, selectionStart - 1)) + 1;
  const rawLineEnd = value.indexOf('\n', selectionEnd);
  const lineEnd = rawLineEnd === -1 ? value.length : rawLineEnd;

  const before = value.slice(0, lineStart);
  const block = value.slice(lineStart, lineEnd);
  const after = value.slice(lineEnd);

  if (!block && selectionStart === selectionEnd) {
    const prefix = getPrefix(0);
    const nextValue = `${before}${prefix}${placeholder}${after}`;
    const start = before.length + prefix.length;
    return {
      nextValue,
      nextSelectionStart: start,
      nextSelectionEnd: start + placeholder.length,
    };
  }

  const lines = block.split('\n');
  const transformed = lines
    .map((line, index) => {
      const cleaned = stripRegex ? line.replace(stripRegex, '') : line;
      return `${getPrefix(index)}${cleaned}`;
    })
    .join('\n');
  const nextValue = `${before}${transformed}${after}`;

  return {
    nextValue,
    nextSelectionStart: lineStart,
    nextSelectionEnd: lineStart + transformed.length,
  };
}

function insertBlock({
  value,
  selectionStart,
  selectionEnd,
  blockText,
  selectOffsetStart = 0,
  selectLength = 0,
}) {
  const before = value.slice(0, selectionStart);
  const after = value.slice(selectionEnd);

  const needsLeadingNewline =
    before.length > 0 && !before.endsWith('\n\n')
      ? before.endsWith('\n')
        ? '\n'
        : '\n\n'
      : '';
  const needsTrailingNewline =
    after.length > 0 && !after.startsWith('\n') ? '\n' : '';

  const inserted = `${needsLeadingNewline}${blockText}${needsTrailingNewline}`;
  const nextValue = `${before}${inserted}${after}`;

  const basePos = before.length + needsLeadingNewline.length;
  const nextStart =
    selectLength > 0 ? basePos + selectOffsetStart : basePos + blockText.length;
  const nextEnd = selectLength > 0 ? nextStart + selectLength : nextStart;

  return {
    nextValue,
    nextSelectionStart: nextStart,
    nextSelectionEnd: nextEnd,
  };
}

export function applyMarkdownFormat({
  value = '',
  selectionStart = 0,
  selectionEnd = 0,
  action,
}) {
  switch (action) {
    case 'h1':
      return prefixSelectedLines({
        value,
        selectionStart,
        selectionEnd,
        getPrefix: () => '# ',
        placeholder: 'Heading 1',
        stripRegex: /^#{1,6}\s+/,
      });

    case 'h2':
      return prefixSelectedLines({
        value,
        selectionStart,
        selectionEnd,
        getPrefix: () => '## ',
        placeholder: 'Heading 2',
        stripRegex: /^#{1,6}\s+/,
      });

    case 'h3':
      return prefixSelectedLines({
        value,
        selectionStart,
        selectionEnd,
        getPrefix: () => '### ',
        placeholder: 'Heading 3',
        stripRegex: /^#{1,6}\s+/,
      });

    case 'bold':
      return wrapSelection({
        value,
        selectionStart,
        selectionEnd,
        prefix: '**',
        suffix: '**',
        placeholder: 'bold text',
      });

    case 'italic':
      return wrapSelection({
        value,
        selectionStart,
        selectionEnd,
        prefix: '*',
        suffix: '*',
        placeholder: 'italic text',
      });

    case 'strikethrough':
      return wrapSelection({
        value,
        selectionStart,
        selectionEnd,
        prefix: '~~',
        suffix: '~~',
        placeholder: 'strikethrough',
      });

    case 'inline-code':
      return wrapSelection({
        value,
        selectionStart,
        selectionEnd,
        prefix: '`',
        suffix: '`',
        placeholder: 'code',
      });

    case 'code-block': {
      const selected = value.slice(selectionStart, selectionEnd);
      if (selected) {
        const before = value.slice(0, selectionStart);
        const after = value.slice(selectionEnd);
        const prefix = before && !before.endsWith('\n') ? '\n```\n' : '```\n';
        const suffix = after && !after.startsWith('\n') ? '\n```\n' : '\n```';
        const nextValue = `${before}${prefix}${selected}${suffix}${after}`;
        const start = before.length + prefix.length;
        return {
          nextValue,
          nextSelectionStart: start,
          nextSelectionEnd: start + selected.length,
        };
      }
      return insertBlock({
        value,
        selectionStart,
        selectionEnd,
        blockText: '```\ncode here\n```',
        selectOffsetStart: 4,
        selectLength: 9,
      });
    }

    case 'unordered-list':
      return prefixSelectedLines({
        value,
        selectionStart,
        selectionEnd,
        getPrefix: () => '- ',
        placeholder: 'List item',
      });

    case 'ordered-list':
      return prefixSelectedLines({
        value,
        selectionStart,
        selectionEnd,
        getPrefix: (index) => `${index + 1}. `,
        placeholder: 'List item',
      });

    case 'task-list':
      return prefixSelectedLines({
        value,
        selectionStart,
        selectionEnd,
        getPrefix: () => '- [ ] ',
        placeholder: 'Task item',
      });

    case 'blockquote':
      return prefixSelectedLines({
        value,
        selectionStart,
        selectionEnd,
        getPrefix: () => '> ',
        placeholder: 'Quote',
      });

    case 'link': {
      const selected = value.slice(selectionStart, selectionEnd);
      const before = value.slice(0, selectionStart);
      const after = value.slice(selectionEnd);
      const defaultUrl = 'https://example.com';

      if (selected) {
        const linkText = `[${selected}](${defaultUrl})`;
        const nextValue = `${before}${linkText}${after}`;
        const urlStart = before.length + selected.length + 3;
        return {
          nextValue,
          nextSelectionStart: urlStart,
          nextSelectionEnd: urlStart + defaultUrl.length,
        };
      }

      const label = 'link text';
      const linkText = `[${label}](${defaultUrl})`;
      const nextValue = `${before}${linkText}${after}`;
      const labelStart = before.length + 1;
      return {
        nextValue,
        nextSelectionStart: labelStart,
        nextSelectionEnd: labelStart + label.length,
      };
    }

    case 'hr':
      return insertBlock({
        value,
        selectionStart,
        selectionEnd,
        blockText: '---',
      });

    case 'table':
      return insertBlock({
        value,
        selectionStart,
        selectionEnd,
        blockText: '| Column 1 | Column 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |',
        selectOffsetStart: 2,
        selectLength: 8,
      });

    default:
      return {
        nextValue: value,
        nextSelectionStart: selectionStart,
        nextSelectionEnd: selectionEnd,
      };
  }
}

