'use client';

import { Github, Mail } from 'lucide-react';
import Image from 'next/image';

import { myName } from '@/lib/constants';

export default function BusinessCard() {
  return (
    <div className='w-full max-w-2xl'>
      <div className='overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg'>
        {/* Main Content Container */}
        <div className='flex flex-col gap-8 p-8 md:flex-row md:p-10'>
          {/* Left Section - Profile */}
          <div className='flex shrink-0 flex-col items-center gap-4 md:items-start'>
            <div className='h-40 w-40 shrink-0 overflow-hidden rounded-full border-4 border-slate-200 shadow-md'>
              <Image
                src='/images/profile.jpg'
                alt={myName}
                width={156}
                height={156}
                className='h-full w-full object-cover'
              />
            </div>
            <div className='text-center md:text-left'>
              <h1 className='text-2xl font-bold text-slate-900'>유동민</h1>
              <p className='mt-1 text-sm font-semibold text-blue-600'>Flutter Developer</p>
            </div>
          </div>

          {/* Right Section - Information */}
          <div className='flex flex-1 flex-col gap-6'>
            {/* Contact Info */}
            <div className='space-y-3'>
              <h2 className='text-xs font-bold tracking-widest text-slate-500 uppercase'>
                Contact
              </h2>
              <div className='space-y-2'>
                {/* Email */}
                <a
                  href='mailto:YDM2790@GMAIL.COM'
                  className='group flex items-center gap-3 rounded border border-slate-200 bg-slate-50 p-2.5 transition-colors hover:bg-slate-100'>
                  <Mail className='h-4 w-4 shrink-0 text-blue-600' />
                  <span className='text-sm font-medium text-slate-700 group-hover:text-slate-900'>
                    YDM2790@GMAIL.COM
                  </span>
                </a>

                {/* GitHub */}
                <a
                  href='https://github.com/andrewdongminyoo'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group flex items-center gap-3 rounded border border-slate-800 bg-slate-900 p-2.5 transition-colors hover:bg-slate-800'>
                  <Github className='h-4 w-4 shrink-0 text-white' />
                  <span className='text-sm font-medium text-white group-hover:text-slate-100'>
                    @AndrewDongminYoo
                  </span>
                </a>
              </div>
            </div>

            {/* About */}
            <div className='space-y-3'>
              <h2 className='text-xs font-bold tracking-widest text-slate-500 uppercase'>About</h2>
              <p className='text-sm leading-relaxed text-slate-600'>
                더 독특한 기술을 만들기 위해 끊임없이 실험하고 개선하는 개발자입니다. Flutter와
                React Native 기반의 크로스플랫폼 앱, IoT 디바이스 연동, 데이터 시각화 기능을
                설계/구현해왔습니다.
              </p>
            </div>

            {/* Core Skills */}
            <div className='space-y-3'>
              <h2 className='text-xs font-bold tracking-widest text-slate-500 uppercase'>
                Core Skills
              </h2>
              <div className='flex flex-wrap gap-2'>
                <span className='rounded bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700'>
                  Flutter
                </span>
                <span className='rounded bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700'>
                  React Native
                </span>
                <span className='rounded bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700'>
                  TypeScript
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className='border-t border-slate-200 bg-slate-50 px-8 py-6 md:px-10'>
          <p className='text-center text-sm leading-relaxed text-slate-700 italic md:text-left'>
            "집요하게 더 나은 담을 찾아내는 개발자 유동민입니다."
          </p>
        </div>
      </div>
    </div>
  );
}
