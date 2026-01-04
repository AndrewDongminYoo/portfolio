import { render } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

beforeAll(() => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  vi.stubGlobal('ResizeObserver', ResizeObserver);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe('Tooltip', () => {
  it('renders trigger and content when open', () => {
    render(
      <Tooltip open>
        <TooltipTrigger asChild>
          <button type='button'>Trigger</button>
        </TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>,
    );

    expect(document.querySelector('[data-slot="tooltip-trigger"]')).toBeInTheDocument();
    const content = document.querySelector('[data-slot="tooltip-content"]');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Tooltip text');
  });
});
