import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import '../styles/markdown.css'

function MarkdownViewer({ content }) {
  const theme = document.documentElement.getAttribute('data-theme')
  const codeTheme = theme === 'dark' ? oneDark : oneLight

  const generateId = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s가-힣-]/g, '')
      .replace(/\s+/g, '-')
  }

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                style={codeTheme}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          h1({ children, ...props }) {
            const id = generateId(String(children))
            return <h1 id={id} {...props}>{children}</h1>
          },
          h2({ children, ...props }) {
            const id = generateId(String(children))
            return <h2 id={id} {...props}>{children}</h2>
          },
          h3({ children, ...props }) {
            const id = generateId(String(children))
            return <h3 id={id} {...props}>{children}</h3>
          },
          h4({ children, ...props }) {
            const id = generateId(String(children))
            return <h4 id={id} {...props}>{children}</h4>
          },
          h5({ children, ...props }) {
            const id = generateId(String(children))
            return <h5 id={id} {...props}>{children}</h5>
          },
          h6({ children, ...props }) {
            const id = generateId(String(children))
            return <h6 id={id} {...props}>{children}</h6>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownViewer
