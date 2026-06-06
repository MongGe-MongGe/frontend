# 데이터 모델 스펙 (Data Models)

## 1. Reviews (리뷰)

| Key                       | Type     | Value                              |
| ------------------------- | -------- | ---------------------------------- |
| id (PK)                   | String   | uuid - 리뷰 ID                     |
| created_at                | Date     | 작성일                             |
| updated_at                | Date     | 편집일 - 최초 편집일 = 작성일      |
| visited_at                | Date     | 방문일                             |
| content                   | String   | 리뷰 내용                          |
| images                    | String[] | 이미지 목록                        |
| rating_score              | int?     | 식당 평점 - 작성자가 평가함        |
| place_id (FK)             | String   | 장소 ID                            |
| user_id (FK)              | String   | 작성자 ID                          |
| place                     | Object   | join 시 가져올 장소 데이터         |
| ↳ place.id                | String   | 장소 ID                            |
| ↳ place.name              | String   | 장소명                             |
| ↳ place.category_name     | String   | 장소 타입 (FD6: 음식점, CE7: 카페) |
| ↳ place.road_address_name | String   | 전체 지번 주소                     |
| ↳ place.x                 | String   | x좌표                              |
| ↳ place.y                 | String   | y좌표                              |
| user                      | Object   | join 시 가져올 유저 데이터         |
| ↳ user.id                 | String   | 작성자 ID                          |
| ↳ user.nickname           | String   | 작성자 닉네임                      |
| ↳ user.handle             | String   | 작성자 고유 아이디 (@...)          |
| ↳ user.profile_image      | String   | 작성자 프로필 이미지               |

## 2. Likes (좋아요)

| Key            | Type   | Value     |
| -------------- | ------ | --------- |
| id (PK)        | String | 좋아요 id |
| user_id (FK)   | String | 유저 id   |
| review_id (FK) | String | 리뷰 id   |
| created_at     | Date   | 생성 시간 |

## 3. Users (사용자)

| Key           | Type   | Value                     |
| ------------- | ------ | ------------------------- |
| id (PK)       | String | 작성자 ID                 |
| email         | String | 이메일                    |
| password      | String | 비밀번호 (hashed)         |
| handle        | String | 작성자 고유 아이디 (@...) |
| nickname      | String | 작성자 닉네임             |
| phone         | String | 전화번호                  |
| bio           | String | 자기소개                  |
| profile_image | String | 작성자 프로필 이미지      |
| created_at    | Date   | 가입일                    |

## 4. Places (장소)

| Key               | Type   | Value                              |
| ----------------- | ------ | ---------------------------------- |
| id (PK)           | String | 장소 ID - 카카오 ID                |
| name              | String | 장소명                             |
| category_name     | String | 장소 타입 (FD6: 음식점, CE7: 카페) |
| road_address_name | String | 전체 지번 주소                     |
| x                 | String | x좌표                              |
| y                 | String | y좌표                              |
| created_at        | Date   | 생성 시간                          |
| updated_at        | Date   | 갱신 시간                          |

## 5. Follows (팔로우)

| Key                 | Type   | Value                        |
| ------------------- | ------ | ---------------------------- |
| id (PK)             | String | 팔로우 id                    |
| user_id (FK)        | String | 유저 id                      |
| target_user_id (FK) | String | 유저가 팔로우한 타겟 유저 id |
| created_at          | Date   | 생성 시간                    |

## 6. Group (맛집 그룹)

| Key          | Type   | Value     |
| ------------ | ------ | --------- |
| id (PK)      | String | 그룹 id   |
| user_id (FK) | String | 유저 id   |
| name         | String | 그룹 이름 |
| created_at   | Date   | 생성 시간 |

## 7. GoodPlaces (맛집 저장)

| Key                       | Type   | Value                              |
| ------------------------- | ------ | ---------------------------------- |
| id (PK)                   | String | 굿플레이스 id                      |
| user_id (FK)              | String | 유저 id                            |
| group_id (FK)             | String | 그룹 id                            |
| place_id (FK)             | String | 장소 ID                            |
| created_at                | Date   | 생성 시간                          |
| place                     | Object | join 시 가져올 장소 데이터         |
| ↳ place.id                | String | 장소 ID                            |
| ↳ place.name              | String | 장소명                             |
| ↳ place.category_name     | String | 장소 타입 (FD6: 음식점, CE7: 카페) |
| ↳ place.road_address_name | String | 전체 지번 주소                     |
| ↳ place.x                 | String | x좌표                              |
| ↳ place.y                 | String | y좌표                              |

## 8. Posts (게시글)

| Key          | Type   | Value                   |
| ------------ | ------ | ----------------------- | ------ |
| id (PK)      | String | 게시글 id               |
| user_id (FK) | String | 작성자 id               |
| title        | String | 제목                    |
| content      | String | 내용                    |
| category     | String | 게시글 카테고리 (Notice | Event) |
| created_at   | Date   | 작성 시간               |
| updated_at   | Date   | 갱신 시간               |

## 9. Comments (댓글)

| Key                  | Type   | Value                      |
| -------------------- | ------ | -------------------------- |
| id (PK)              | String | 댓글 id                    |
| user_id (FK)         | String | 유저 id                    |
| review_id (FK)       | String | 리뷰 id                    |
| content              | String | 내용                       |
| created_at           | Date   | 생성 시간                  |
| user                 | Object | join 시 가져올 유저 데이터 |
| ↳ user.id            | String | 작성자 ID                  |
| ↳ user.nickname      | String | 작성자 닉네임              |
| ↳ user.handle        | String | 작성자 고유 아이디 (@...)  |
| ↳ user.profile_image | String | 작성자 프로필 이미지       |
