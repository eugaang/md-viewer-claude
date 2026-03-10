import { useState } from 'react'
import MarkdownViewer from './components/MarkdownViewer'
import FileLoader from './components/FileLoader'

let tabIdCounter = 1

function App() {
  const [tabs, setTabs] = useState([
    { id: 0, name: 'Welcome', content: '', originalContent: null }
  ])
  const [activeTabId, setActiveTabId] = useState(0)

  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0]
  const markdown = activeTab?.content || ''

  const handleLoad = (content, fileName = 'Untitled') => {
    const newTab = {
      id: tabIdCounter++,
      name: fileName.replace(/\.md$/i, ''),
      content,
      originalContent: null
    }
    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTab.id)
  }

  const handleSave = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTab.name}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCloseTab = (tabId, e) => {
    e.stopPropagation()
    if (tabs.length === 1) return

    setTabs(prev => prev.filter(tab => tab.id !== tabId))
    if (activeTabId === tabId) {
      const remainingTabs = tabs.filter(tab => tab.id !== tabId)
      setActiveTabId(remainingTabs[remainingTabs.length - 1].id)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Markdown Viewer</h1>
        <div className="header-actions">
          <FileLoader onLoad={handleLoad} />
          <button onClick={handleSave} className="save-btn" title="Save as .md file">
            Save
          </button>
        </div>
      </header>
      <div className="tabs-bar">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${tab.id === activeTabId ? 'tab-active' : ''}`}
            onClick={() => setActiveTabId(tab.id)}
          >
            <span className="tab-name">{tab.name}</span>
            {tabs.length > 1 && (
              <button
                className="tab-close"
                onClick={(e) => handleCloseTab(tab.id, e)}
                title="Close tab"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      <main className="viewer-container">
        <MarkdownViewer content={markdown} />
      </main>
    </div>
  )
}

export default App