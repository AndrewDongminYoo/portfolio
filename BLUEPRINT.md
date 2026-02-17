# Production Apps Showcase Feature

## Overview

모바일 앱 개발자로서의 경력을 효과적으로 보여주기 위해, 기여한 프로덕션 앱들을 한눈에 볼 수 있는 새로운 섹션을 메인 페이지에 추가합니다. 플랫폼(iOS/Android)을 특정하지 않는 미니멀리즘 UI로 앱 아이콘, 이름, 설명, 스토어 링크를 제공합니다.

## Goals

- 프로덕션 앱 포트폴리오를 메인 이력서 페이지에서 즉시 확인 가능
- 플랫폼 중립적이고 깔끔한 디자인으로 앱 정보 전달
- 기존 섹션(experiences, projects 등)과 일관된 UI/UX 유지
- 앱 스토어 링크를 통한 실제 결과물 확인 가능

## Target Apps

1. **비사이드 (Bside)**
   - URL: https://apps.apple.com/app/id1609179795
   - 역할: 개발 참여

2. **카미 (CAMI)**
   - URL: https://apps.apple.com/app/id6479023185
   - 역할: 개발 참여

3. **Tiimo**
   - URL: https://apps.apple.com/app/id1480220328
   - 역할: 한국어 로캘 번역 및 검수
   - 비고: "2025년 올해의 iPhone 앱" 선정

4. **온:음 (WarmWake)**
   - URL: https://apps.apple.com/app/id6758120543
   - 역할: 개인 프로젝트

## Technical Design

### 1. Data Structure

**File Location**: `data/apps/`

각 앱은 개별 JSON 파일로 관리:

```typescript
// src/interface/app.d.ts
export interface App {
  id: string; // 고유 식별자 (예: "tiimo")
  name: string; // 앱 이름 (예: "Tiimo: ADHD 개선 비주얼 루틴 투두 스케줄 앱")
  nameEn?: string; // 영문 이름 (선택, 예: "Tiimo: Daily To Do AI Planner")
  description: string; // 한줄 설명 (예: "매일의 집중을 돕는 습관 완성・목표 달성 데일리 플래너")
  descriptionEn?: string; // 영문 설명 (예: "Routine Tracker Task Organizer")
  role: 'developer' | 'translator' | 'creator'; // 기여 역할 (예: "translator")
  roleDescription?: string; // 역할 상세 설명 (예: "한국어 로캘 번역")
  icon?: string; // 앱 아이콘 경로 (public/apps/)
  platforms: Platform[]; // 지원 플랫폼 목록
  releaseDate?: string; // 출시일 (ISO format)
  tags?: string[]; // 기술 스택/카테고리 태그
  order: number; // 표시 순서
}

export interface Platform {
  type: 'ios' | 'android' | 'web';
  url: string; // 스토어 링크 | 랜딩 페이지
  packageId?: string; // iOS: App ID, Android: Package name
}
```

**Example**: `data/apps/warmwake.json`

```json
{
  "id": "warmwake",
  "name": "온:음",
  "nameEn": "WarmWake",
  "description": "익명 기반 소셜 커뮤니티 플랫폼",
  "descriptionEn": "A voice message from yesterday",
  "role": "developer",
  "roleDescription": "기획 및 Flutter 개발",
  "icon": "/apps/warmwake-icon.png",
  "platforms": [
    {
      "type": "ios",
      "url": "https://apps.apple.com/app/id6758120543",
      "packageId": "6758120543"
    },
    {
      "type": "android",
      "url": "https://play.google.com/store/apps/details?id=kr.mirae.app",
      "packageId": "kr.mirae.app"
    },
    {
      "type": "web",
      "url": "https://mirae.donminzzi.kr"
    }
  ],
  "releaseDate": "2026-02-13",
  "tags": ["Flutter", "Alarm", "IAP", "Side Project"],
  "order": 1
}
```

### 2. Component Architecture

**Component Hierarchy**:

