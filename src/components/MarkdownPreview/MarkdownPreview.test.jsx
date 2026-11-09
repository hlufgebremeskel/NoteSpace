import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MarkdownPreview from './MarkdownPreview';

describe('MarkdownPreview', () => {
  it('displays an empty preview state when content is blank', () => {
    render(<MarkdownPreview content="   " />);
    expect(screen.getByRole('status')).toHaveTextContent(/nothing to preview yet/i);
  });

  it('renders GitHub Flavored Markdown elements accurately', () => {
    const markdown = `
# Main Heading
## Subheading

Paragraph with **bold**, *italic*, ~~deleted~~, and \`inlineCode\`.

- Bullet item
1. Numbered item

- [x] Completed task
- [ ] Pending task

> Helpful quote

\`\`\`js
const x = 42;
\`\`\`

| Name | Role |
| --- | --- |
| NoteSpace | Editor |

---

[OpenAI](https://openai.com)
`;

    render(<MarkdownPreview content={markdown} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Main Heading' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Subheading' })).toBeInTheDocument();
    expect(screen.getByText('bold').tagName).toBe('STRONG');
    expect(screen.getByText('italic').tagName).toBe('EM');
    expect(screen.getByText('deleted').tagName).toBe('DEL');
    expect(screen.getByText('inlineCode').tagName).toBe('CODE');
    expect(screen.getByText('Bullet item')).toBeInTheDocument();
    expect(screen.getByText('Numbered item')).toBeInTheDocument();
    expect(screen.getByText('Helpful quote')).toBeInTheDocument();
    expect(screen.getByText('const x = 42;')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'NoteSpace' })).toBeInTheDocument();

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();

    const link = screen.getByRole('link', { name: 'OpenAI' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not execute raw HTML or unsafe javascript links', () => {
    const unsafeMd = '<script>window.__xss = true;</script>\n\n[Click](javascript:alert(1))';
    const { container } = render(<MarkdownPreview content={unsafeMd} />);

    expect(container.querySelector('script')).toBeNull();
    expect(screen.queryByRole('link', { name: 'Click' })).not.toBeInTheDocument();
  });
});

