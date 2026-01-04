import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const pathname = { value: '/' };

vi.mock('next/navigation', () => ({
  usePathname: () => pathname.value,
}));

vi.mock('@/components/ui/navigation-menu', () => ({
  NavigationMenu: ({
    children,
    viewport: _viewport,
    ...props
  }: {
    viewport: boolean;
    children: React.ReactNode;
  }) => <nav {...props}>{children}</nav>,
  NavigationMenuList: ({ children, ...props }: { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  ),
  NavigationMenuItem: ({ children, ...props }: { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  ),
  NavigationMenuLink: ({
    href,
    children,
    ...props
  }: {
    href?: string | undefined;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  NavigationMenuTrigger: ({ children, ...props }: { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
  NavigationMenuContent: ({ children, ...props }: { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  ),
}));

vi.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({
    children,
    asChild: _asChild,
    ...props
  }: {
    asChild: boolean;
    children: React.ReactNode;
  }) => <div {...props}>{children}</div>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/hooks/use-hover', () => ({
  useCanHover: () => true,
  useLongPressTooltip: () => ({ open: false, setOpen: vi.fn(), handlers: {} }),
}));

import MenuButtons from '@/components/layout/menu';

describe('MenuButtons', () => {
  it('shows Home link when on repos page', () => {
    pathname.value = '/repos';
    const { getByText, getByRole } = render(<MenuButtons />);

    expect(getByText('Home')).toBeInTheDocument();
    const pdf = getByRole('link', { name: /PDF/ });
    expect(pdf.getAttribute('href')).toBe('/api/resume');
  });

  it('shows Repos link when on home page', () => {
    pathname.value = '/';
    const { getByText } = render(<MenuButtons />);

    expect(getByText('Repos')).toBeInTheDocument();
  });
});
