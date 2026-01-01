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
import { github, linkedin, medium, portfolio } from '@/lib/constants';

const inlineItemClassName =
  'inline-flex flex-row items-center gap-2 rounded-full px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:text-foreground/80 whitespace-nowrap';
const dropdownItemClassName =
  'w-full flex-row items-center justify-start gap-2 rounded-md px-1.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground';
const badgeClassName =
  'rounded-full border border-border/70 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground';
const externalTriggerClassName =
  'inline-flex flex-row items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-transparent hover:text-foreground/80 data-[state=open]:bg-transparent [&>svg]:hidden';

export default function MenuButtons() {
  return (
    <div className='fixed top-7 right-0 left-0 z-50 flex justify-end px-4 md:right-14 md:left-auto md:px-0 print:hidden'>
      <NavigationMenu viewport={false} className='items-center'>
        <NavigationMenuList className='border-border/60 bg-background/80 flex-wrap justify-end gap-2 rounded-full border px-3 py-1 shadow-sm backdrop-blur md:flex-nowrap'>
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
                <span className={badgeClassName}>내부</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className='md:hidden'>
            <NavigationMenuLink asChild className={inlineItemClassName}>
              <Link href={github} target='_blank' rel='noreferrer noopener'>
                깃헙
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className='md:hidden'>
            <NavigationMenuLink asChild className={inlineItemClassName}>
              <Link href={medium} target='_blank' rel='noreferrer noopener'>
                미디엄
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className='md:hidden'>
            <NavigationMenuLink asChild className={inlineItemClassName}>
              <Link href={linkedin} target='_blank' rel='noreferrer noopener'>
                링크드인
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className='md:hidden'>
            <NavigationMenuLink asChild className={inlineItemClassName}>
              <Link href={portfolio} target='_blank' rel='noreferrer noopener'>
                소스 코드
                <span className={badgeClassName}>외부</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className='hidden md:flex'>
            <NavigationMenuTrigger className={externalTriggerClassName}>
              외부 링크
            </NavigationMenuTrigger>
            <NavigationMenuContent className='min-w-[8rem] p-1 pr-1'>
              <li>
                <NavigationMenuLink asChild className={dropdownItemClassName}>
                  <Link href={github} target='_blank' rel='noreferrer noopener'>
                    깃헙 프로필
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild className={dropdownItemClassName}>
                  <Link href={portfolio} target='_blank' rel='noreferrer noopener'>
                    소스 코드
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild className={dropdownItemClassName}>
                  <Link href={medium} target='_blank' rel='noreferrer noopener'>
                    미디엄 블로그
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild className={dropdownItemClassName}>
                  <Link href={linkedin} target='_blank' rel='noreferrer noopener'>
                    링크드인
                  </Link>
                </NavigationMenuLink>
              </li>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
