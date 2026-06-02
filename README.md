# Gourming

나만의 미식 지도를 만들기 위한 프론트엔드 프로젝트입니다. 외부 Java 백엔드 서버와 통신하도록 구성되어 있습니다.

## 기술 스택 및 패키지

- 코어: Vue 3 (Composition API), TypeScript
- 빌드 도구: Vite
- 패키지 매니저: pnpm
- 라우팅: Vue Router
- 상태 관리: Pinia
- 통신: Axios
- 스타일링: Tailwind CSS (v4)
- 코드 품질: ESLint, Prettier, Husky, lint-staged

## 주요 프로젝트 구조

```text
src/
├── api/          # Axios 클라이언트 설정 및 API 통신 모듈
├── assets/       # 정적 자원 및 전역 스타일시트 (Tailwind CSS 설정 포함)
├── components/   # 공통으로 사용되는 재사용 가능한 UI 컴포넌트
├── router/       # 페이지 라우팅 설정
├── views/        # 페이지 단위의 컴포넌트
├── App.vue       # 최상위 루트 컴포넌트
└── main.ts       # 애플리케이션 진입점 및 플러그인 초기화
```

## 실행 방법

### 의존성 설치

```sh
pnpm install
```

### 로컬 개발 서버 실행

```sh
pnpm dev
```

(개발 서버는 기본적으로 로컬의 Java 백엔드(http://localhost:8080)를 향해 /api 프록시가 설정되어 있습니다.)

### 타입 검사 및 프로덕션 빌드

```sh
pnpm build
```

### 코드 린트

```sh
pnpm lint
```
