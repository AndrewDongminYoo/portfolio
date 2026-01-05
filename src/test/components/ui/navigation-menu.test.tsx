import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@radix-ui/react-navigation-menu', () => {
  const create = (tag: string) =>
    React.forwardRef(({ children, ...props }: { children: React.ReactNode }, ref) =>
      React.createElement(tag, { ref, ...props }, children),
    );

  return {
    Root: create('nav'),
    List: create('ul'),
    Item: create('li'),
    Trigger: create('button'),
    Content: create('div'),
    Link: create('a'),
    Viewport: create('div'),
    Indicator: create('div'),
  };
});

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

describe('NavigationMenu', () => {
  it('renders slots and respects viewport flag', () => {
    const { container, getByText } = render(
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>More</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href='#'>Item</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );

    expect(getByText('More')).toBeInTheDocument();
    expect(getByText('Item')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="navigation-menu"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="navigation-menu-viewport"]')).toBeNull();
  });

  it('renders viewport and indicator when enabled', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href='#'>Item</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuIndicator />
      </NavigationMenu>,
    );

    expect(container.querySelector('[data-slot="navigation-menu-viewport"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="navigation-menu-indicator"]')).toBeInTheDocument();
  });
});
