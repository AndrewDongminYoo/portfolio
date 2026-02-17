'use client';

import { useEffect, useMemo, useState } from 'react';

import type {
  InsightsApiResponse,
  SearchConsoleDataset,
  SearchConsoleRow,
  SearchConsoleSnapshot,
} from '@/interface/insights';

const STORAGE_KEY = 'insights-token';
const DEFAULT_ROWS = 10;

const numberFormatter = new Intl.NumberFormat('en-US');

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatPosition(value: number) {
  if (!Number.isFinite(value)) return '-';
  return value.toFixed(1);
}

function formatPageLabel(value: string) {
  try {
    const url = new URL(value);
    return url.pathname || value;
  } catch {
    return value;
  }
}

function getRowLabel(dimension: SearchConsoleDataset['dimension'][number], row: SearchConsoleRow) {
  const key = row.keys[0] ?? '-';
  if (dimension === 'page') return formatPageLabel(key);
  return key;
}

function TableSection({
  title,
  dimension,
  rows,
}: {
  title: string;
  dimension: SearchConsoleDataset['dimension'][number];
  rows: SearchConsoleRow[];
}) {
  const sliced = rows.slice(0, DEFAULT_ROWS);

  return (
    <section className='resume_card'>
      <header className='resume_card_header'>
        <div className='resume_card_left'>
          <h3 className='resume_card_header_title'>{title}</h3>
        </div>
      </header>
      <div className='mt-4 resume_card_body overflow-x-auto'>
        {sliced.length === 0 ? (
          <p className='text-sm text-slate-500'>데이터가 없습니다.</p>
        ) : (
          <table className='w-full border-collapse text-sm'>
            <thead>
              <tr className='border-b border-slate-200 text-left text-xs text-slate-500 uppercase'>
                <th className='py-2 pr-4 font-semibold'>{dimension}</th>
                <th className='py-2 pr-4 font-semibold'>Clicks</th>
                <th className='py-2 pr-4 font-semibold'>Impr.</th>
                <th className='py-2 pr-4 font-semibold'>CTR</th>
                <th className='py-2 pr-2 font-semibold'>Pos.</th>
              </tr>
            </thead>
            <tbody>
              {sliced.map((row, index) => (
                <tr key={`${dimension}-${row.keys[0] ?? 'row'}-${index}`} className='border-b'>
                  <td className='py-2 pr-4'>{getRowLabel(dimension, row)}</td>
                  <td className='py-2 pr-4'>{formatNumber(row.clicks)}</td>
                  <td className='py-2 pr-4'>{formatNumber(row.impressions)}</td>
                  <td className='py-2 pr-4'>{formatPercent(row.ctr)}</td>
                  <td className='py-2 pr-2'>{formatPosition(row.position)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

function TrendSection({ rows }: { rows: SearchConsoleRow[] }) {
  const filtered = rows.slice(-14);
  const maxClicks = Math.max(...filtered.map((row) => row.clicks), 0);

  return (
    <section className='resume_card'>
      <header className='resume_card_header'>
        <div className='resume_card_left'>
          <h3 className='resume_card_header_title'>검색 유입 추세 (최근 14일)</h3>
        </div>
      </header>
      <div className='mt-4 resume_card_body space-y-2'>
        {filtered.length === 0 ? (
          <p className='text-sm text-slate-500'>데이터가 없습니다.</p>
        ) : (
          filtered.map((row) => {
            const date = row.keys[0] ?? '-';
            const width = maxClicks === 0 ? 0 : Math.round((row.clicks / maxClicks) * 100);
            return (
              <div key={`trend-${date}`} className='flex items-center gap-3 text-xs'>
                <span className='w-20 text-slate-500'>{date}</span>
                <div className='h-2 flex-1 rounded-full bg-slate-200'>
                  <div className='h-2 rounded-full bg-blue-500' style={{ width: `${width}%` }} />
                </div>
                <span className='w-10 text-right text-slate-600'>{formatNumber(row.clicks)}</span>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default function InsightsDashboard() {
  const [tokenInput, setTokenInput] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<SearchConsoleSnapshot | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setToken(saved);
      setTokenInput(saved);
    }
  }, []);

  const summary = useMemo(() => {
    if (!snapshot) return null;
    return {
      range: `${snapshot.startDate} ~ ${snapshot.endDate}`,
      updatedAt: new Date(snapshot.createdAt).toLocaleString(),
    };
  }, [snapshot]);

  const fetchSnapshot = async (overrideToken?: string) => {
    const authToken = overrideToken ?? token ?? '';
    if (!authToken) {
      setStatus('토큰을 먼저 입력해주세요.');
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/insights', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        cache: 'no-store',
      });
      const data = (await response.json()) as InsightsApiResponse;
      if (!data.ok) {
        setSnapshot(null);
        setStatus(data.error);
        return;
      }
      setSnapshot(data.data);
      setStatus(null);
    } catch (error) {
      setStatus(`데이터를 불러오는 중 오류가 발생했습니다. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshSnapshot = async () => {
    const authToken = token ?? '';
    if (!authToken) {
      setStatus('토큰을 먼저 입력해주세요.');
      return;
    }

    setLoading(true);
    setStatus('Search Console 데이터를 업데이트 중입니다...');

    try {
      const response = await fetch('/api/insights/refresh', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        cache: 'no-store',
      });
      const data = (await response.json()) as InsightsApiResponse;
      if (!data.ok) {
        setSnapshot(null);
        setStatus(data.error);
        return;
      }
      setSnapshot(data.data);
      setStatus('업데이트가 완료되었습니다.');
    } catch (error) {
      setStatus(`업데이트 요청에 실패했습니다. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToken = () => {
    const trimmed = tokenInput.trim();
    if (!trimmed) {
      setStatus('유효한 토큰을 입력해주세요.');
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, trimmed);
    setToken(trimmed);
    setStatus('토큰이 저장되었습니다.');
    void fetchSnapshot(trimmed);
  };

  const handleClearToken = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setTokenInput('');
    setSnapshot(null);
    setStatus('토큰이 제거되었습니다.');
  };

  return (
    <div className='mx-auto max-w-[55rem] px-4 py-10 md:px-10'>
      <header className='mb-6 space-y-2'>
        <p className='text-xs tracking-widest text-slate-500 uppercase'>Internal Insights</p>
        <h1 className='text-2xl font-semibold text-slate-900'>Search Console Insights</h1>
        <p className='text-sm text-slate-600'>
          검색 유입을 중심으로 한 간단한 관리자 대시보드입니다. 데이터는 Search Console API에서
          집계되며 최대 2~3일 지연될 수 있습니다.
        </p>
      </header>

      <section className='resume_card'>
        <header className='resume_card_header'>
          <div className='resume_card_left'>
            <h3 className='resume_card_header_title'>접근 토큰</h3>
          </div>
          <div className='resume_card_right justify-end gap-2'>
            <button
              type='button'
              onClick={handleSaveToken}
              className='rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100'>
              토큰 저장
            </button>
            <button
              type='button'
              onClick={handleClearToken}
              className='rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100'>
              토큰 삭제
            </button>
          </div>
        </header>
        <div className='mt-4 resume_card_body'>
          <div className='flex flex-col gap-3 md:flex-row md:items-center'>
            <input
              type='password'
              value={tokenInput}
              onChange={(event) => setTokenInput(event.target.value)}
              placeholder='INSIGHTS_ACCESS_TOKEN'
              className='w-full flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none'
            />
            <button
              type='button'
              onClick={() => fetchSnapshot()}
              className='rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100'
              disabled={loading}>
              데이터 불러오기
            </button>
            <button
              type='button'
              onClick={refreshSnapshot}
              className='rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100'
              disabled={loading}>
              Search Console 새로고침
            </button>
          </div>
        </div>
      </section>

      {status && (
        <div className='mt-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600'>
          {status}
        </div>
      )}

      {summary && (
        <section className='mt-6 grid gap-4 md:grid-cols-2'>
          <div className='rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm'>
            <p className='text-xs text-slate-400 uppercase'>Date Range</p>
            <p className='mt-1 font-medium text-slate-700'>{summary.range}</p>
          </div>
          <div className='rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm'>
            <p className='text-xs text-slate-400 uppercase'>Last Updated</p>
            <p className='mt-1 font-medium text-slate-700'>{summary.updatedAt}</p>
          </div>
        </section>
      )}

      {snapshot && (
        <div className='mt-6 grid gap-6'>
          <TrendSection rows={snapshot.byDate.rows} />
          <div className='grid gap-6 lg:grid-cols-2'>
            <TableSection title='Top Queries' dimension='query' rows={snapshot.byQuery.rows} />
            <TableSection title='Top Pages' dimension='page' rows={snapshot.byPage.rows} />
            <TableSection
              title='Top Countries'
              dimension='country'
              rows={snapshot.byCountry.rows}
            />
            <TableSection title='Top Devices' dimension='device' rows={snapshot.byDevice.rows} />
          </div>
        </div>
      )}
    </div>
  );
}
