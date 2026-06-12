# 死's Dynamic Shroud — Fan Archive

[death's dynamic shroud](https://en.wikipedia.org/wiki/Death%27s_Dynamic_Shroud) (오하이오 데이턴 출신의 베이퍼웨이브/일렉트로닉 트리오) 디스코그래피를 모아놓은 비공식 팬사이트입니다. 데이터는 **MusicBrainz**와 **Cover Art Archive**에서 가져왔고, 앨범 분류는 **Wikipedia** 디스코그래피를 참고했습니다.

React + Vite (JavaScript) 기반.

## 기능

- **아티스트 정보** — 멤버(Tech Honors · Keith Rankin · James Webster), 활동 기간, 장르, 외부 링크(Bandcamp/Discogs/Last.fm 등)
- **앨범 분류** — 총 97개 릴리스를 카테고리/연도/장르로 묶어서 보기
  - 카테고리: `Studio Album`, `NUWRLD Mixtape (.wmv)`(2014 초기 믹스테이프), `NUWRLD Mixtape Club`(2020~현재 월간 시리즈), `Live Album`, `EP`, `Single`
  - **위키 정식 디스코그래피에 없는 최근작은 NUWRLD Mixtape Club 릴리스로 분류됩니다.**
  - 정렬(오래된순/최신순), 카테고리 필터, 제목 검색
- **청취 체크** — 각 앨범 카드의 `+ 체크` 버튼으로 들은 앨범 표시. 진행률 바로 한눈에 확인. 기록은 브라우저 **localStorage**(`dds:listened` 키)에 저장되어 새로고침/재방문 시에도 유지됩니다.

## 실행

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 빌드 결과 미리보기
```

## 데이터 갱신

```bash
npm run fetch    # MusicBrainz/Cover Art Archive에서 다시 수집 → data/
npm run enrich   # 카테고리/연도/대표장르 분류 부여
# 갱신 후 data/ → public/data/, data/covers/ → public/covers/ 로 복사
```

> MusicBrainz는 초당 1요청 제한이 있어 전체 수집에 약 3~4분 걸립니다 (`fetch-data.mjs`에 rate limit 포함).

## 구조

```
fetch-data.mjs        # MusicBrainz + Cover Art Archive 수집 스크립트
enrich-data.mjs       # 위키 기준 카테고리 분류 부여
data/                 # 원본 수집 결과 (artist.json, albums.json, release-groups.json, covers/)
public/data/          # 앱이 런타임에 fetch 하는 데이터
public/covers/        # 앨범 커버 이미지 (파일명 = release-group MBID)
src/
  App.jsx             # 메인 UI (분류·필터·검색·청취 체크)
  useListened.js      # localStorage 청취 기록 훅
  styles.css          # 베이퍼웨이브 스타일
```

## 분류 기준 메모

`enrich-data.mjs` 안에 스튜디오 앨범 / 초기 .wmv 믹스테이프 / 라이브 앨범 제목 목록이 하드코딩되어 있고, EP·Single은 MusicBrainz의 타입을 따릅니다. 나머지는 모두 NUWRLD Mixtape Club로 분류됩니다. 분류를 바꾸려면 해당 파일의 집합(set)을 수정한 뒤 `npm run enrich`를 다시 실행하세요.

> **참고:** "프로듀서별" 보기는 아직 없습니다. MusicBrainz의 release-group 데이터에는 릴리스별 개별 멤버 프로듀서 크레딧이 구조화되어 있지 않아, 정확한 프로듀서 분류는 Bandcamp 크레딧을 수동 큐레이션해야 합니다. 추후 `id → 멤버` 매핑 파일을 추가하면 동일한 방식으로 그룹 보기를 붙일 수 있습니다.

## 데이터 출처 / 라이선스

- 메타데이터: [MusicBrainz](https://musicbrainz.org) (CC0)
- 커버 이미지: [Cover Art Archive](https://coverartarchive.org) — 저작권은 각 권리자에게 있으며, 비상업적 팬 목적 사용입니다.
- 디스코그래피 분류 참고: [Wikipedia](https://en.wikipedia.org/wiki/Death%27s_Dynamic_Shroud)
