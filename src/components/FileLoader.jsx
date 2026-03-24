import { useState } from 'react'

function FileLoader({ onLoad }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text.trim()) {
        onLoad(text, 'Clipboard', '[Clipboard]')
        setError('')
      } else {
        setError('Clipboard is empty or contains no text')
      }
    } catch (err) {
      setError('Failed to read from clipboard. Please ensure you have granted clipboard permissions.')
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
      setError('Please select a .md or .markdown file')
      return
    }

    setError('')
    const reader = new FileReader()
    reader.onload = (event) => {
      onLoad(event.target.result, file.name, `[Local] ${file.name}`)
    }
    reader.onerror = () => {
      setError('Failed to read file')
    }
    reader.readAsText(file)
  }

  const handleUrlLoad = async () => {
    if (!url.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const text = await response.text()
      const fileName = url.split('/').pop().split('?')[0] || 'URL'
      onLoad(text, fileName, `[URL] ${url}`)
      setUrl('')
    } catch (err) {
      setError(`Failed to load URL: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUrlLoad()
    }
  }

  return (
    <div className="file-loader">
      <label className="file-input-label">
        <span>Open File</span>
        <input
          type="file"
          accept=".md,.markdown"
          onChange={handleFileChange}
          className="file-input"
        />
      </label>
      <button
        onClick={handlePasteFromClipboard}
        className="clipboard-btn"
      >
        Paste from Clipboard
      </button>
      <div className="url-input-wrapper">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter URL..."
          className="url-input"
        />
        <button
          onClick={handleUrlLoad}
          disabled={loading || !url.trim()}
          className="url-load-btn"
        >
          {loading ? 'Loading...' : 'Load'}
        </button>
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default FileLoader
