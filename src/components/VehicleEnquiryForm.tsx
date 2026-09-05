import { useState } from 'react'
import { saveEnquiry, type VehicleRow } from '@/lib/vehicle-fns'
import { site, absoluteUrl } from '@/data/site'

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

/** Builds the WhatsApp message the owner receives — full vehicle spec, photo link and customer details. */
function buildWhatsAppText(vehicle: VehicleRow, name: string, phone: string, message: string): string {
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`
  const engine = vehicle.engineCC
    ? `${vehicle.engineCC.toLocaleString()}cc`
    : vehicle.motorKW
      ? `${vehicle.motorKW}kW electric motor`
      : '—'

  const lines = [
    '*NEW VEHICLE ENQUIRY*',
    `_${site.name}_`,
    '',
    '*— Vehicle —*',
    `*Vehicle:* ${title}`,
    `*Stock ID:* #${vehicle.id}`,
    `*Price:* Rs. ${vehicle.price.toLocaleString('en-LK')}`,
    `*Grade:* ${vehicle.grade || '—'}`,
    `*Body Type:* ${vehicle.type}`,
    `*Fuel:* ${vehicle.fuel}`,
    `*Engine:* ${engine}`,
    `*Transmission:* ${vehicle.transmission}`,
    `*Mileage:* ${vehicle.mileage.toLocaleString()} km`,
    `*Colour:* ${vehicle.color}`,
    `*Status:* ${vehicle.status}`,
    '',
    '*— Photo —*',
    absoluteUrl(vehicle.image),
    '',
    '*— Listing —*',
    absoluteUrl(`/marketplace/${vehicle.id}`),
    '',
    '*— Customer —*',
    `*Name:* ${name.trim()}`,
    `*Phone:* ${phone.trim()}`,
    `*Message:* ${message.trim() || 'No additional message'}`,
  ]

  return lines.join('\n')
}

function fieldStyle(extra?: React.CSSProperties): React.CSSProperties {
  return {
    width: '100%',
    background: 'var(--dark-3)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    padding: '0.7rem 0.9rem',
    fontSize: '0.85rem',
    fontFamily: 'inherit',
    outline: 'none',
    borderRadius: 0,
    ...extra,
  }
}

function labelStyle(): React.CSSProperties {
  return {
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    display: 'block',
    marginBottom: '0.35rem',
  }
}

export default function VehicleEnquiryForm({ vehicle }: { vehicle: VehicleRow }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sentLink, setSentLink] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim() || !phone.trim()) {
      setError('Please enter your name and phone number.')
      return
    }

    const waUrl = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
      buildWhatsAppText(vehicle, name, phone, message)
    )}`

    setSending(true)
    try {
      await saveEnquiry({
        data: {
          vehicleId: vehicle.id,
          vehicleTitle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          vehicleImage: absoluteUrl(vehicle.image),
          vehiclePrice: vehicle.price,
          customerName: name,
          customerPhone: phone,
          customerMessage: message,
        },
      })
    } catch {
      // Recording the enquiry is a convenience — never block the WhatsApp hand-off.
    }
    setSending(false)
    setSentLink(waUrl)
    window.open(waUrl, '_blank', 'noopener,noreferrer')
  }

  if (sentLink) {
    return (
      <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(37,211,102,0.35)', padding: '1.75rem' }}>
        <div style={{ color: '#25D366', marginBottom: '0.75rem' }}>
          <WhatsAppIcon size={28} />
        </div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          WhatsApp is opening…
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7, margin: '0 0 1.25rem' }}>
          Your enquiry for the {vehicle.year} {vehicle.make} {vehicle.model} is ready in WhatsApp with the full vehicle
          details and photo. Just press <strong style={{ color: 'var(--text-primary)' }}>send</strong> and we will reply
          shortly.
        </p>
        <a
          href={sentLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            background: '#25D366',
            color: '#fff',
            padding: '0.9rem 1.5rem',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.82rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <WhatsAppIcon />
          Open WhatsApp Again
        </a>
        <button
          type="button"
          onClick={() => {
            setSentLink('')
            setName('')
            setPhone('')
            setMessage('')
          }}
          style={{
            marginTop: '0.85rem',
            width: '100%',
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            fontSize: '0.78rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '1.75rem' }}
    >
      <div className="section-tag" style={{ marginBottom: '0.6rem' }}>Enquire About This Vehicle</div>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
        Send your details and this vehicle's full specification straight to our WhatsApp.
      </p>

      {/* Vehicle being enquired about — shown so the customer knows exactly what is sent */}
      <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', background: 'var(--dark-3)', border: '1px solid var(--border)', padding: '0.7rem', marginBottom: '1.25rem' }}>
        <img
          src={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          style={{ width: '76px', height: '54px', objectFit: 'cover', flexShrink: 0 }}
        />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold)', marginTop: '0.15rem' }}>
            Rs. {vehicle.price.toLocaleString('en-LK')}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        <div>
          <label style={labelStyle()} htmlFor="enq-name">Your Name</label>
          <input
            id="enq-name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Nimal Perera"
            required
            style={fieldStyle()}
          />
        </div>

        <div>
          <label style={labelStyle()} htmlFor="enq-phone">Your Phone / WhatsApp</label>
          <input
            id="enq-phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="e.g. 077 123 4567"
            inputMode="tel"
            required
            style={fieldStyle()}
          />
        </div>

        <div>
          <label style={labelStyle()} htmlFor="enq-message">Your Message (optional)</label>
          <textarea
            id="enq-message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Is the price negotiable? Can I arrange a viewing this weekend?"
            rows={3}
            style={fieldStyle({ resize: 'vertical' })}
          />
        </div>
      </div>

      {error && (
        <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.85rem' }}>{error}</div>
      )}

      <button
        type="submit"
        disabled={sending}
        style={{
          marginTop: '1.25rem',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          background: '#25D366',
          color: '#fff',
          border: 'none',
          padding: '0.95rem 1.5rem',
          fontWeight: 700,
          fontSize: '0.82rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          fontFamily: 'inherit',
          cursor: sending ? 'wait' : 'pointer',
          opacity: sending ? 0.7 : 1,
        }}
      >
        <WhatsAppIcon />
        {sending ? 'Preparing…' : 'Send Enquiry on WhatsApp'}
      </button>

      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '0.7rem', lineHeight: 1.5 }}>
        Opens WhatsApp with the vehicle details and photo already written for you.
      </div>
    </form>
  )
}
