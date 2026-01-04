import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Period from '@/components/period';

describe('Period', () => {
  it('renders formatted dates and period by default', () => {
    const { getByText } = render(<Period startAt='2024-01-01' endAt='2024-01-11' />);

    expect(getByText('2024.01')).toBeInTheDocument();
    expect(getByText('2024.01.')).toBeInTheDocument();
    expect(getByText(/\(\d+일\)/)).toBeInTheDocument();
  });

  it('supports softWrap and hides duration when datesOnly', () => {
    const { queryByText } = render(
      <Period startAt='2024-01-01' endAt='2024-01-02' softWrap datesOnly={true} />,
    );

    expect(document.querySelector('br')).toBeInTheDocument();
    expect(queryByText(/\(\d+일\)/)).not.toBeInTheDocument();
  });

  it('renders a single date when start and end are the same day', () => {
    const { container, getByText, queryByText } = render(
      <Period startAt='2024-01-01' endAt='2024-01-01' />,
    );

    const times = container.querySelectorAll('time');
    expect(times).toHaveLength(1);
    expect(getByText('2024.01.01')).toBeInTheDocument();
    expect(container.textContent).not.toContain('~');
    expect(queryByText(/\(/)).not.toBeInTheDocument();
  });

  it('normalizes reversed date ranges', () => {
    const { container, getByText } = render(<Period startAt='2024-02-01' endAt='2024-01-01' />);

    const times = container.querySelectorAll('time');
    expect(times).toHaveLength(2);
    expect(times[0]).toHaveTextContent('2024.01');
    expect(times[1]).toHaveTextContent('2024.02.');
    expect(getByText(/\(\d+개월\)/)).toBeInTheDocument();
  });
});
