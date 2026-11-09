import { describe, it, expect } from 'vitest';
import { applyMarkdownFormat } from './markdownFormatting';

describe('markdownFormatting', () => {
  it('wraps selected text with bold, italic, strikethrough, and inline code, and toggles off', () => {
    const boldRes = applyMarkdownFormat({
      value: 'Hello world',
      selectionStart: 6,
      selectionEnd: 11,
      action: 'bold',
    });
    expect(boldRes.nextValue).toBe('Hello **world**');

    // Toggle off when already wrapped
    const unwrapRes = applyMarkdownFormat({
      value: boldRes.nextValue,
      selectionStart: boldRes.nextSelectionStart,
      selectionEnd: boldRes.nextSelectionEnd,
      action: 'bold',
    });
    expect(unwrapRes.nextValue).toBe('Hello world');

    expect(
      applyMarkdownFormat({
        value: 'Hello world',
        selectionStart: 0,
        selectionEnd: 5,
        action: 'italic',
      }).nextValue
    ).toBe('*Hello* world');

    expect(
      applyMarkdownFormat({
        value: 'Hello',
        selectionStart: 0,
        selectionEnd: 5,
        action: 'strikethrough',
      }).nextValue
    ).toBe('~~Hello~~');

    expect(
      applyMarkdownFormat({
        value: 'const x = 1',
        selectionStart: 0,
        selectionEnd: 11,
        action: 'inline-code',
      }).nextValue
    ).toBe('`const x = 1`');
  });

  it('inserts placeholders when selection is empty', () => {
    const res = applyMarkdownFormat({
      value: '',
      selectionStart: 0,
      selectionEnd: 0,
      action: 'bold',
    });
    expect(res.nextValue).toBe('**bold text**');
    expect(res.nextSelectionStart).toBe(2);
    expect(res.nextSelectionEnd).toBe(11);
  });

  it('applies and replaces headings H1, H2, H3 on the current line', () => {
    const h1 = applyMarkdownFormat({
      value: 'Title line',
      selectionStart: 0,
      selectionEnd: 5,
      action: 'h1',
    });
    expect(h1.nextValue).toBe('# Title line');

    const h2 = applyMarkdownFormat({
      value: h1.nextValue,
      selectionStart: 2,
      selectionEnd: 2,
      action: 'h2',
    });
    expect(h2.nextValue).toBe('## Title line');

    const h3 = applyMarkdownFormat({
      value: h2.nextValue,
      selectionStart: 3,
      selectionEnd: 3,
      action: 'h3',
    });
    expect(h3.nextValue).toBe('### Title line');
  });

  it('formats unordered, ordered, task lists, and blockquotes across multiple lines', () => {
    const multi = 'One\nTwo';
    expect(
      applyMarkdownFormat({
        value: multi,
        selectionStart: 0,
        selectionEnd: multi.length,
        action: 'unordered-list',
      }).nextValue
    ).toBe('- One\n- Two');

    expect(
      applyMarkdownFormat({
        value: multi,
        selectionStart: 0,
        selectionEnd: multi.length,
        action: 'ordered-list',
      }).nextValue
    ).toBe('1. One\n2. Two');

    expect(
      applyMarkdownFormat({
        value: multi,
        selectionStart: 0,
        selectionEnd: multi.length,
        action: 'task-list',
      }).nextValue
    ).toBe('- [ ] One\n- [ ] Two');

    expect(
      applyMarkdownFormat({
        value: 'Quote line',
        selectionStart: 0,
        selectionEnd: 10,
        action: 'blockquote',
      }).nextValue
    ).toBe('> Quote line');
  });

  it('inserts links, code blocks, horizontal rules, and tables', () => {
    expect(
      applyMarkdownFormat({
        value: 'Docs',
        selectionStart: 0,
        selectionEnd: 4,
        action: 'link',
      }).nextValue
    ).toBe('[Docs](https://example.com)');

    expect(
      applyMarkdownFormat({
        value: 'let a = 1;',
        selectionStart: 0,
        selectionEnd: 10,
        action: 'code-block',
      }).nextValue
    ).toBe('```\nlet a = 1;\n```');

    expect(
      applyMarkdownFormat({
        value: 'Above',
        selectionStart: 5,
        selectionEnd: 5,
        action: 'hr',
      }).nextValue
    ).toBe('Above\n\n---');

    expect(
      applyMarkdownFormat({
        value: '',
        selectionStart: 0,
        selectionEnd: 0,
        action: 'table',
      }).nextValue
    ).toContain('| Column 1 | Column 2 |');
  });
});

