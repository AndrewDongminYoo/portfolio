import { SiAndroid, SiApple } from '@icons-pack/react-simple-icons';
import { Globe, SquareArrowOutUpRight } from 'lucide-react';

import type { Platform } from '@/interface/app';

interface PlatformBadgeProps {
  /** 플랫폼 정보 */
  platform: Platform;
}

/**
 * 플랫폼 링크 버튼을 표시하는 컴포넌트
 */
export default function PlatformBadge({ platform }: PlatformBadgeProps) {
  const { type, url } = platform;

  const icons = {
    ios: <SiApple className='h-4 w-4' />,
    android: <SiAndroid className='h-4 w-4' />,
    web: <Globe className='h-4 w-4' />,
  };

  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50'>
      {icons[type]}
      <SquareArrowOutUpRight className='h-3 w-3 opacity-50' />
    </a>
  );
}