```
src/features/apps/
├── app-card.tsx          # 개별 앱 카드 컴포넌트
├── app-icon.tsx          # 앱 아이콘 (fallback 지원)
├── platform-badge.tsx    # 플랫폼 뱅지 (최소화)
└── app-list.tsx          # 앱 목록 컨테이너
```

**Key Components**:

1. **AppCard** (`app-card.tsx`)
   - 앱 아이콘, 이름, 설명, 역할 표시
   - 플랫폼 링크 버튼 (미니멀)
   - 호버/탭 시 추가 정보 표시 (선택)
   - 기존 `repo-card.tsx`의 디자인 패턴 참고

2. **AppIcon** (`app-icon.tsx`)
   - 앱 아이콘 이미지 렌더링
   - 아이콘 미제공 시 기본 아이콘 또는 첫 글자 표시
   - 라운드 처리 (iOS 스타일)

3. **PlatformBadge** (`platform-badge.tsx`)
   - 플랫폼 타입에 따른 간단한 링크 버튼
   - 아이콘만 표시하거나 "View" 텍스트로 통일
   - 외부 링크 새 탭 열기

4. **AppList** (`app-list.tsx`)
   - 앱 카드 그리드 레이아웃
   - 반응형 디자인 (모바일: 1열, 태블릿: 2열, 데스크탑: 3-4열)

### 3. Data Management

**File**: `src/lib/apps.ts`

```typescript
import fs from 'fs';
import path from 'path';

const appsDirectory = path.join(process.cwd(), 'data/apps');

export function getApps(): App[] {
  const fileNames = fs.readdirSync(appsDirectory);
  const apps = fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => {
      const fullPath = path.join(appsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(fileContents) as App;
    });

  return apps.sort((a, b) => a.order - b.order);
}
```

### 4. Page Integration

**File**: `src/app/page.tsx`

기존 섹션 사이에 새로운 `apps` 섹션 추가:

```tsx
import { getApps } from '@/lib/apps';
import AppList from '@/features/apps/app-list';

export default function Index() {
  // ... 기존 코드 ...
  const apps = getApps();

  return (
    <Layout>
      <ResumeSection key='timeline' type='timeline'>
        <GridTimeline timeline={experience} />
      </ResumeSection>
      <ReactGithubCalendar />

      {/* 새로운 Apps 섹션 */}
      <ResumeSection key='apps' type='apps'>
        <AppList apps={apps} />
      </ResumeSection>

      <ResumeSection key='experiences' type='experiences'>
        {/* ... */}
      </ResumeSection>
      {/* ... 나머지 섹션 ... */}
    </Layout>
  );
}
```

**File**: `src/components/section.tsx`

`subTitles` 객체에 새로운 타입 추가:

```typescript
const subTitles = {
  // ... 기존 항목 ...
  apps: '프로덕션 앱',
};
```

**File**: `src/interface/profile.d.ts`

`SectionType`에 `'apps'` 추가:

```typescript
export type SectionType =
  | 'educations'
  | 'experiences'
  | 'projects'
  | 'activities'
  | 'contributions'
  | 'timeline'
  | 'apps'; // 추가
```

## UI/UX Design Principles

### Visual Design

1. **Card Layout**
   - 깔끔한 화이트 카드 배경
   - 그림자 또는 보더로 분리
   - 기존 `ResumeSection` 스타일 일관성 유지

2. **Icon Display**
   - 정사각형 또는 라운드 처리된 앱 아이콘
   - 크기: 64px × 64px (모바일), 80px × 80px (데스크탑)
   - 아이콘 없을 시 플레이스홀더 (앱 이름 첫 글자)

3. **Typography**
   - 앱 이름: font-medium, text-lg
   - 설명: text-sm, text-gray-600
   - 역할: text-xs, text-gray-500, italic

