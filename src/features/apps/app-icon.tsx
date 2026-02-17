import Image from 'next/image';

interface AppIconProps {
  /** 앱 아이콘 이미지 경로 */
  icon?: string;
  /** 앱 이름 (fallback용) */
  name: string;
  /** 아이콘 크기 (픽셀) */
  size?: number;
}

/**
 * 앱 아이콘을 표시하는 컴포넌트
 * 아이콘이 없을 경우 앱 이름의 첫 글자를 표시합니다.
 */
export default function AppIcon({ icon, name, size = 80 }: AppIconProps) {
  if (icon) {
    return (
      <div
        className='relative overflow-hidden rounded-2xl shadow-md'
        style={{ width: size, height: size }}>
        <Image src={icon} alt={name} fill className='object-cover' sizes={`${size}px`} priority />
      </div>
    );
  }

  // Fallback: 앱 이름의 첫 글자
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className='flex items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 shadow-md'
      style={{ width: size, height: size }}>
      <span className='text-white' style={{ fontSize: size * 0.5, fontWeight: 600 }}>
        {initial}
      </span>
    </div>
  );
}
