import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Period from '@/components/period';

describe('Period', () => {
  it('renders formatted dates and period by default', () => {
    const { getAllByText, getByText } = render(<Period startAt='2024-01-01' endAt='2024-01-11' />);

    expect(getAllByText('2024.01.')).toHaveLength(2);
    expect(getByText(/\(\d+일\)/)).toBeInTheDocument();
  });

  it('supports softWrap and hides duration when datesOnly', () => {
    const { queryByText } = render(
      <Period startAt='2024-01-01' endAt='2024-01-02' softWrap datesOnly={true} />,
    );

    expect(document.querySelector('br')).toBeInTheDocument();
    expect(queryByText(/\(\d+일\)/)).not.toBeInTheDocument();
  });
});
