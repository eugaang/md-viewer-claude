export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, to = 'ko' } = req.body

  if (!text) {
    return res.status(400).json({ error: 'Text is required' })
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${to}&dt=t&q=${encodeURIComponent(text)}`

    const response = await fetch(url)
    const data = await response.json()

    // Extract translated text from response
    const translatedText = data[0]
      .map(item => item[0])
      .filter(Boolean)
      .join('')

    res.status(200).json({ translatedText })
  } catch (error) {
    console.error('Translation error:', error)
    res.status(500).json({ error: 'Translation failed' })
  }
}
