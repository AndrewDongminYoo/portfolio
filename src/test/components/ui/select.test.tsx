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
  SelectItem,
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
});
