'use client';

import { Transition } from '@headlessui/react';
import { ComponentProps, useState } from 'react';

import { cn } from '@/lib/utils';

interface CopyToClipboardProps extends ComponentProps<'button'> {
  value: string;
}

export function CopyToClipboard(props: CopyToClipboardProps) {
  const [isShowing, setIsShowing] = useState(false);
  const { className, children, value } = props;
  return (
    <>
      <button
        title="Click to Copy Repository's git address."
        className={cn('mb-0 flex cursor-pointer items-center text-xs text-gray-600', className)}
        onClick={() => {
          setIsShowing(true);
          navigator.clipboard.writeText(value);
        }}>
        {children}
      </button>
      <Transition
        static
        as='div'
        show={isShowing}
        className='text-foreground my-0 mr-1 ml-0 w-fit rounded border-0 bg-slate-200 px-1 py-0.5 text-xs whitespace-nowrap'
        enter='transition-opacity duration-150'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        entered='delay-500'
        afterEnter={() => setIsShowing(false)}
        leave='transition-opacity duration-150'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'>
        {`${value} is Copied!!`}.
      </Transition>
    </>
  );
}
