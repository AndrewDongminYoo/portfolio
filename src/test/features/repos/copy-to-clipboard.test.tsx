import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@headlessui/react', () => ({
  Transition: ({ show, children }: { show: boolean; children: React.ReactNode }) =>
    show ? <div>{children}</div> : null,
}));

import { CopyToClipboard } from '@/features/repos/copy-to-clipboard';

describe('CopyToClipboard', () => {
  it('writes to clipboard and shows copied message', async () => {
    const writeText = vi.fn();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    const { getByRole, getByText } = render(
      <CopyToClipboard value='https://example.com/repo.git'>Copy</CopyToClipboard>,
    );

    fireEvent.click(getByRole('button'));

    expect(writeText).toHaveBeenCalledWith('https://example.com/repo.git');
    expect(getByText('https://example.com/repo.git is Copied!!.')).toBeInTheDocument();
  });
});
