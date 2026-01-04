import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Description from '@/features/posts/description';

describe('Description', () => {
  it('renders list when description is an array', () => {
    const { getByText, container } = render(
      <Description resume={{ description: ['첫 번째', '두 번째'] }} />,
    );

    expect(getByText('첫 번째')).toBeInTheDocument();
    expect(container.querySelectorAll('li')).toHaveLength(2);
  });

  it('renders list when description has multiple lines', () => {
    const { container } = render(<Description resume={{ description: 'a\nb\nc' }} />);

    expect(container.querySelectorAll('li')).toHaveLength(3);
  });

  it('renders paragraph for short description', () => {
    const { container, getByText } = render(<Description resume={{ description: '짧은 설명' }} />);

    expect(container.querySelector('p')).toBeInTheDocument();
    expect(getByText('짧은 설명')).toBeInTheDocument();
  });
});
