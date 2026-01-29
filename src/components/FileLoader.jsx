import { useState, useRef, forwardRef, useImperativeHandle } from 'react'

const FileLoader = forwardRef(function FileLoader({ onLoad, onFileHandleChange, onFileNameChange }, ref) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPasteArea, setShowPasteArea] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [currentFileName, setCurrentFileName] = useState('')
  const fileHandleRef = useRef(null)
  const fileInputRef = useRef(null)

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    openFilePicker: () => {
      if (supportsFileSystemAccess) {
        handleOpenWithFileSystemAccess()
      } else {
        fileInputRef.current?.click()
      }
    }
  }))

  const handlePasteSubmit = () => {
    if (!pasteText.trim()) {
      setError('Please paste some content')
      return
    }
    fileHandleRef.current = null
    setCurrentFileName('')
    onFileHandleChange?.(null)
    onFileNameChange?.(null)
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

  // Check if File System Access API is supported
  const supportsFileSystemAccess = 'showOpenFilePicker' in window

  const handleOpenWithFileSystemAccess = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'Markdown files',
            accept: {
              'text/markdown': ['.md', '.markdown'],
            },
          },
        ],
      })

      const file = await fileHandle.getFile()
      const content = await file.text()

      fileHandleRef.current = fileHandle
      setCurrentFileName(file.name)
      onFileHandleChange?.(fileHandle)
      onFileNameChange?.(file.name)
      onLoad(content)
      setError('')
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(`Failed to open file: ${err.message}`)
      }
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
    fileHandleRef.current = null
    setCurrentFileName(file.name)
    onFileHandleChange?.(null)
    onFileNameChange?.(file.name)

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
      fileHandleRef.current = null
      setCurrentFileName('')
      onFileHandleChange?.(null)
      onFileNameChange?.(null)
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
      {supportsFileSystemAccess ? (
        <button onClick={handleOpenWithFileSystemAccess} className="file-input-label">
          Open File
        </button>
      ) : (
        <label className="file-input-label">
          <span>Open File</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown"
            onChange={handleFileChange}
            className="file-input"
          />
        </label>
      )}
      {currentFileName && (
        <span className="current-file-name" title={currentFileName}>
          {currentFileName}
        </span>
      )}
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
})

export default FileLoader
