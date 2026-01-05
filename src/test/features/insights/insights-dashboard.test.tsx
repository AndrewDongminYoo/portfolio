import { fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import InsightsDashboard from '@/features/insights/insights-dashboard';

type MockResponse = {
  ok: boolean;
  json: () => Promise<unknown>;
};

const createResponse = (data: unknown): MockResponse => ({
  ok: true,
  json: async () => data,
});

const snapshot = {
  siteUrl: 'https://example.com',
  startDate: '2024-01-01',
  endDate: '2024-01-10',
  createdAt: '2024-01-11T12:00:00.000Z',
  byQuery: {
    dimension: ['query'],
    rows: [{ keys: ['hello'], clicks: 12, impressions: 120, ctr: 0.1, position: 2.5 }],
  },
  byPage: {
    dimension: ['page'],
    rows: [
      {
        keys: ['https://example.com/blog'],
        clicks: 10,
        impressions: 100,
        ctr: 0.1,
        position: 3.5,
      },
    ],
  },
  byCountry: {
    dimension: ['country'],
    rows: [],
  },
  byDevice: {
    dimension: ['device'],
    rows: [],
  },
  byDate: {
    dimension: ['date'],
    rows: [
      { keys: ['2024-01-01'], clicks: 5, impressions: 50, ctr: 0.1, position: 1 },
      { keys: ['2024-01-02'], clicks: 10, impressions: 100, ctr: 0.1, position: 2 },
    ],
  },
};

let fetchMock: ReturnType<typeof vi.fn>;

describe('InsightsDashboard', () => {
  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('shows a status message when fetching without a token', () => {
    const { getByRole, getByText } = render(<InsightsDashboard />);

    fireEvent.click(getByRole('button', { name: '데이터 불러오기' }));

    expect(getByText('토큰을 먼저 입력해주세요.')).toBeInTheDocument();
  });

  it('saves token and renders snapshot data', async () => {
    fetchMock.mockResolvedValueOnce(createResponse({ ok: true, data: snapshot }));

    const { getByPlaceholderText, getByRole, findAllByText, findByText } = render(
      <InsightsDashboard />,
    );

    fireEvent.change(getByPlaceholderText('INSIGHTS_ACCESS_TOKEN'), {
      target: { value: 'secret-token' },
    });
    fireEvent.click(getByRole('button', { name: '토큰 저장' }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    expect(window.localStorage.getItem('insights-token')).toBe('secret-token');

    expect(await findByText('2024-01-01 ~ 2024-01-10')).toBeInTheDocument();
    expect(await findByText('Top Pages')).toBeInTheDocument();
    expect(await findByText('/blog')).toBeInTheDocument();
    expect(await findAllByText('10.0%')).toHaveLength(2);
    expect(await findByText('검색 유입 추세 (최근 14일)')).toBeInTheDocument();
  });

  it('renders API error message when response is not ok', async () => {
    window.localStorage.setItem('insights-token', 'saved-token');
    fetchMock.mockResolvedValueOnce(createResponse({ ok: false, error: 'error message' }));

    const { getByRole, findByText, getByDisplayValue } = render(<InsightsDashboard />);

    await waitFor(() => {
      expect(getByDisplayValue('saved-token')).toBeInTheDocument();
    });

    fireEvent.click(getByRole('button', { name: '데이터 불러오기' }));

    expect(await findByText('error message')).toBeInTheDocument();
  });

  it('shows validation and clear messages for token actions', async () => {
    fetchMock.mockResolvedValueOnce(createResponse({ ok: true, data: snapshot }));
    const { getByRole, getByText, getByPlaceholderText, queryByDisplayValue } = render(
      <InsightsDashboard />,
    );

    fireEvent.click(getByRole('button', { name: '토큰 저장' }));
    expect(getByText('유효한 토큰을 입력해주세요.')).toBeInTheDocument();

    fireEvent.change(getByPlaceholderText('INSIGHTS_ACCESS_TOKEN'), {
      target: { value: 'to-clear' },
    });
    fireEvent.click(getByRole('button', { name: '토큰 저장' }));

    await waitFor(() => {
      expect(window.localStorage.getItem('insights-token')).toBe('to-clear');
    });

    fireEvent.click(getByRole('button', { name: '토큰 삭제' }));
    expect(window.localStorage.getItem('insights-token')).toBeNull();
    expect(getByText('토큰이 제거되었습니다.')).toBeInTheDocument();
    expect(queryByDisplayValue('to-clear')).not.toBeInTheDocument();
  });

  it('handles refresh flow and reports failures', async () => {
    window.localStorage.setItem('insights-token', 'saved-token');
    fetchMock
      .mockResolvedValueOnce(createResponse({ ok: true, data: snapshot }))
      .mockRejectedValueOnce(new Error('network down'));

    const { getByRole, findByText, getByDisplayValue } = render(<InsightsDashboard />);

    await waitFor(() => {
      expect(getByDisplayValue('saved-token')).toBeInTheDocument();
    });

    fireEvent.click(getByRole('button', { name: 'Search Console 새로고침' }));

    expect(await findByText('업데이트가 완료되었습니다.')).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: '데이터 불러오기' }));

    expect(
      await findByText('데이터를 불러오는 중 오류가 발생했습니다. Error: network down'),
    ).toBeInTheDocument();
  });
});
