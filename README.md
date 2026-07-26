# Portfolio structure

- `js/head.js`: 공통 `<head>` 설정(meta, SUIT CDN, common.css)
- `styles/common.css`: 공통 폰트와 기본/내비게이션 스타일
- `styles/index.css`: 메인 페이지 전용 스타일
- `styles/subpage.css`: 서브페이지 예시 전용 스타일

각 HTML의 `<head>`에는 페이지 제목과 아래 스크립트만 둡니다.

```html
<head>
  <title>Page title</title>
  <script src="./js/head.js" data-base="." data-page-css="./styles/index.css"></script>
</head>
```

하위 폴더의 HTML은 `data-base=".."`처럼 상대 경로를 맞춰 사용합니다.


## 공통 서브페이지 헤더
- 스타일: `styles/subpage-header.css`
- 구조 생성: `js/subpage-header.js`
- 각 서브페이지에는 아래처럼 제목만 지정합니다.

```html
<header data-subpage-header data-title="Print Design" data-base=".."></header>
<script src="../js/subpage-header.js"></script>
```

상단 제목이나 Home 버튼 디자인은 `subpage-header.css` 한 파일만 수정하면 모든 서브페이지에 동일하게 반영됩니다.
