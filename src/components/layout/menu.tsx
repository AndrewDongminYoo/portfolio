'use client';

import { SiGithub, SiGithubcopilot, SiMedium } from '@icons-pack/react-simple-icons';
import { FolderGit2, GitFork, Linkedin, PrinterCheck } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { jsx } from 'react/jsx-runtime';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCanHover, useLongPressTooltip } from '@/hooks/use-hover';
import { github, linkedin, medium, portfolio } from '@/lib/constants';

const inlineItemClassName =
  'inline-flex flex-row items-center gap-2 rounded-full px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:text-foreground/80 whitespace-nowrap';
const dropdownItemClassName =
  'w-full flex-row items-center justify-end gap-2 rounded-md px-1.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground';
const externalTriggerClassName =
  'inline-flex flex-row items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-transparent hover:text-foreground/80 data-[state=open]:bg-transparent';

export function MenuButtonIcon({
  text,
  icon,
  hideText,
}: {
  text: string;
  icon: ForwardRefExoticComponent<RefAttributes<SVGSVGElement>>;
  hideText?: boolean;
}) {
  if (hideText) {
    const canHover = useCanHover();
    const { open, setOpen, handlers } = useLongPressTooltip(450, !canHover);

    return (
      <Tooltip
        delayDuration={0}
        open={!canHover ? open : undefined}
        onOpenChange={!canHover ? setOpen : undefined}>
        <TooltipTrigger asChild {...handlers}>
          {jsx(icon, { className: 'size-4' })}
        </TooltipTrigger>
        <TooltipContent side='bottom'>{text}</TooltipContent>
      </Tooltip>
    );
  }
  return (
    <div className='bg-background focus:bg-accent focus:text-accent-foreground text-foreground hover:text-foreground/80 text-sm font-medium'>
      {text} {jsx(icon, { className: 'size-4' })}
    </div>
  );
}

export default function MenuButtons() {
  return (
    <div className='fixed top-0 right-0 left-0 z-50 flex justify-end px-4 pt-0 md:top-7 md:right-14 md:left-auto md:px-0 md:pt-0 print:hidden'>
      <NavigationMenu viewport={false} className='items-center'>
        <NavigationMenuList className='border-border/60 bg-background/80 flex-wrap justify-end gap-2 rounded-full border px-3 py-1 shadow-sm backdrop-blur md:flex-nowrap'>
          <NavigationMenuItem>
            <NavigationMenuLink className={inlineItemClassName} href='/api/resume' download>
              <MenuButtonIcon text='PDF' icon={PrinterCheck} />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={inlineItemClassName} href='/repos'>
              <MenuButtonIcon text='Repos' icon={FolderGit2} />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className='md:hidden'>
            <NavigationMenuLink
              className={inlineItemClassName}
              href={github}
              target='_blank'
              rel='noreferrer noopener'>
              <MenuButtonIcon text='Profile' icon={SiGithub} hideText />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className='md:hidden'>
            <NavigationMenuLink
              className={inlineItemClassName}
              href={medium}
              target='_blank'
              rel='noreferrer noopener'>
              <MenuButtonIcon text='Medium Profile' icon={SiMedium} hideText />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className='md:hidden'>
            <NavigationMenuLink
              className={inlineItemClassName}
              href={linkedin}
              target='_blank'
              rel='noreferrer noopener'>
              <MenuButtonIcon text='LinkedIn Profile' icon={Linkedin} hideText />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className='md:hidden'>
            <NavigationMenuLink
              className={inlineItemClassName}
              href={portfolio}
              target='_blank'
              rel='noreferrer noopener'>
              <MenuButtonIcon text='See Code' icon={GitFork} hideText />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className='hidden md:flex'>
            <NavigationMenuTrigger className={externalTriggerClassName}>
              See More
            </NavigationMenuTrigger>
            <NavigationMenuContent className='min-w-[8rem] p-1 pr-1'>
              <NavigationMenuLink
                className={dropdownItemClassName}
                href={github}
                target='_blank'
                rel='noreferrer noopener'>
                <MenuButtonIcon text='Profile' icon={SiGithubcopilot} />
              </NavigationMenuLink>
              <NavigationMenuLink
                className={dropdownItemClassName}
                href={portfolio}
                target='_blank'
                rel='noreferrer noopener'>
                <MenuButtonIcon text='See Code' icon={FolderGit2} />
              </NavigationMenuLink>
              <NavigationMenuLink
                className={dropdownItemClassName}
                href={medium}
                target='_blank'
                rel='noreferrer noopener'>
                <MenuButtonIcon text='Medium' icon={SiMedium} />
              </NavigationMenuLink>
              <NavigationMenuLink
                className={dropdownItemClassName}
                href={linkedin}
                target='_blank'
                rel='noreferrer noopener'>
                <MenuButtonIcon text='LinkedIn' icon={Linkedin} />
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
