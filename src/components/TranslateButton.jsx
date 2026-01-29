import { useState } from 'react'

function TranslateButton({ markdown, onTranslate, hasOriginal, onShowOriginal }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const translateText = async (text, to = 'ko') => {
    // Try serverless function first (Vercel production)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, to }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.translatedText
      }
    } catch {
      // Fall through to direct API call
    }

    // Fallback: direct API call (works in some environments)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
    const response = await fetch(url)
    const data = await response.json()

    return data[0]
      .map(item => item[0])
      .filter(Boolean)
      .join('')
  }

  const handleTranslate = async () => {
    if (!markdown.trim()) return

    setLoading(true)
    setError('')

    try {
      // Split markdown into chunks to avoid API limits
      const chunks = splitText(markdown, 4000)
      const translatedChunks = []

      for (const chunk of chunks) {
        const translated = await translateText(chunk)
        translatedChunks.push(translated)
      }

      onTranslate(translatedChunks.join('\n'))
    } catch (err) {
      console.error('Translation error:', err)
      setError('Translation failed. Try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Split text into chunks while preserving markdown structure
  const splitText = (text, maxLength) => {
    if (text.length <= maxLength) return [text]

    const chunks = []
    const lines = text.split('\n')
    let currentChunk = ''

    for (const line of lines) {
      if ((currentChunk + '\n' + line).length > maxLength) {
        if (currentChunk) chunks.push(currentChunk)
        currentChunk = line
      } else {
        currentChunk = currentChunk ? currentChunk + '\n' + line : line
      }
    }

    if (currentChunk) chunks.push(currentChunk)
    return chunks
  }

  return (
    <div className="translate-wrapper">
      {hasOriginal ? (
        <button
          onClick={onShowOriginal}
          className="original-btn"
          title="Show original"
        >
          Show Original
        </button>
      ) : (
        <button
          onClick={handleTranslate}
          disabled={loading}
          className="translate-btn"
          title="Translate to Korean"
        >
          {loading ? 'Translating...' : 'Translate to KO'}
        </button>
      )}
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default TranslateButton
