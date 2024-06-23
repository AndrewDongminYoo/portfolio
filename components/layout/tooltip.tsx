import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';
import { Button } from 'components/ui/button';
import { TooltipProvider } from '@radix-ui/react-tooltip';

export function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='outline'>Hover</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
