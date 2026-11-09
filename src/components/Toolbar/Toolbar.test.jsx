import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toolbar from './Toolbar';

describe('Toolbar', () => {
  it('renders all Markdown formatting buttons and triggers onFormat with action keys', async () => {
    const user = userEvent.setup();
    const onFormat = vi.fn();

    render(<Toolbar onFormat={onFormat} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(15);

    await user.click(screen.getByRole('button', { name: 'Heading 1' }));
    await user.click(screen.getByRole('button', { name: 'Bold (Ctrl+B)' }));
    await user.click(screen.getByRole('button', { name: 'Insert Table' }));
    await user.click(screen.getByRole('button', { name: 'Task List' }));

    expect(onFormat).toHaveBeenNthCalledWith(1, 'h1');
    expect(onFormat).toHaveBeenNthCalledWith(2, 'bold');
    expect(onFormat).toHaveBeenNthCalledWith(3, 'table');
    expect(onFormat).toHaveBeenNthCalledWith(4, 'task-list');
  });
});

