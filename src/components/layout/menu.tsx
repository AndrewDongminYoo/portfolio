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
import { github } from '@/lib/constants';

const menuItemClassName =
  'w-full flex-row items-center justify-start gap-2 px-3 py-2 text-left text-sm font-medium text-foreground';

export default function MenuButtons() {
  return (
    <div className='fixed top-14 right-14 z-50 flex justify-end print:hidden'>
      <NavigationMenu viewport={false} className='items-center'>
        <NavigationMenuList className='justify-end'>
          <NavigationMenuItem>
            <NavigationMenuTrigger className='border-border/60 bg-background/80 text-foreground hover:bg-accent/60 h-8 rounded-full border px-3 text-xs font-semibold tracking-wide shadow-sm backdrop-blur transition'>
              메뉴
            </NavigationMenuTrigger>
            <NavigationMenuContent className='min-w-[10rem] p-1'>
              <ul className='flex flex-col'>
                <li>
                  <NavigationMenuLink asChild className={menuItemClassName}>
                    <button type='button' onClick={() => window.print()}>
                      프린트하기
                    </button>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild className={menuItemClassName}>
                    <Link href='/repos'>포트폴리오</Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild className={menuItemClassName}>
                    <Link href={github}>깃헙프로필</Link>
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
