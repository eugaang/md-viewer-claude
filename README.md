# Markdown Viewer

웹 기반 마크다운 뷰어입니다.

**Live Demo**: https://md-viewer-claude.vercel.app

## 기능

- **마크다운 렌더링**: GFM(GitHub Flavored Markdown) 지원
- **코드 하이라이팅**: 다양한 언어의 구문 강조
- **파일 로드**: 로컬 파일 선택, URL 입력, 클립보드 붙여넣기
- **한국어 번역**: 영문 마크다운을 한국어로 번역 (원본 보기 지원)
- **다크 모드**: 라이트/다크 테마 전환 (설정 자동 저장)
- **목차(TOC)**: 헤딩 기반 자동 생성, 클릭 시 해당 섹션으로 스크롤

## 사용법

1. **파일 열기**: "Open File" 버튼으로 로컬 .md 파일 선택
2. **URL 로드**: URL 입력 후 "Load" 버튼 클릭
3. **붙여넣기**: "Paste" 버튼 클릭 후 마크다운 내용 붙여넣기
4. **번역**: "Translate to KO" 버튼으로 한국어 번역
5. **원본 보기**: 번역 후 "Show Original" 버튼으로 원본 복원

## 기술 스택

- React 18
- Vite
- react-markdown + remark-gfm
- react-syntax-highlighter
- Vercel Serverless Functions (번역 API)

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 프로젝트 구조

```
src/
├── main.jsx
├── App.jsx
├── App.css
├── components/
│   ├── MarkdownViewer.jsx    # 마크다운 렌더링
│   ├── FileLoader.jsx        # 파일/URL/클립보드 로드
│   ├── TableOfContents.jsx   # 목차
│   ├── ThemeToggle.jsx       # 다크모드 토글
│   └── TranslateButton.jsx   # 번역 버튼
├── styles/
│   └── markdown.css          # 마크다운 스타일
api/
└── translate.js              # 번역 API (Vercel Serverless)
```

## 라이선스

MIT
