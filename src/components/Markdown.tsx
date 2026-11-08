import type { ReactNode } from 'react'

/**
 * Minimal, safe Markdown renderer for knowledge-centre articles.
 * Supports: ## / ### headings, paragraphs, - and 1. lists, > quotes, | tables |, **bold**, *italic*, [links](url).
 * Never renders raw HTML, so admin-entered content cannot inject scripts.
 */
export function renderInline(text: string, keyPrefix = 'i'): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\))/g
  let last = 0
  let m: RegExpExecArray | null
  let n = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const key = `${keyPrefix}-${n++}`
    if (m[2]) out.push(<strong key={key}>{m[2]}</strong>)
    else if (m[3]) out.push(<em key={key}>{m[3]}</em>)
    else if (m[4]) {
      const href = m[5]
      const safe = /^(https?:\/\/|\/|#|mailto:|tel:)/i.test(href) ? href : '#'
      const external = /^https?:\/\//i.test(safe)
      out.push(
        <a key={key} href={safe} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {m[4]}
        </a>,
      )
    }
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function slugHeading(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let k = 0
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()
    if (!trimmed) {
      i++
      continue
    }
    const key = `b${k++}`
    if (trimmed.startsWith('### ')) {
      const t = trimmed.slice(4)
      blocks.push(<h3 key={key} id={slugHeading(t)}>{renderInline(t, key)}</h3>)
      i++
    } else if (trimmed.startsWith('## ')) {
      const t = trimmed.slice(3)
      blocks.push(<h2 key={key} id={slugHeading(t)}>{renderInline(t, key)}</h2>)
      i++
    } else if (/^[-*] /.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^[-*] /.test(lines[i].trim())) items.push(lines[i++].trim().slice(2))
      blocks.push(<ul key={key}>{items.map((t, j) => <li key={j}>{renderInline(t, `${key}-${j}`)}</li>)}</ul>)
    } else if (/^\d+\. /.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i].trim())) items.push(lines[i++].trim().replace(/^\d+\. /, ''))
      blocks.push(<ol key={key}>{items.map((t, j) => <li key={j}>{renderInline(t, `${key}-${j}`)}</li>)}</ol>)
    } else if (trimmed.startsWith('> ')) {
      const parts: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('> ')) parts.push(lines[i++].trim().slice(2))
      blocks.push(<blockquote key={key}>{renderInline(parts.join(' '), key)}</blockquote>)
    } else if (trimmed.startsWith('|')) {
      const rows: string[][] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i++].trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim())
        if (cells.every(c => /^:?-{2,}:?$/.test(c))) continue
        rows.push(cells)
      }
      const [head, ...body] = rows
      blocks.push(
        <div key={key} className="table-scroll">
          <table>
            <thead><tr>{head.map((c, j) => <th key={j} scope="col">{renderInline(c, `${key}-h${j}`)}</th>)}</tr></thead>
            <tbody>{body.map((r, ri) => <tr key={ri}>{r.map((c, j) => <td key={j}>{renderInline(c, `${key}-${ri}-${j}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      )
    } else {
      const parts: string[] = []
      while (i < lines.length && lines[i].trim() && !/^(#{2,3} |[-*] |\d+\. |> |\|)/.test(lines[i].trim())) parts.push(lines[i++].trim())
      blocks.push(<p key={key}>{renderInline(parts.join(' '), key)}</p>)
    }
  }
  return <div className="prose">{blocks}</div>
}

/** Plain-text extraction for word counts / reading time. */
export function readingMinutes(source: string): number {
  const words = source.replace(/[#>*|[\]()-]/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}
