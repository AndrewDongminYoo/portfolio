import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

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