/// <reference types="@testing-library/jest-dom" />

import { render, screen } from '@testing-library/react';
import ReactGithubCalendar from 'components/calendar';
import { ScriptProps } from 'next/script';
import { username } from '@/constants/';
const externalLib = 'https://unpkg.com/github-calendar@latest/dist/github-calendar.min.js';

jest.mock('next/script', () => {
  return ({ src, onReady }: ScriptProps) => {
    expect(src).toBe(externalLib);
    if (onReady !== undefined) {
      onReady();
    }
    return null;
  };
});

describe('ReactGithubCalendar', () => {
  it('should defined', () => {
    expect(ReactGithubCalendar).toBeDefined();
  });

  it('renders the calendar', () => {
    const { baseElement } = render(<ReactGithubCalendar />);
    expect(baseElement).toMatchSnapshot();
    const calendar = screen.queryByRole('generic', { name: /github-calendar/i });
    expect(calendar).toBeInTheDocument();
  });

  it('calls the GitHubCalendar function', () => {
    const GitHubCalendar = jest.fn();
    const { baseElement } = render(<ReactGithubCalendar />);
    expect(baseElement).toMatchSnapshot();
    expect(GitHubCalendar).toHaveBeenCalledWith('.calendar', username, {
      responsive: true,
      global_stats: true,
      tooltips: true,
      cache: 24 * 60 * 60 * 1000,
    });
  });
});
