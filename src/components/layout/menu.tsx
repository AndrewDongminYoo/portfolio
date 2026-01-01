'use client';

import { SiGithub, SiGithubcopilot, SiMedium } from '@icons-pack/react-simple-icons';
import { FolderGit2, GitFork, Linkedin, PrinterCheck } from 'lucide-react';
import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { github, linkedin, medium, portfolio } from '@/lib/constants';

const inlineItemClassName =
  'inline-flex flex-row items-center gap-2 rounded-full px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:text-foreground/80 whitespace-nowrap';
const dropdownItemClassName =
  'w-full flex-row items-center justify-end gap-2 rounded-md px-1.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground';
const externalTriggerClassName =
  'inline-flex flex-row items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-transparent hover:text-foreground/80 data-[state=open]:bg-transparent [&>svg]:hidden';

function MenuButtonIcon({
  href,
  text,
  icon,
  hideText,
  ...props
}: {
  href: string;
  text: string;
  icon: React.ReactElement;
  hideText?: boolean;
} & React.ComponentProps<'a'>) {
  return hideText ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={href} {...props}>
          {icon}
        </Link>
      </TooltipTrigger>
      <TooltipContent side='bottom'>{text}</TooltipContent>
    </Tooltip>
  ) : (
    <Link href={href} {...props}>
      {text} {icon}
    </Link>
  );
}

export default function MenuButtons() {
  return (
    <div className='fixed top-0 right-0 left-0 z-50 flex justify-end px-4 pt-0 md:top-7 md:right-14 md:left-auto md:px-0 md:pt-0 print:hidden'>
      <NavigationMenu viewport={false} className='items-center'>
        <NavigationMenuList className='border-border/60 bg-background/80 flex-wrap justify-end gap-2 rounded-full border px-3 py-1 shadow-sm backdrop-blur md:flex-nowrap'>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={inlineItemClassName}>
              <MenuButtonIcon
                href='/api/resume'
                text='PDF'
                icon={<PrinterCheck className='size-4' />}
                download
              />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={inlineItemClassName}>
              <MenuButtonIcon href='/repos' text='Repos' icon={<FolderGit2 className='size-4' />} />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className='md:hidden'>
            <NavigationMenuLink asChild className={inlineItemClassName}>
              <MenuButtonIcon
                href={github}
                text='GitHub Profile'
                icon={<SiGithub className='size-4' />}
                hideText
              />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className='md:hidden'>
            <NavigationMenuLink asChild className={inlineItemClassName}>
              <MenuButtonIcon
                href={medium}
                text='Medium Profile'
                icon={<SiMedium className='size-4' />}
                hideText
                target='_blank'
                rel='noreferrer noopener'
              />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className='md:hidden'>
            <NavigationMenuLink asChild className={inlineItemClassName}>
              <MenuButtonIcon
                href={linkedin}
                text='LinkedIn Profile'
                icon={<Linkedin className='size-4' />}
                hideText
                target='_blank'
                rel='noreferrer noopener'
              />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className='md:hidden'>
            <NavigationMenuLink asChild className={inlineItemClassName}>
              <MenuButtonIcon
                href={portfolio}
                text='Source Code'
                icon={<GitFork className='size-4' />}
                hideText
                target='_blank'
                rel='noreferrer noopener'
              />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className='hidden md:flex'>
            <NavigationMenuTrigger className={externalTriggerClassName}>
              External
            </NavigationMenuTrigger>
            <NavigationMenuContent className='min-w-[8rem] p-1 pr-1'>
              <NavigationMenuLink className={dropdownItemClassName}>
                <MenuButtonIcon
                  href={github}
                  text='Profile'
                  icon={<SiGithubcopilot className='size-4' />}
                  target='_blank'
                  rel='noreferrer noopener'
                />
              </NavigationMenuLink>
              <NavigationMenuLink className={dropdownItemClassName}>
                <MenuButtonIcon
                  href={portfolio}
                  text='Source Code'
                  icon={<FolderGit2 className='size-4' />}
                  target='_blank'
                  rel='noreferrer noopener'
                />
              </NavigationMenuLink>
              <NavigationMenuLink className={dropdownItemClassName}>
                <MenuButtonIcon
                  href={medium}
                  text='Medium'
                  icon={<SiMedium className='size-4' />}
                  target='_blank'
                  rel='noreferrer noopener'
                />
              </NavigationMenuLink>
              <NavigationMenuLink className={dropdownItemClassName}>
                <MenuButtonIcon
                  href={linkedin}
                  text='LinkedIn'
                  icon={<Linkedin className='size-4' />}
                  target='_blank'
                  rel='noreferrer noopener'
                />
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
