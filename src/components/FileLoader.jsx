import { useState } from 'react'

function FileLoader({ onLoad }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPasteArea, setShowPasteArea] = useState(false)
  const [pasteText, setPasteText] = useState('')

  const handlePasteSubmit = () => {
    if (!pasteText.trim()) {
      setError('Please paste some content')
      return
    }
    onLoad(pasteText)
    setPasteText('')
    setShowPasteArea(false)
    setError('')
  }

  const handlePasteKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowPasteArea(false)
      setPasteText('')
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
      <button
        onClick={() => setShowPasteArea(!showPasteArea)}
        className={`clipboard-btn ${showPasteArea ? 'active' : ''}`}
      >
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

      {showPasteArea && (
        <div className="paste-modal">
          <div className="paste-modal-content">
            <div className="paste-modal-header">
              <span>Paste Markdown</span>
              <button
                onClick={() => { setShowPasteArea(false); setPasteText(''); }}
                className="paste-modal-close"
              >
                ×
              </button>
            </div>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              onKeyDown={handlePasteKeyDown}
              placeholder="Paste your markdown here (Ctrl+V / Cmd+V)..."
              className="paste-textarea"
              autoFocus
            />
            <div className="paste-modal-actions">
              <button onClick={handlePasteSubmit} className="paste-submit-btn">
                Load Markdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileLoader
