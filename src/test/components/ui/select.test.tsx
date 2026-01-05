import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@radix-ui/react-select', () => {
  const create = (tag: string) =>
    React.forwardRef(({ children, ...props }: { children: React.ReactNode }, ref) =>
      React.createElement(tag, { ref, ...props }, children),
    );

  return {
    Root: create('div'),
    Group: create('div'),
    Value: create('span'),
    Trigger: create('button'),
    Content: create('div'),
    Label: create('div'),
    Item: create('div'),
    ItemText: create('span'),
    ItemIndicator: create('span'),
    Separator: create('div'),
    ScrollUpButton: create('button'),
    ScrollDownButton: create('button'),
    Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Viewport: create('div'),
    Icon: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

describe('Select', () => {
  it('renders trigger and open content', () => {
    const { container, getByText } = render(
      <Select value='a'>
        <SelectTrigger size='sm'>
          <SelectValue placeholder='Select' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='a'>Option A</SelectItem>
        </SelectContent>
      </Select>,
    );

    const trigger = container.querySelector('[data-slot="select-trigger"]');
    expect(trigger).toHaveAttribute('data-size', 'sm');
    expect(getByText('Option A')).toBeInTheDocument();
  });

  it('renders grouped content with labels, separators, and popper position classes', () => {
    const { container, getByText } = render(
      <Select value='a'>
        <SelectTrigger>
          <SelectValue placeholder='Select' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            <SelectLabel>Group A</SelectLabel>
            <SelectItem value='a'>Option A</SelectItem>
            <SelectSeparator />
            <SelectItem value='b'>Option B</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );

    const content = container.querySelector('[data-slot="select-content"]');
    expect(content).toBeInTheDocument();
    expect(content?.className).toContain('translate-y-1');
    expect(getByText('Group A')).toBeInTheDocument();
    expect(getByText('Option B')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="select-separator"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="select-scroll-up-button"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="select-scroll-down-button"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="select-item-indicator"]')).toBeInTheDocument();
  });
});
