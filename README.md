# MoveIt - 댄스학원 & 수업 웹 앱

React와 Next.js를 사용하여 만든 모바일 최적화 댄스학원 및 수업 조회 웹 애플리케이션입니다.

## 주요 기능

- 🏫 **학원 조회**: 학원 목록, 상세 정보, 태그 검색
- 👨‍🏫 **강사 조회**: 강사 목록, 프로필, 전문분야
- 📅 **스케줄 조회**: 수업 일정, 시간별 필터링
- 👤 **마이 페이지**: 회원가입, 로그인, 찜한 클래스/강사/학원 관리
- 🏠 **홈**: 인기 학원, 곧 시작하는 수업, 인기 강사

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Date**: date-fns

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://vjxnollfggbufpqldxrb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
moveit2/
├── app/                    # Next.js App Router
│   ├── academies/         # 학원 페이지
│   ├── instructors/       # 강사 페이지
│   ├── schedule/          # 스케줄 페이지
│   ├── my/                # 마이 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈 페이지
│   └── globals.css        # 전역 스타일
├── components/
│   ├── tabs/              # 각 탭 컴포넌트
│   └── TabNavigation.tsx  # 하단 탭 네비게이션
├── lib/
│   └── supabase.ts        # Supabase 클라이언트
└── package.json
```

## 주요 페이지

- **홈** (`/`): 인기 학원, 곧 시작하는 수업, 인기 강사
- **학원** (`/academies`): 학원 목록 및 검색
- **강사** (`/instructors`): 강사 목록 및 검색
- **스케줄** (`/schedule`): 수업 일정 (전체/오늘/예정)
- **마이** (`/my`): 사용자 정보 및 설정

## 모바일 최적화

- 반응형 디자인 (최대 너비 448px)
- 터치 친화적 UI 요소
- 하단 고정 탭 네비게이션
- 모바일 뷰포트 설정
- 적절한 폰트 크기 및 간격

## 데이터베이스 스키마

주요 테이블:
- `academies`: 학원 정보
- `classes`: 수업 정보
- `instructors`: 강사 정보
- `users`: 사용자 정보
- `bookings`: 예약 정보
- `schedules`: 수업 일정

## 라이선스

MIT


