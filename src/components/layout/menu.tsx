'use client';

import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { github } from '@/lib/constants';

const menuItemClassName =
  'px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:text-foreground/80';

export default function MenuButtons() {
  return (
    <div className='z-50 flex justify-end print:hidden'>
      <NavigationMenu viewport={false} className='items-center'>
        <NavigationMenuList className='border-border/60 bg-background/80 justify-end gap-2 rounded-full border px-3 py-1 shadow-sm backdrop-blur'>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={menuItemClassName}>
              <button type='button' onClick={() => window.print()}>
                프린트하기
              </button>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={menuItemClassName}>
              <Link href='/repos'>포트폴리오</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={menuItemClassName}>
              <Link href={github}>깃헙프로필</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
