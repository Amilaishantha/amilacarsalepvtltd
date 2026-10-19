import { useEffect, useRef, useState } from 'react'
import { site } from '@/data/site'

export function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.017 1.792-4.684 4.533-4.684 1.312 0 2.686.236 2.686.236v2.954H15.83c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  )
}

/**
 * Homepage panel pointing customers to the company Facebook page,
 * labelled with the wording the showroom asked for.
 */
export default function FacebookOffers() {
  return (
    <section
      style={{
        background: 'var(--dark-2)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '5rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="hero-orb"
        style={{ width: '520px', height: '520px', background: 'rgba(24,119,242,0.10)', top: '-220px', left: '-120px' }}
      />

      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}
      >
        <div>
          <div className="section-tag" style={{ marginBottom: '1rem' }}>Follow Us on Facebook</div>
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              margin: '0 0 1rem',
              lineHeight: 1.1,
            }}
          >
            Special Deals Land on
            <br />
            <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Our Facebook Page</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem', margin: '0 0 2rem' }}>
            Fresh arrivals, price drops and limited-time offers are posted to the {site.name} Facebook page first. Follow
            us so you never miss a deal on your next vehicle.
          </p>

          <a
            href={site.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.7rem',
              background: '#1877F2',
              color: '#fff',
              padding: '1rem 2.2rem',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              boxShadow: '0 10px 30px rgba(24,119,242,0.25)',
            }}
          >
            <FacebookIcon />
            {site.facebookLabel}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <FacebookFeedWindow />
      </div>
    </section>
  )
}

/** Facebook's Page Plugin accepts widths between 180px and 500px. */
const FEED_MIN_WIDTH = 180
const FEED_MAX_WIDTH = 500
const FEED_HEIGHT = 640

function feedSrc(pageUrl: string, width: number) {
  const params = new URLSearchParams({
    href: pageUrl,
    tabs: 'timeline',
    width: String(width),
    height: String(FEED_HEIGHT),
    small_header: 'false',
    adapt_container_width: 'true',
    hide_cover: 'false',
    show_facepile: 'true',
  })
  return `https://www.facebook.com/plugins/page.php?${params}`
}

function videoSrc(videoUrl: string, width: number) {
  const params = new URLSearchParams({ href: videoUrl, width: String(width), show_text: 'false' })
  return `https://www.facebook.com/plugins/video.php?${params}`
}

/**
 * Window showing the live Facebook page timeline — the newest posts and videos
 * appear automatically (videos play inline), so nothing needs updating here.
 */
function FacebookFeedWindow() {
  const bodyRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(FEED_MAX_WIDTH)
  const [tab, setTab] = useState<'posts' | 'videos'>('posts')
  const hasVideos = site.facebookFeaturedVideos.length > 0

  // The plugin renders at a fixed width, so match it to the window on resize.
  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const update = () => {
      const w = Math.round(el.clientWidth)
      setWidth(Math.max(FEED_MIN_WIDTH, Math.min(FEED_MAX_WIDTH, w)))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const tabStyle = (active: boolean): React.CSSProperties => ({
    background: 'none',
    border: 'none',
    borderBottom: `2px solid ${active ? '#1877F2' : 'transparent'}`,
    color: active ? 'var(--text-primary)' : 'var(--text-muted)',
    padding: '0.75rem 0.25rem',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  })

  return (
    <div
      style={{
        background: 'var(--dark-3)',
        border: '1px solid var(--border)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.45)',
        width: '100%',
        maxWidth: `${FEED_MAX_WIDTH + 2}px`,
        justifySelf: 'center',
      }}
    >
      {/* Window title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--dark-4)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => (
            <span key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, display: 'block' }} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#1877F2', fontSize: '0.78rem', fontWeight: 700, flex: 1, minWidth: 0 }}>
          <FacebookIcon size={14} />
          <span style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Latest Posts &amp; Videos
          </span>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: 'var(--crimson)',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--crimson)', display: 'block' }} />
          Live
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1.5rem', padding: '0 1rem', borderBottom: '1px solid var(--border)' }}>
        <button type="button" style={tabStyle(tab === 'posts')} onClick={() => setTab('posts')}>
          Latest Posts
        </button>
        {hasVideos ? (
          <button type="button" style={tabStyle(tab === 'videos')} onClick={() => setTab('videos')}>
            Videos
          </button>
        ) : (
          <a
            href={`${site.facebookUrl}/videos`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...tabStyle(false), textDecoration: 'none' }}
          >
            Videos ↗
          </a>
        )}
      </div>

      <div ref={bodyRef} style={{ position: 'relative', background: '#fff', minHeight: `${FEED_HEIGHT}px` }}>
        {/* Shown if Facebook is blocked (e.g. by a privacy extension) */}
        <a
          href={site.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1877F2',
            fontSize: '0.85rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Loading Facebook posts…
        </a>

        {tab === 'posts' || !hasVideos ? (
          <iframe
            key={width}
            title={`${site.name} latest Facebook posts and videos`}
            src={feedSrc(site.facebookUrl, width)}
            width={width}
            height={FEED_HEIGHT}
            style={{ border: 'none', overflow: 'hidden', display: 'block', position: 'relative', margin: '0 auto' }}
            scrolling="no"
            allowFullScreen
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          />
        ) : (
          <div
            style={{
              position: 'relative',
              height: `${FEED_HEIGHT}px`,
              overflowY: 'auto',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              padding: '1rem 0',
            }}
          >
            {site.facebookFeaturedVideos.map(url => (
              <iframe
                key={`${url}-${width}`}
                title={`${site.name} Facebook video`}
                src={videoSrc(url, width)}
                width={width}
                height={Math.round((width * 9) / 16)}
                style={{ border: 'none', overflow: 'hidden', display: 'block', margin: '0 auto', flexShrink: 0 }}
                scrolling="no"
                allowFullScreen
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            ))}
          </div>
        )}
      </div>

      <a
        href={site.facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          padding: '0.9rem 1rem',
          borderTop: '1px solid var(--border)',
          color: '#1877F2',
          fontSize: '0.78rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          textAlign: 'center',
        }}
      >
        {site.facebookLabel} →
      </a>
    </div>
  )
}
