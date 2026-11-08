import { useRef, useState } from 'react'
import { saveEnquiry } from '@/lib/vehicle-fns'
import { site, absoluteUrl, whatsappLink } from '@/data/site'
import { track } from '@/lib/analytics'
import { WhatsAppIcon } from '@/components/ui'
import {
  formatEngine,
  formatMileage,
  formatPrice,
  hasValidPrice,
  optimizedImage,
  vehicleAlt,
  vehicleFullName,
  vehiclePath,
  type VehicleRow,
} from '@/lib/vehicle-utils'

/** Builds the WhatsApp message the owner receives — full vehicle spec, photo link and customer details. */
function buildWhatsAppText(vehicle: VehicleRow, name: string, phone: string, message: string, reserve: boolean): string {
  const lines = [
    reserve ? '*VEHICLE RESERVATION REQUEST*' : '*NEW VEHICLE ENQUIRY*',
    `_${site.name}_`,
    '',
    '*— Vehicle —*',
    `*Vehicle:* ${vehicleFullName(vehicle)}`,
    `*Stock ID:* #${vehicle.id}`,
    `*Price:* ${formatPrice(vehicle)}`,
    `*Grade:* ${vehicle.grade?.trim() || '—'}`,
    ...(vehicle.auctionGrade ? [`*Auction grade:* ${vehicle.auctionGrade}`] : []),
    `*Body Type:* ${vehicle.type}`,
    `*Fuel:* ${vehicle.fuel}`,
    `*Engine:* ${formatEngine(vehicle)}`,
    `*Transmission:* ${vehicle.transmission}`,
    `*Mileage:* ${formatMileage(vehicle)}`,
    `*Colour:* ${vehicle.color || '—'}`,
    `*Status:* ${vehicle.status}`,
    '',
    '*— Photo —*',
    absoluteUrl(vehicle.image),
    '',
    '*— Listing —*',
    absoluteUrl(vehiclePath(vehicle)),
    '',
    '*— Customer —*',
    `*Name:* ${name.trim()}`,
    `*Phone:* ${phone.trim()}`,
    `*Message:* ${message.trim() || 'No additional message'}`,
  ]
  return lines.join('\n')
}

export function fieldStyle(extra?: React.CSSProperties): React.CSSProperties {
  return {
    width: '100%',
    background: 'var(--dark-3)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    padding: '0.75rem 0.9rem',
    fontSize: '16px', // ≥16px stops iOS zooming into the field
    fontFamily: 'inherit',
    outline: 'none',
    borderRadius: 0,
    ...extra,
  }
}

export function labelStyle(): React.CSSProperties {
  return {
    fontSize: '0.66rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    display: 'block',
    marginBottom: '0.35rem',
  }
}

