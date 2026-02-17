import { format } from 'date-fns/format';

import type App from '@/interface/app';

import AppIcon from './app-icon';
import PlatformBadge from './platform-badge';

interface AppCardProps {
  /** 앱 데이터 */
  app: App;
}

const roleLabels = {
  developer: '개발',
  translator: '번역',
  creator: '제작',
};

/**
 * 개별 앱을 표시하는 카드 컴포넌트
 */
export default function AppCard({ app }: AppCardProps) {
  const { name, nameEn, description, descriptionEn, role, roleDescription, platforms, tags } = app;

  return (
    <div className='flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-6 transition-shadow hover:shadow-md'>
      {/* Header: Icon + Name */}
      <div className='flex items-start gap-4'>
        <AppIcon icon={app.icon} name={name} size={64} />
        <div className='flex-1'>
          <h3 className='text-lg font-medium text-gray-900'>{name}</h3>
          {nameEn && <p className='text-sm/tight text-gray-500'>{nameEn}</p>}
          <p className='mt-1 text-xs text-gray-500 italic'>{roleDescription ?? roleLabels[role]}</p>
        </div>
      </div>

      {/* Description */}
      <div className='text-sm text-gray-600'>
        <p>{description}</p>
        {descriptionEn && <p className='mt-1 text-xs text-gray-500'>{descriptionEn}</p>}
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <span
              key={tag}
              className='rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600'>
              {tag}
            </span>
          ))}
        </div>
      )}

      {app.releaseDate && (
        <time className='mt-1 self-end text-xs text-gray-500' dateTime={app.releaseDate}>
          {format(app.releaseDate, 'yyyy.MM.dd.')}
        </time>
      )}

      {/* Platform Links */}
      <div className='flex flex-wrap gap-2'>
        {platforms.map((platform, index) => (
          <PlatformBadge key={`${platform.type}-${index}`} platform={platform} />
        ))}
      </div>
    </div>
  );
}
