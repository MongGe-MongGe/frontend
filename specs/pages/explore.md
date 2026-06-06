# 탐색 페이지 (Explore Page) 구현 계획

## 1. 개요

- **목적**: 유저, 식당 등 다양한 콘텐츠를 검색하고, 인기 콘텐츠 및 이벤트를 확인.

## 2. 레이아웃 및 컴포넌트

- **Search Header**:
  - `SearchBar` 컴포넌트 (검색어 입력창, 클리어 버튼)
- **Event Banner Carousel**:
  - 진행 중인 이벤트를 자동으로 넘겨주는 스와이프 가능한 배너.
- **Category Tabs** (검색어 입력 시):
  - '유저', '식당' 탭으로 검색 결과를 분리하여 표시.
- **Search Result List**:
  - 유저 결과: `UserListItem` (프로필, 닉네임, 핸들, 팔로우 버튼)
  - 식당 결과: `PlaceListItem` (식당명, 주소, 카테고리, 평점, 북마크 버튼)
- **Popular Feed Section** (기본 탐색 화면):
  - 태그 필터 (예: #카페, #데이트, #가성비 등 가로 스크롤)
  - 썸네일 형태의 그리드 피드 리스트 (`GridFeedItem`)

## 3. 상태 관리 (State)

- **Local State**:
  - 검색창 텍스트 값.
  - 현재 선택된 탭(유저/식당).
  - 현재 선택된 인기 태그.
- **Server State**:
  - 통합 검색 결과 데이터.
  - 이벤트 배너 데이터.
  - 인기 피드 썸네일 리스트.

## 4. API 연동

- `GET /api/search?q={query}&type={user|place}` (통합 검색 로직)
- `GET /api/events/banners` (이벤트 배너 조회)
- `GET /api/feeds/popular?tag={tag}` (인기 피드 조회)

## 5. 주요 인터랙션

- 검색어 입력 시 디바운싱(Debouncing) 기법을 적용하여 API 호출 횟수 최적화.
- 배너 클릭 시 이벤트 상세(공지사항 상세) 페이지로 라우팅.
- 그리드 썸네일 클릭 시 해당 리뷰 상세 페이지로 이동.