/** Hidden honeypot input — bots fill it, people never see it. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={e => onChange(e.target.value)} />
      </label>
    </div>
  )
}

export function validatePhone(phone: string): boolean {
  return phone.replace(/\D/g, '').length >= 9 && /^[+\d\s()-]+$/.test(phone.trim())
}

export default function VehicleEnquiryForm({ vehicle }: { vehicle: VehicleRow }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [reserve, setReserve] = useState(vehicle.status === 'Available')
  const [hp, setHp] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sentLink, setSentLink] = useState('')
  const openedAt = useRef(Date.now())

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (name.trim().length < 2 || !phone.trim()) {
      setError('Please enter your name and phone number.')
      return
    }
    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number, e.g. 077 123 4567.')
      return
    }

    const waUrl = whatsappLink(buildWhatsAppText(vehicle, name, phone, message, reserve))

    setSending(true)
    try {
      await saveEnquiry({
        data: {
          vehicleId: vehicle.id,
          vehicleTitle: `${reserve ? '[Reservation] ' : ''}${vehicleFullName(vehicle)}`,
          vehicleImage: absoluteUrl(vehicle.image),
          vehiclePrice: hasValidPrice(vehicle) ? vehicle.price : null,
          customerName: name,
          customerPhone: phone,
          customerMessage: message,
          source: 'vehicle',
          website: hp,
          elapsedMs: Date.now() - openedAt.current,
        },
      })
    } catch {
      // Recording the enquiry is a convenience — never block the WhatsApp hand-off.
    }
    track('vehicle_enquiry_submit', { vehicle_id: vehicle.id, reservation: reserve })
    setSending(false)
    setSentLink(waUrl)
    window.open(waUrl, '_blank', 'noopener,noreferrer')
  }

  if (sentLink) {
    return (
      <div style={{ background: 'var(--dark-2)', border: '1px solid rgba(31,175,85,0.4)', padding: '1.75rem' }} role="status">
        <div style={{ color: '#25D366', marginBottom: '0.75rem' }}>
          <WhatsAppIcon size={28} />
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>WhatsApp is opening…</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 1.25rem' }}>
          Your {reserve ? 'reservation request' : 'enquiry'} for the {vehicleFullName(vehicle)} is ready in WhatsApp with the full vehicle details and photo. Just press{' '}
          <strong style={{ color: 'var(--text-primary)' }}>send</strong> and we will reply shortly.
        </p>
        <a href={sentLink} target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ width: '100%' }}>
          <WhatsAppIcon />
          Open WhatsApp again
        </a>
        <button
          type="button"
          onClick={() => {
            setSentLink('')
            setName('')
            setPhone('')
            setMessage('')
            openedAt.current = Date.now()
          }}
          style={{ marginTop: '0.85rem', width: '100%', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '1.6rem', position: 'relative' }} noValidate>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.4rem' }}>
        {vehicle.status === 'Available' ? 'Enquire or reserve this vehicle' : 'Enquire about this vehicle'}
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.6, margin: '0 0 1.1rem' }}>
        Send your details and this vehicle’s full specification straight to our WhatsApp.
      </p>

      <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', background: 'var(--dark-3)', border: '1px solid var(--border)', padding: '0.7rem', marginBottom: '1.1rem' }}>
        <img src={optimizedImage(vehicle.image, 160, 112)} alt={vehicleAlt(vehicle)} width={76} height={54} loading="lazy" style={{ width: '76px', height: '54px', objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{vehicleFullName(vehicle)}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--gold-light)', marginTop: '0.15rem' }}>{formatPrice(vehicle)}</div>
        </div>
      </div>

      <Honeypot value={hp} onChange={setHp} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        <div>
          <label style={labelStyle()} htmlFor="enq-name">Your name</label>
          <input id="enq-name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Nimal Perera" required maxLength={120} style={fieldStyle()} />
        </div>
        <div>
          <label style={labelStyle()} htmlFor="enq-phone">Your phone / WhatsApp</label>
          <input id="enq-phone" type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 077 123 4567" inputMode="tel" required maxLength={40} style={fieldStyle()} />
        </div>
        <div>
          <label style={labelStyle()} htmlFor="enq-message">Message (optional)</label>
          <textarea id="enq-message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Is the price negotiable? Can I arrange a viewing this weekend?" rows={3} maxLength={1500} style={fieldStyle({ resize: 'vertical' })} />
        </div>
        {vehicle.status === 'Available' && (
          <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.86rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <input type="checkbox" checked={reserve} onChange={e => setReserve(e.target.checked)} style={{ accentColor: 'var(--gold)', width: '16px', height: '16px' }} />
            I would like to reserve this vehicle
          </label>
        )}
      </div>

      {error && <div role="alert" style={{ color: '#fca5a5', fontSize: '0.82rem', marginTop: '0.85rem' }}>{error}</div>}

      <button type="submit" disabled={sending} className="btn-wa" style={{ marginTop: '1.2rem', width: '100%', cursor: sending ? 'wait' : 'pointer', opacity: sending ? 0.7 : 1 }}>
        <WhatsAppIcon />
        {sending ? 'Preparing…' : reserve ? 'Send reservation request' : 'Send enquiry on WhatsApp'}
      </button>

      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '0.7rem', lineHeight: 1.5 }}>
        Opens WhatsApp with the vehicle details already written for you.
      </div>
    </form>
  )
}
