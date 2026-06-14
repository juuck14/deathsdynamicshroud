# 死's Dynamic Shroud — Fan Archive

[death's dynamic shroud](https://en.wikipedia.org/wiki/Death%27s_Dynamic_Shroud)의 디스코그래피를 모아 보는 비공식 팬사이트입니다. 데이터는 MusicBrainz와 Cover Art Archive에서 가져오고, 분류는 Wikipedia 디스코그래피를 참고합니다.

React + Vite 기반입니다.

## 주요 기능

- 아티스트 정보와 외부 링크 제공
- 97개 릴리스를 카테고리, 연도, 장르별로 탐색
- 카테고리 필터, 제목 검색, 오래된순/최신순 정렬
- 앨범별 청취 체크와 진행률 표시
- 청취 기록은 브라우저 localStorage(`dds:listened`)에 저장

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
```

## 데이터 갱신

```bash
npm run fetch    # MusicBrainz/Cover Art Archive에서 데이터 수집
npm run enrich   # 카테고리, 연도, 대표 장르 분류
```

갱신 후 `data/`는 `public/data/`로, `data/covers/`는 `public/covers/`로 복사합니다. MusicBrainz 요청 제한 때문에 전체 수집에는 약 3~4분이 걸립니다.

## 프로젝트 구조

```text
fetch-data.mjs      # 데이터 수집 스크립트
enrich-data.mjs     # 릴리스 분류 스크립트
data/               # 원본 수집 데이터
public/data/        # 앱에서 사용하는 데이터
public/covers/      # 앨범 커버 이미지
src/App.jsx         # 메인 UI
src/useListened.js  # 청취 기록 훅
src/styles.css      # 스타일
```

## 분류 기준

스튜디오 앨범, 초기 `.wmv` 믹스테이프, 라이브 앨범 목록은 `enrich-data.mjs`에 정의되어 있습니다. EP와 Single은 MusicBrainz 타입을 따르고, 나머지는 NUWRLD Mixtape Club으로 분류합니다.

## 데이터 출처 / 라이선스

- 메타데이터: [MusicBrainz](https://musicbrainz.org) (CC0)
- 커버 이미지: [Cover Art Archive](https://coverartarchive.org) — 저작권은 각 권리자에게 있습니다.
- 디스코그래피 분류 참고: [Wikipedia](https://en.wikipedia.org/wiki/Death%27s_Dynamic_Shroud)
