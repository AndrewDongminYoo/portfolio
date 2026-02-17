import type App from '@/interface/app';

import AppCard from './app-card';

interface AppListProps {
  /** 앱 목록 */
  apps: App[];
}

/**
 * 앱 목록을 그리드로 표시하는 컨테이너 컴포넌트
 */
export default function AppList({ apps }: AppListProps) {
  if (!apps || apps.length === 0) {
    return (
      <div className='py-8 text-center text-gray-500'>
        <p>표시할 앱이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className='resume_card_item grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}
