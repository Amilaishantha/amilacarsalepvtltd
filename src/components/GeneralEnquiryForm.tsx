import { useRef, useState } from 'react'
import { saveEnquiry } from '@/lib/vehicle-fns'
import { site, whatsappLink } from '@/data/site'
import { track } from '@/lib/analytics'
import { WhatsAppIcon } from '@/components/ui'
import { Honeypot, fieldStyle, labelStyle, validatePhone } from '@/components/VehicleEnquiryForm'

type Source = 'contact' | 'import-request' | 'tax-calculator'

/**
 * General enquiry form (contact page, import requests, tax-calculator quotes).
 * Saves the enquiry for the admin dashboard, then opens WhatsApp pre-filled — same flow as vehicle enquiries.
 */
export default function GeneralEnquiryForm({
  source,
  heading,
  intro,
  context,
  showVehicleField = false,
  messagePlaceholder = 'How can we help?',
}: {
  source: Source
  heading: string
  intro?: string
  /** Extra lines appended to the WhatsApp message (e.g. a tax calculation summary). */
  context?: string
  showVehicleField?: boolean
  messagePlaceholder?: string
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [wanted, setWanted] = useState('')
  const [message, setMessage] = useState('')
  const [hp, setHp] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sentLink, setSentLink] = useState('')
  const openedAt = useRef(Date.now())

  const title =
    source === 'import-request' ? 'IMPORT REQUEST' : source === 'tax-calculator' ? 'IMPORT TAX QUOTE REQUEST' : 'NEW ENQUIRY'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (name.trim().length < 2) return setError('Please enter your name.')
    if (!validatePhone(phone)) return setError('Please enter a valid phone number, e.g. 077 123 4567.')
    if (showVehicleField && !wanted.trim() && !message.trim()) return setError('Tell us which vehicle you are looking for.')

    const text = [
      `*${title}*`,
      `_${site.name}_`,
      '',
      ...(wanted.trim() ? [`*Vehicle wanted:* ${wanted.trim()}`] : []),
      ...(context ? ['', context, ''] : []),
      `*Name:* ${name.trim()}`,
      `*Phone:* ${phone.trim()}`,
      `*Message:* ${message.trim() || '—'}`,
    ].join('\n')
    const waUrl = whatsappLink(text)

    setSending(true)
    try {
      await saveEnquiry({
        data: {
          vehicleId: null,
          vehicleTitle: (wanted.trim() || (source === 'tax-calculator' ? 'Import tax quote' : source === 'import-request' ? 'Import request' : 'General enquiry')).slice(0, 300),
          vehicleImage: '',
          vehiclePrice: null,
          customerName: name,
          customerPhone: phone,
          customerMessage: [message.trim(), context ? `\n${context}` : ''].join('').slice(0, 1500),
          source,
          website: hp,
          elapsedMs: Date.now() - openedAt.current,
        },
      })
    } catch { /* never block the WhatsApp hand-off */ }
    track(source === 'contact' ? 'contact_form_submit' : 'import_request_submit', { form_source: source })
    setSending(false)
    setSentLink(waUrl)
    window.open(waUrl, '_blank', 'noopener,noreferrer')
  }

  if (sentLink) {
    return (
      <div className="card" role="status" style={{ borderColor: 'rgba(31,175,85,0.4)' }}>
        <div style={{ color: '#25D366', marginBottom: '0.75rem' }}><WhatsAppIcon size={28} /></div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Thank you — WhatsApp is opening</div>
        <p className="muted" style={{ fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 1.2rem' }}>
          Your message is ready in WhatsApp. Press <strong style={{ color: '#fff' }}>send</strong> and our team will reply shortly. You can also call us on {site.phoneDisplay}.
        </p>
        <a href={sentLink} target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ width: '100%' }}>
          <WhatsAppIcon /> Open WhatsApp again
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ position: 'relative' }} noValidate>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.4rem' }}>{heading}</h2>
      {intro && <p className="muted" style={{ fontSize: '0.86rem', lineHeight: 1.6, margin: '0 0 1.1rem' }}>{intro}</p>}
      <Honeypot value={hp} onChange={setHp} />
      <div style={{ display: 'grid', gap: '0.9rem' }}>
        <div>
          <label style={labelStyle()} htmlFor={`${source}-name`}>Your name</label>
          <input id={`${source}-name`} autoComplete="name" value={name} onChange={e => setName(e.target.value)} required maxLength={120} style={fieldStyle()} />
        </div>
        <div>
          <label style={labelStyle()} htmlFor={`${source}-phone`}>Phone / WhatsApp</label>
          <input id={`${source}-phone`} type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="077 123 4567" required maxLength={40} style={fieldStyle()} />
        </div>
        {showVehicleField && (
          <div>
            <label style={labelStyle()} htmlFor={`${source}-wanted`}>Vehicle you want (make, model, year, budget)</label>
            <input id={`${source}-wanted`} value={wanted} onChange={e => setWanted(e.target.value)} placeholder="e.g. Toyota Raize Z 2023, white, under Rs. 10M" maxLength={200} style={fieldStyle()} />
          </div>
        )}
        <div>
          <label style={labelStyle()} htmlFor={`${source}-msg`}>Message {showVehicleField ? '(optional)' : ''}</label>
          <textarea id={`${source}-msg`} value={message} onChange={e => setMessage(e.target.value)} rows={4} maxLength={1200} placeholder={messagePlaceholder} style={fieldStyle({ resize: 'vertical' })} />
        </div>
      </div>
      {error && <div role="alert" style={{ color: '#fca5a5', fontSize: '0.82rem', marginTop: '0.85rem' }}>{error}</div>}
      <button type="submit" disabled={sending} className="btn-wa" style={{ marginTop: '1.2rem', width: '100%', opacity: sending ? 0.7 : 1 }}>
        <WhatsAppIcon /> {sending ? 'Preparing…' : 'Send on WhatsApp'}
      </button>
      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '0.7rem' }}>
        We save your enquiry so our team can follow up, then open WhatsApp for you.
      </div>
    </form>
  )
}
