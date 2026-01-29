import { useState, useEffect } from 'react'
import MarkdownViewer from './components/MarkdownViewer'
import FileLoader from './components/FileLoader'
import TableOfContents from './components/TableOfContents'
import ThemeToggle from './components/ThemeToggle'

const DEFAULT_MARKDOWN = `# Markdown Viewer에 오신 것을 환영합니다!

이 뷰어는 다양한 마크다운 기능을 지원합니다.

## 기능 소개

### 파일 로드
- 로컬 .md 파일을 선택하거나
- URL을 입력하여 마크다운을 불러올 수 있습니다

### 코드 하이라이팅

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
\`\`\`

### GFM 지원

**굵은 텍스트**, *기울임*, ~~취소선~~

- [x] 체크박스 지원
- [ ] 미완료 항목
- [x] 완료 항목

| 헤더 1 | 헤더 2 | 헤더 3 |
|--------|--------|--------|
| 셀 1   | 셀 2   | 셀 3   |
| 셀 4   | 셀 5   | 셀 6   |

### 링크와 이미지

[GitHub](https://github.com)

> 인용문도 지원됩니다.
> 여러 줄 인용도 가능합니다.

---

## 다크 모드

우측 상단의 토글 버튼으로 다크/라이트 모드를 전환할 수 있습니다.

## 목차 기능

좌측의 목차에서 원하는 섹션을 클릭하면 해당 위치로 이동합니다.
`

function App() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Markdown Viewer</h1>
        <div className="header-actions">
          <FileLoader onLoad={setMarkdown} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>
      <div className="main-content">
        <aside className="sidebar">
          <TableOfContents markdown={markdown} />
        </aside>
        <main className="viewer-container">
          <MarkdownViewer content={markdown} />
        </main>
      </div>
    </div>
  )
}

export default App
