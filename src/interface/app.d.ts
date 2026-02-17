/**
 * 프로덕션 앱 정보
 */
export default interface App {
  /** 고유 식별자 */
  id: string;
  /** 앱 이름 (한글) */
  name: string;
  /** 앱 이름 (영문, 선택) */
  nameEn?: string;
  /** 한줄 설명 (한글) */
  description: string;
  /** 한줄 설명 (영문, 선택) */
  descriptionEn?: string;
  /** 기여 역할 */
  role: 'developer' | 'translator' | 'creator';
  /** 역할 상세 설명 */
  roleDescription?: string;
  /** 앱 아이콘 경로 (public/apps/) */
  icon?: string;
  /** 지원 플랫폼 목록 */
  platforms: Platform[];
  /** 출시일 (ISO format) */
  releaseDate?: string;
  /** 기술 스택/카테고리 태그 */
  tags?: string[];
  /** 표시 순서 */
  order: number;
}

/**
 * 플랫폼 정보
 */
export interface Platform {
  /** 플랫폼 타입 */
  type: 'ios' | 'android' | 'web';
  /** 스토어 링크 또는 랜딩 페이지 */
  url: string;
  /** iOS: App ID, Android: Package name */
  packageId?: string;
}
