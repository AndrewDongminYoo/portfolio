'use client';

import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { github, linkedin, medium } from '@/lib/constants';

const inlineItemClassName =
  'inline-flex flex-row items-center gap-2 rounded-full px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:text-foreground/80';
const dropdownItemClassName =
  'w-full flex-row items-center justify-start gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground';
const internalBadgeClassName =
  'rounded-full border border-border/70 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground';
const externalTriggerClassName =
  'inline-flex flex-row items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-transparent hover:text-foreground/80 data-[state=open]:bg-transparent [&>svg]:hidden';

export default function MenuButtons() {
  return (
    <div className='fixed top-14 right-14 z-50 flex justify-end print:hidden'>
      <NavigationMenu viewport={false} className='items-center'>
        <NavigationMenuList className='border-border/60 bg-background/80 justify-end gap-2 rounded-full border px-3 py-1 shadow-sm backdrop-blur'>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={inlineItemClassName}>
              <a href='/api/resume' download>
                PDF로 다운로드
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={inlineItemClassName}>
              <Link href='/repos'>
                포트폴리오
                <span className={internalBadgeClassName}>내부</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={externalTriggerClassName}>
              외부 링크
            </NavigationMenuTrigger>
            <NavigationMenuContent className='min-w-[12rem] p-1'>
              <ul className='flex flex-col'>
                <li>
                  <NavigationMenuLink asChild className={dropdownItemClassName}>
                    <a href={github} target='_blank' rel='noreferrer noopener'>
                      깃헙 프로필
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild className={dropdownItemClassName}>
                    <a href={medium} target='_blank' rel='noreferrer noopener'>
                      미디엄 블로그
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild className={dropdownItemClassName}>
                    <a href={linkedin} target='_blank' rel='noreferrer noopener'>
                      링크드인
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