4. **Platform Links**
   - 미니멀한 버튼 (아이콘 + 텍스트 또는 텍스트만)
   - 호버 시 언더라인 또는 색상 변경
   - 외부 링크 아이콘 추가 (선택)

### Responsive Design

- **Mobile (< 768px)**: 1열 그리드, 전체 너비
- **Tablet (768px - 1024px)**: 2열 그리드
- **Desktop (> 1024px)**: 3열 또는 4열 그리드

### Accessibility

- 적절한 ARIA 레이블 및 역할 설정
- 키보드 네비게이션 지원
- 충분한 색상 대비 (WCAG AA 이상)
- 스크린 리더 친화적 텍스트

## Implementation Plan

### Phase 1: Data & Types (1-2 hours)

1. ✅ 타입 정의 생성 (`src/interface/app.d.ts`)
2. ✅ 데이터 디렉토리 생성 (`data/apps/`)
3. ✅ 4개 앱 JSON 파일 작성
4. ✅ 데이터 로더 함수 구현 (`src/lib/apps.ts`)

### Phase 2: Components (2-3 hours)

1. ✅ `AppIcon` 컴포넌트 구현
2. ✅ `PlatformBadge` 컴포넌트 구현
3. ✅ `AppCard` 컴포넌트 구현
4. ✅ `AppList` 컴포넌트 구현

### Phase 3: Integration (1 hour)

1. ✅ `SectionType`에 'apps' 추가
2. ✅ `section.tsx`의 `subTitles`에 'apps' 추가
3. ✅ 메인 페이지에 Apps 섹션 추가
4. ✅ 레이아웃 및 순서 조정

### Phase 4: Assets & Polish (1-2 hours)

1. ✅ 앱 아이콘 이미지 수집 및 최적화
2. ✅ `public/apps/` 디렉토리에 아이콘 저장
3. ✅ 반응형 디자인 테스트
4. ✅ 접근성 검토 및 개선

### Phase 5: Testing & Documentation (1 hour)

1. ✅ 브라우저 호환성 테스트
2. ✅ 모바일 기기 테스트
3. ✅ 링크 검증
4. ✅ README.md 업데이트 (선택)

**Total Estimated Time**: 6-9 hours

## Future Enhancements

- [ ] 앱 스토어 API 연동으로 다운로드 수, 평점 등 자동 업데이트
- [ ] 앱 상세 페이지 추가 (`/apps/[id]`)
- [ ] 스크린샷 갤러리 추가
- [ ] 기술 스택 필터링 기능
- [ ] 앱 검색 기능
- [ ] 애니메이션 효과 (카드 호버, 로드 시)

## Success Criteria

✅ 4개 앱이 메인 페이지의 전용 섹션에 표시됨
✅ 각 앱의 아이콘, 이름, 설명, 역할이 명확히 표시됨
✅ 앱 스토어 링크가 정상 작동함 (새 탭에서 열림)
✅ 모바일/태블릿/데스크탑에서 레이아웃이 적절히 조정됨
✅ 기존 섹션들과 시각적 일관성 유지
✅ 페이지 로드 성능에 영향 없음 (이미지 최적화)
✅ 접근성 기준 충족 (키보드, 스크린 리더)

## Risks & Mitigation

| Risk                  | Impact | Mitigation                           |
| --------------------- | ------ | ------------------------------------ |
| 앱 아이콘 저작권 문제 | Medium | 공식 프레스킷 사용 또는 플레이스홀더 |
| 앱 스토어 링크 변경   | Low    | JSON 데이터로 관리, 쉬운 업데이트    |
| 레이아웃 불일치       | Medium | 기존 컴포넌트 패턴 재사용            |
| 성능 저하 (이미지)    | Low    | WebP 포맷, lazy loading 적용         |

## References

- 기존 `repos` 구현: `src/features/repos/`, `src/app/repos/`
- 기존 섹션 구현: `src/components/section.tsx`
- 데이터 구조 참고: `data/repos/*.json`
- 타입 정의 참고: `src/interface/repos.d.ts`
