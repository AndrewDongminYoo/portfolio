import { act, render, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ReactGithubCalendar from '@/components/calendar';
import { username } from '@/lib/constants';

type GitHubCalendarProps = {
  username: string;
  tooltips: {
    activity: {
      text: (activity: { date: string; count: number }) => string;
    };
  };
};

type MockResponse = {
  ok: boolean;
  json: () => Promise<unknown>;
};

const createResponse = (data: unknown, ok = true): MockResponse => ({
  ok,
  json: async () => data,
});

const baseRepo = {
  nameWithOwner: 'owner/repo',
  url: 'https://example.com/repo',
  owner: {
    login: 'owner',
    avatarUrl: 'https://example.com/avatar.png',
    url: 'https://github.com/owner',
  },
  language: 'TypeScript',
  stars: 1,
  forks: 1,
  watchers: 1,
  total: 3,
  breakdown: {
    commits: 2,
    issues: 1,
    pullRequests: 0,
    reviews: 0,
  },
};

type RepoOverrides = Partial<Omit<typeof baseRepo, 'owner' | 'breakdown'>> & {
  owner?: Partial<typeof baseRepo.owner>;
  breakdown?: Partial<typeof baseRepo.breakdown>;
};

const makeRepo = (overrides: RepoOverrides) => ({
  ...baseRepo,
  ...overrides,
  owner: { ...baseRepo.owner, ...overrides.owner },
  breakdown: { ...baseRepo.breakdown, ...overrides.breakdown },
});

const summary = {
  range: { from: '2024-01-01', to: '2024-12-31' },
  totals: { commits: 10, issues: 2, pullRequests: 3, reviews: 1, total: 16 },
  repos: [
    makeRepo({
      nameWithOwner: `${username}/portfolio`,
      owner: { login: username },
      stars: 4,
      watchers: 2,
      forks: 1,
      total: 8,
      breakdown: { commits: 3, issues: 0, pullRequests: 1, reviews: 0 },
    }),
    makeRepo({ nameWithOwner: 'owner/repo-2', stars: 6, watchers: 0, forks: 0, total: 6 }),
    makeRepo({ nameWithOwner: 'owner/repo-3', stars: 5, watchers: 0, forks: 0, total: 5 }),
    makeRepo({ nameWithOwner: 'owner/repo-4', stars: 4, watchers: 0, forks: 0, total: 4 }),
    makeRepo({ nameWithOwner: 'owner/repo-5', stars: 3, watchers: 0, forks: 0, total: 3 }),
    makeRepo({ nameWithOwner: 'owner/repo-6', stars: 2, watchers: 0, forks: 0, total: 2 }),
    makeRepo({ nameWithOwner: 'owner/repo-7', stars: 1, watchers: 0, forks: 0, total: 1 }),
  ],
  externalRepos: [
    makeRepo({
      nameWithOwner: 'external/awesome',
      url: 'https://github.com/external/awesome',
      owner: {
        login: 'external',
        avatarUrl: 'https://example.com/external.png',
        url: 'https://github.com/external',
      },
      breakdown: { commits: 2, issues: 1, pullRequests: 1, reviews: 0 },
    }),
  ],
  externalOwners: [
    {
      login: 'external-owner',
      avatarUrl: 'https://example.com/owner.png',
      url: 'https://github.com/external-owner',
    },
  ],
};

let calendarProps: GitHubCalendarProps | null = null;
let fetchMock: ReturnType<typeof vi.fn>;
const matchMediaState = { matches: false, listeners: new Set<() => void>() };
const simpleIconState = { useMask: false };

const installDomMocks = () => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return matchMediaState.matches;
    },
    media: query,
    onchange: null,
    addEventListener: (_: string, cb: () => void) => matchMediaState.listeners.add(cb),
    removeEventListener: (_: string, cb: () => void) => matchMediaState.listeners.delete(cb),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  class MockResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }

  class MockMutationObserver {
    constructor(_callback: MutationCallback) {}
    observe = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => [] as MutationRecord[]);
  }

  vi.stubGlobal('ResizeObserver', MockResizeObserver);
  vi.stubGlobal('MutationObserver', MockMutationObserver);
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0);
    return 0;
  });
  vi.stubGlobal('cancelAnimationFrame', (_handle: number) => {});
};

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
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

vi.mock('react-github-calendar', () => ({
  GitHubCalendar: (props: GitHubCalendarProps) => {
    calendarProps = props;
    return (
      <div data-testid='github-calendar' className='react-activity-calendar__scroll-container'>
        <svg className='react-activity-calendar__calendar' />
      </div>
    );
  },
}));

vi.mock('@/features/repos/simple-icons', () => ({
  getSimpleIcon: vi.fn(() =>
    simpleIconState.useMask
      ? { color: '#112233', url: 'https://example.com/icon.svg' }
      : { color: '#112233', url: '' },
  ),
}));

