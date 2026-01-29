import { useState } from 'react'

function FileLoader({ onLoad }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleClipboardPaste = async () => {
    setError('')
    try {
      const text = await navigator.clipboard.readText()
      if (!text.trim()) {
        setError('Clipboard is empty')
        return
      }
      onLoad(text)
    } catch (err) {
      setError('Failed to read clipboard. Please allow clipboard access.')
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
      onLoad(event.target.result)
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
      onLoad(text)
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
      <button onClick={handleClipboardPaste} className="clipboard-btn">
        Paste
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
