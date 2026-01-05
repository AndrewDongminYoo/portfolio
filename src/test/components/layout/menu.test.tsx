import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const pathname = { value: '/' };
const canHoverState = { value: true };
const longPressState = { open: false };
let lastTooltipProps: { open?: boolean; onOpenChange?: ((value: boolean) => void) | undefined } =
  {};

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
  Tooltip: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (value: boolean) => void;
  }) => {
    lastTooltipProps = { open, onOpenChange };
    return <div data-open={open}>{children}</div>;
  },
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
  useCanHover: () => canHoverState.value,
  useLongPressTooltip: () => ({ open: longPressState.open, setOpen: vi.fn(), handlers: {} }),
}));

import MenuButtons from '@/components/layout/menu';

describe('MenuButtons', () => {
  it('shows Home link when on repos page', () => {
    pathname.value = '/repos';
    canHoverState.value = true;
    longPressState.open = false;
    const { getByText, getByRole } = render(<MenuButtons />);

    expect(getByText('Home')).toBeInTheDocument();
    const pdf = getByRole('link', { name: /PDF/ });
    expect(pdf.getAttribute('href')).toBe('/api/resume');
  });

  it('shows Repos link when on home page', () => {
    pathname.value = '/';
    canHoverState.value = true;
    longPressState.open = false;
    const { getByText } = render(<MenuButtons />);

    expect(getByText('Repos')).toBeInTheDocument();
  });

  it('passes tooltip control props when hover is disabled', () => {
    pathname.value = '/';
    canHoverState.value = false;
    longPressState.open = true;

    render(<MenuButtons />);

    expect(lastTooltipProps.open).toBe(true);
    expect(typeof lastTooltipProps.onOpenChange).toBe('function');
  });
});
