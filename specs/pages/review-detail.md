# 리뷰 상세 페이지 (Review Detail Page) 구현 계획

## 1. 개요

- **목적**: 개별 리뷰의 상세 내용을 확인하고, 댓글 및 좋아요 등의 상호작용 수행.

## 2. 레이아웃 및 컴포넌트

- **Top Navigation**: 뒤로가기 버튼, 페이지 타이틀.
- **Review Content Section**:
  - 작성자 프로필 컴포넌트 (이미지, 이름, 핸들, 팔로우).
  - 리뷰 이미지 (Swiper/Carousel 형태의 이미지 뷰어).
  - 이미지 하단 영역에 식당 상세 정보 오버레이 (상호명, 평점 등).
  - 텍스트 리뷰 본문, 작성자가 부여한 평점, 작성일.
- **Interaction Bar**:
  - 좋아요 아이콘, 댓글 달기 아이콘, 공유하기 아이콘 및 각각의 카운트.
- **Comment Section**:
  - `CommentList` 컴포넌트.
  - `CommentItem` (작성자 프로필, 댓글 내용, 작성 시간, (옵션)댓글 좋아요).
- **Comment Input**:
  - 화면 하단 고정형 입력창. 모바일 환경에서 가상 키보드 활성화 시 뷰포트 영역 대응.

## 3. 상태 관리

- **Server State**:
  - 특정 리뷰의 모든 정보 데이터.
  - 해당 리뷰에 달린 댓글 목록 데이터.
- **Local State**:
  - 댓글 입력창의 텍스트 밸류.
  - 공유하기 모달 등 UI 토글 상태.

## 4. API 연동

- `GET /api/reviews/{id}` (리뷰 상세 데이터 페칭)
- `GET /api/reviews/{id}/comments` (댓글 목록 페칭)
- `POST /api/reviews/{id}/comments` (댓글 작성 요청)
- `POST /api/reviews/{id}/like` (좋아요 토글)

## 5. 주요 인터랙션

- 공유 버튼 클릭 시 클립보드에 링크 복사 또는 Web Share API 호출.
- 식당 오버레이 영역 클릭 시 식당 상세 페이지(`/place/{id}`)로 이동.
- 댓글 작성 시 낙관적 업데이트(Optimistic UI)를 통해 즉각적으로 리스트에 추가되는 UX 제공.
