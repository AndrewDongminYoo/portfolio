import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...rest }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...rest} />
  ),
}));

import ActivityElement from '@/features/posts/activity';
import { Activity } from '@/interface/profile';

const activity: Activity = {
  id: 'activity_demo',
  type: 'activity',
  index: 0,
  title: '활동',
  subtitle: '부제목',
  name: '활동',
  startAt: '2024-01-01',
  endAt: '2024-02-01',
  description: '설명',
  posting_url: 'https://dongminyu.medium.com/',
  website_url: 'https://example.com',
};

describe('ActivityElement', () => {
  it('renders title and website link', () => {
    const { getByText } = render(<ActivityElement activity={activity} />);

    expect(getByText(activity.title)).toBeInTheDocument();
    // If activity.posting_url is not empty, activity.subtitle is displayed wrapped in an a tag.
    expect(getByText(activity.subtitle)).toBeInTheDocument();
  });

  it('renders fallback end date and post link when optional fields are missing', () => {
    const activityWithoutDates: Activity = {
      ...activity,
      id: 'activity_fallback',
      startAt: '2024-03-01',
      endAt: null,
      posting_url: undefined,
      website_url: 'https://example.com/fallback',
      icon: '/icons/activity.png',
    };

    const { getByText, getByRole, queryByText, getByAltText } = render(
      <ActivityElement activity={activityWithoutDates} />,
    );

    expect(getByText('진행중')).toBeInTheDocument();
    expect(queryByText(activity.subtitle)).not.toBeInTheDocument();
    expect(getByRole('link', { name: /활동/ })).toHaveAttribute(
      'href',
      activityWithoutDates.website_url,
    );
    expect(getByAltText(`${activity.name} logo`)).toBeInTheDocument();
  });
});