describe('ReactGithubCalendar', () => {
  beforeEach(() => {
    calendarProps = null;
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    matchMediaState.matches = false;
    matchMediaState.listeners.clear();
    simpleIconState.useMask = false;
    installDomMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('renders loading state while fetching', async () => {
    let resolveFetch: (value: MockResponse) => void = () => {};
    const fetchPromise = new Promise<MockResponse>((resolve) => {
      resolveFetch = resolve;
    });

    fetchMock.mockReturnValueOnce(fetchPromise);

    const { getByText, queryByText } = render(<ReactGithubCalendar />);

    expect(getByText('기여 데이터를 불러오는 중입니다.')).toBeInTheDocument();

    resolveFetch(createResponse(summary));

    await waitFor(() => {
      expect(queryByText('기여 데이터를 불러오는 중입니다.')).not.toBeInTheDocument();
    });
  });

  it('passes formatted tooltips to GitHubCalendar', () => {
    fetchMock.mockResolvedValueOnce(createResponse(summary));

    const { getByTestId } = render(<ReactGithubCalendar />);

    expect(getByTestId('github-calendar')).toBeInTheDocument();
    const props = calendarProps;
    expect(props?.username).toBe(username);

    const zeroText = props?.tooltips.activity.text({ date: '2024-01-02', count: 0 });
    const countText = props?.tooltips.activity.text({ date: '2024-01-02', count: 12 });

    expect(zeroText).toBe('2024.01.02 - 기여 없음');
    expect(countText).toBe('2024.01.02 - 12회 기여');
  });

  it('renders summary, external contributions, and ranked repo list', async () => {
    fetchMock.mockResolvedValueOnce(createResponse(summary));

    const { findByText, getByText, queryByText, getByRole } = render(<ReactGithubCalendar />);

    expect(await findByText('총 16회')).toBeInTheDocument();
    expect(getByText('2024.01.01 ~ 2024.12.31')).toBeInTheDocument();

    expect(getByText(/커밋 10회/)).toBeInTheDocument();
    expect(getByText(/PR 3회/)).toBeInTheDocument();
    expect(getByText(/리뷰 1회/)).toBeInTheDocument();
    expect(getByText(/이슈 2회/)).toBeInTheDocument();

    expect(getByText('@external-owner')).toBeInTheDocument();
    const externalRepoLink = getByRole('link', { name: /external\/awesome/ });
    expect(externalRepoLink).toHaveStyle('box-shadow: inset -3px 0 0 0 rgba(17, 34, 51, 0.5)');
    expect(getByText('커밋 2회')).toBeInTheDocument();

    expect(getByText('portfolio')).toBeInTheDocument();
    expect(queryByText(`${username}/portfolio`)).not.toBeInTheDocument();

    expect(queryByText('owner/repo-7')).not.toBeInTheDocument();
  });

  it('renders error message when API returns error', async () => {
    fetchMock.mockResolvedValueOnce(createResponse({ error: '토큰이 만료되었습니다.' }, true));

    const { findByText, queryByText } = render(<ReactGithubCalendar />);

    expect(
      await findByText('프로젝트별 기여 요약을 표시할 수 없습니다. 토큰이 만료되었습니다.'),
    ).toBeInTheDocument();
    expect(queryByText('외부 컨트리뷰션')).not.toBeInTheDocument();
  });

  it('applies calendar layout changes and scrolls to latest', async () => {
    const originalScrollWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'scrollWidth',
    );
    const originalClientWidth = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      'clientWidth',
    );

    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get() {
        return 200;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() {
        return 100;
      },
    });

    try {
      fetchMock.mockResolvedValueOnce(createResponse(summary));

      const { getByTestId, findByText } = render(<ReactGithubCalendar />);

      await findByText('총 16회');

      const scrollContainer = getByTestId('github-calendar');
      const calendarSvg = scrollContainer.querySelector(
        '.react-activity-calendar__calendar',
      ) as SVGSVGElement | null;

      expect(calendarSvg).not.toBeNull();

      act(() => {
        matchMediaState.matches = true;
        matchMediaState.listeners.forEach((cb) => cb());
      });

      expect(calendarSvg?.style.width).toBe('auto');

      act(() => {
        matchMediaState.matches = false;
        matchMediaState.listeners.forEach((cb) => cb());
      });

      expect(calendarSvg?.style.width).toBe('');
      expect(scrollContainer.scrollLeft).toBeGreaterThan(0);
    } finally {
      if (originalScrollWidth) {
        Object.defineProperty(HTMLElement.prototype, 'scrollWidth', originalScrollWidth);
      } else {
        delete (HTMLElement.prototype as unknown as { scrollWidth?: number }).scrollWidth;
      }
      if (originalClientWidth) {
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
      } else {
        delete (HTMLElement.prototype as unknown as { clientWidth?: number }).clientWidth;
      }
    }
  });

  it('renders masked repo icon when url is available', async () => {
    simpleIconState.useMask = true;
    fetchMock.mockResolvedValueOnce(createResponse(summary));

    const { findByText } = render(<ReactGithubCalendar />);

    const repoName = await findByText('portfolio');
    const card = repoName.closest('a');
    const icon = card?.querySelector('span[style]');

    expect(icon?.getAttribute('style')).toContain('mask-image');
  });

  it('renders error message when fetch fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network'));

    const { findByText } = render(<ReactGithubCalendar />);

    expect(
      await findByText(
        '프로젝트별 기여 요약을 표시할 수 없습니다. GitHub 기여 데이터를 불러오지 못했습니다.',
      ),
    ).toBeInTheDocument();
  });
});
