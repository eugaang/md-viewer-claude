import { useMemo } from 'react'

function TableOfContents({ markdown }) {
  const headings = useMemo(() => {
    const lines = markdown.split('\n')
    const result = []
    let inCodeBlock = false

    for (const line of lines) {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock
        continue
      }

      if (inCodeBlock) continue

      const match = line.match(/^(#{1,3})\s+(.+)$/)
      if (match) {
        const level = match[1].length
        const text = match[2].trim()
        const id = text
          .toLowerCase()
          .replace(/[^\w\s가-힣-]/g, '')
          .replace(/\s+/g, '-')

        result.push({ level, text, id })
      }
    }

    return result
  }, [markdown])

  const handleClick = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (headings.length === 0) {
    return (
      <nav className="toc">
        <h2>Table of Contents</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          No headings found
        </p>
      </nav>
    )
  }

  return (
    <nav className="toc">
      <h2>Table of Contents</h2>
      <ul className="toc-list">
        {headings.map((heading, index) => (
          <li key={index} className="toc-item">
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`toc-link toc-level-${heading.level}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TableOfContents
