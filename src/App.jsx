import { useState, useEffect, useRef, useCallback } from 'react'
import MarkdownViewer from './components/MarkdownViewer'
import FileLoader from './components/FileLoader'
import TableOfContents from './components/TableOfContents'
import ThemeToggle from './components/ThemeToggle'
import TranslateButton from './components/TranslateButton'

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
  const [originalMarkdown, setOriginalMarkdown] = useState(null)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || 'light'
  })
  const [sidebarVisible, setSidebarVisible] = useState(() => {
    const saved = localStorage.getItem('sidebarVisible')
    return saved !== 'false'
  })
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth')
    return saved ? parseInt(saved, 10) : 280
  })
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef(null)

  const handleLoad = (content) => {
    setMarkdown(content)
    setOriginalMarkdown(null) // Reset original when new content is loaded
  }

  const handleTranslate = (translated) => {
    if (!originalMarkdown) {
      setOriginalMarkdown(markdown) // Save original before translating
    }
    setMarkdown(translated)
  }

  const handleShowOriginal = () => {
    if (originalMarkdown) {
      setMarkdown(originalMarkdown)
      setOriginalMarkdown(null)
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const toggleSidebar = () => {
    setSidebarVisible(prev => {
      localStorage.setItem('sidebarVisible', !prev)
      return !prev
    })
  }

  const startResizing = useCallback((e) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback((e) => {
    if (isResizing && sidebarRef.current) {
      const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left
      if (newWidth >= 180 && newWidth <= 500) {
        setSidebarWidth(newWidth)
        localStorage.setItem('sidebarWidth', newWidth)
      }
    }
  }, [isResizing])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResizing)
    }
    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing, resize, stopResizing])

  return (
    <div className="app">
      <header className="header">
        <h1>Markdown Viewer</h1>
        <div className="header-actions">
          <FileLoader onLoad={handleLoad} />
          <TranslateButton
            markdown={markdown}
            onTranslate={handleTranslate}
            hasOriginal={!!originalMarkdown}
            onShowOriginal={handleShowOriginal}
          />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>
      <div className={`main-content ${isResizing ? 'is-resizing' : ''}`}>
        <button
          className={`sidebar-toggle ${sidebarVisible ? '' : 'sidebar-hidden'}`}
          onClick={toggleSidebar}
          title={sidebarVisible ? 'Hide Table of Contents' : 'Show Table of Contents'}
        >
          {sidebarVisible ? '◀' : '▶'}
        </button>
        {sidebarVisible && (
          <aside
            className="sidebar"
            ref={sidebarRef}
            style={{ width: sidebarWidth, minWidth: sidebarWidth }}
          >
            <TableOfContents markdown={markdown} />
            <div
              className="sidebar-resizer"
              onMouseDown={startResizing}
            />
          </aside>
        )}
        <main className="viewer-container">
          <MarkdownViewer content={markdown} />
        </main>
      </div>
    </div>
  )
}

export default App
