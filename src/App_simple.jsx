import { useState } from 'react'
import MarkdownViewer from './components/MarkdownViewer'
import FileLoader from './components/FileLoader'

function App() {
  const [message, setMessage] = useState('앱이 정상적으로 로드되었습니다!')
  const [markdown, setMarkdown] = useState('# 테스트 마크다운\n\n이것은 **테스트**입니다.')

  const handleLoad = (content, fileName) => {
    setMarkdown(content)
    setMessage(`${fileName} 파일이 로드되었습니다.`)
  }

  return (
    <div>
      <h1>Markdown Viewer</h1>
      <p>{message}</p>
      <FileLoader onLoad={handleLoad} />
      <button onClick={() => setMessage('버튼이 클릭되었습니다!')}>테스트 버튼</button>
      <button onClick={() => setMarkdown('# 변경된 마크다운\n\n마크다운이 변경되었습니다!')}>마크다운 변경</button>
      <MarkdownViewer content={markdown} />
    </div>
  )
}

export default App