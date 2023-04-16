import Image from 'next/image';
import { ReactNode } from 'react';
import profile from '@/public/images/profile.jpg';

export default function Question({ children }: { children: ReactNode }) {
    return (
        <div className='w-full text-gray-800 border-b border-black/10 dark:border-gray-900/50 dark:text-gray-100 group dark:bg-gray-800'>
            <div className='flex gap-4 p-4 m-auto text-base md:gap-6 md:max-w-2xl lg:max-w-2xl xl:max-w-3xl md:py-6 lg:px-0'>
                <div className='relative flex flex-col items-end w-8'>
                    <div className='relative flex'>
                        <span className='box-border relative inline-block w-auto h-auto overflow-hidden'>
                            <Image
                                alt='Andrew Yu'
                                src={profile}
                                width={32}
                                height={32}
                                decoding='async'
                                loading='lazy'
                                className='box-border inset-0 m-auto border-0 rounded-sm'
                            />
                        </span>
                    </div>
                    <div className='absolute left-0 flex items-center justify-center invisible gap-1 -ml-4 text-xs -translate-x-full top-2 group-hover:visible'></div>
                </div>
                <div className='relative flex w-[calc(100%-50px)] md:flex-col lg:w-[calc(100%-115px)]'>
                    <div className='flex flex-col flex-grow gap-3'>
                        <div className='min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap'>
                            <p>{children}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
