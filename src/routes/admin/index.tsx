import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  fetchVehicles,
  addVehicle,
  deleteVehicle,
  updateVehicleStatus,
  verifyAdminKey,
  type VehicleRow,
  type NewVehicle,
} from '@/lib/vehicle-fns'

export const Route = createFileRoute('/admin/')({
  component: AdminPage,
})

const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid']
const BODY_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Van', 'Pickup', 'Coupe', 'Wagon']
const TRANSMISSIONS = ['Automatic', 'Manual', 'CVT']
const STATUSES = ['Available', 'Reserved', 'Sold']

const emptyForm: NewVehicle = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  type: 'SUV',
  fuel: 'Hybrid',
  engineCC: null,
  motorKW: null,
  mileage: 0,
  color: '',
  transmission: 'Automatic',
  price: 0,
  image: '/placeholder.png',
  features: [],
  description: '',
  status: 'Available',
  grade: '',
}

function inputStyle(extra?: React.CSSProperties): React.CSSProperties {
  return {
    width: '100%',
    background: 'var(--dark-3)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    padding: '0.6rem 0.85rem',
    fontSize: '0.85rem',
    outline: 'none',
    ...extra,
  }
}

function labelStyle(): React.CSSProperties {
  return {
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: 'var(--gold)',
    display: 'block',
    marginBottom: '0.35rem',
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle()}>{label}</label>
      {children}
    </div>
  )
}

function AdminPage() {
  const [adminKey, setAdminKey] = useState('')
  const [keyInput, setKeyInput] = useState('')
  const [authError, setAuthError] = useState('')
  const [isAuthed, setIsAuthed] = useState(false)

  const [vehicles, setVehicles] = useState<VehicleRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<NewVehicle>(emptyForm)
  const [featuresInput, setFeaturesInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [statusChanging, setStatusChanging] = useState<number | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_key')
    if (stored) {
      setAdminKey(stored)
      setIsAuthed(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthed) loadVehicles()
  }, [isAuthed])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    try {
      const result = await verifyAdminKey({ data: { adminKey: keyInput } })
      if (result.valid) {
        sessionStorage.setItem('admin_key', keyInput)
        setAdminKey(keyInput)
        setIsAuthed(true)
      } else {
        setAuthError('Incorrect admin key. Check your ADMIN_KEY environment variable.')
      }
    } catch {
      setAuthError('Failed to verify. Ensure ADMIN_KEY is set in Netlify environment variables.')
    }
  }

  async function loadVehicles() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchVehicles()
      setVehicles(data)
    } catch (err) {
      setError('Failed to load vehicles.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Remove this vehicle from the marketplace?')) return
    setDeletingId(id)
    setError('')
    try {
      await deleteVehicle({ data: { adminKey, id } })
      setVehicles(prev => prev.filter(v => v.id !== id))
      setSuccess('Vehicle removed.')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to remove vehicle. Check admin key.')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleStatusChange(id: number, status: string) {
    setStatusChanging(id)
    setError('')
    try {
      const updated = await updateVehicleStatus({ data: { adminKey, id, status } })
      setVehicles(prev => prev.map(v => v.id === id ? updated : v))
      setSuccess(`Status updated to ${status}.`)
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to update status.')
    } finally {
      setStatusChanging(null)
    }
  }

  async function handleAddVehicle(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const features = featuresInput.split('\n').map(s => s.trim()).filter(Boolean)
    try {
      const created = await addVehicle({ data: { adminKey, vehicle: { ...form, features } } })
      setVehicles(prev => [created, ...prev])
      setForm(emptyForm)
      setFeaturesInput('')
      setShowForm(false)
      setSuccess('Vehicle added to marketplace.')
      setTimeout(() => setSuccess(''), 4000)
    } catch {
      setError('Failed to add vehicle. Check admin key.')
    } finally {
      setSubmitting(false)
    }
  }

  function updateForm(key: keyof NewVehicle, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  if (!isAuthed) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <div className="section-tag" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>Restricted Area</div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Enter the admin key set in your Netlify environment variables.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Field label="Admin Key">
              <input
                type="password"
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                placeholder="Enter ADMIN_KEY value"
                required
                autoFocus
                style={inputStyle()}
              />
            </Field>
            {authError && (
              <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>{authError}</p>
            )}
            <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
              Sign In
            </button>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', margin: 0, lineHeight: 1.6 }}>
              Set <code style={{ background: 'var(--dark-3)', padding: '0 4px', color: 'var(--gold)' }}>ADMIN_KEY</code> in your Netlify site → Site configuration → Environment variables.
            </p>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', padding: '2.5rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div className="section-tag" style={{ marginBottom: '0.5rem' }}>Amila Car Sale</div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, margin: 0 }}>
              Marketplace Dashboard
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-gold"
              style={{ fontSize: '0.8rem', padding: '0.65rem 1.25rem' }}
            >
              {showForm ? '✕ Cancel' : '+ Add Vehicle'}
            </button>
            <button
              onClick={() => { sessionStorage.removeItem('admin_key'); setIsAuthed(false); setAdminKey('') }}
              className="btn-outline"
              style={{ fontSize: '0.78rem', padding: '0.55rem 1rem' }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Notifications */}
        {success && (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', padding: '0.75rem 1rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {success}
          </div>
        )}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '0.75rem 1rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {/* Add Vehicle Form */}
        {showForm && (
          <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '2rem', marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 1.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              Add New Vehicle
            </h2>
            <form onSubmit={handleAddVehicle}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <Field label="Make">
                  <input type="text" required value={form.make} onChange={e => updateForm('make', e.target.value)} placeholder="Toyota" style={inputStyle()} />
                </Field>
                <Field label="Model">
                  <input type="text" required value={form.model} onChange={e => updateForm('model', e.target.value)} placeholder="Land Cruiser Prado" style={inputStyle()} />
                </Field>
                <Field label="Grade">
                  <input type="text" value={form.grade} onChange={e => updateForm('grade', e.target.value)} placeholder="TX-L" style={inputStyle()} />
                </Field>
                <Field label="Year">
                  <input type="number" required min={1990} max={2030} value={form.year} onChange={e => updateForm('year', parseInt(e.target.value))} style={inputStyle()} />
                </Field>
                <Field label="Body Type">
                  <select value={form.type} onChange={e => updateForm('type', e.target.value)} style={inputStyle()}>
                    {BODY_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Fuel Type">
                  <select value={form.fuel} onChange={e => updateForm('fuel', e.target.value)} style={inputStyle()}>
                    {FUEL_TYPES.map(f => <option key={f}>{f}</option>)}
                  </select>
                </Field>
                <Field label="Engine CC (leave blank for EV)">
                  <input type="number" min={0} value={form.engineCC ?? ''} onChange={e => updateForm('engineCC', e.target.value ? parseInt(e.target.value) : null)} placeholder="1500" style={inputStyle()} />
                </Field>
                <Field label="Motor kW (EV only)">
                  <input type="number" min={0} value={form.motorKW ?? ''} onChange={e => updateForm('motorKW', e.target.value ? parseInt(e.target.value) : null)} placeholder="160" style={inputStyle()} />
                </Field>
                <Field label="Mileage (km)">
                  <input type="number" required min={0} value={form.mileage} onChange={e => updateForm('mileage', parseInt(e.target.value))} style={inputStyle()} />
                </Field>
                <Field label="Color">
                  <input type="text" required value={form.color} onChange={e => updateForm('color', e.target.value)} placeholder="Pearl White" style={inputStyle()} />
                </Field>
                <Field label="Transmission">
                  <select value={form.transmission} onChange={e => updateForm('transmission', e.target.value)} style={inputStyle()}>
                    {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Price (LKR)">
                  <input type="number" required min={0} value={form.price} onChange={e => updateForm('price', parseInt(e.target.value))} style={inputStyle()} />
                </Field>
                <Field label="Status">
                  <select value={form.status} onChange={e => updateForm('status', e.target.value)} style={inputStyle()}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Image path">
                  <input type="text" value={form.image} onChange={e => updateForm('image', e.target.value)} placeholder="/placeholder.png" style={inputStyle()} />
                </Field>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <Field label="Description">
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={e => updateForm('description', e.target.value)}
                    placeholder="Brief description of the vehicle..."
                    style={{ ...inputStyle(), resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </Field>
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <Field label="Features (one per line)">
                  <textarea
                    rows={4}
                    value={featuresInput}
                    onChange={e => setFeaturesInput(e.target.value)}
                    placeholder={"Reverse Camera\nSmart Key & Push Start\nLED Headlights"}
                    style={{ ...inputStyle(), resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </Field>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-gold"
                style={{ opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
              >
                {submitting ? 'Adding...' : 'Add to Marketplace'}
              </button>
            </form>
          </div>
        )}

        {/* Vehicles Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Loading vehicles...
          </div>
        ) : (
          <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['ID', 'Vehicle', 'Year', 'Fuel', 'Mileage', 'Price (LKR)', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '0.9rem 1rem', textAlign: 'left', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vehicles.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No vehicles in the database. Add one above.
                      </td>
                    </tr>
                  ) : vehicles.map((v, idx) => (
                    <tr
                      key={v.id}
                      style={{
                        borderBottom: idx < vehicles.length - 1 ? '1px solid var(--border)' : 'none',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                        opacity: v.status === 'Sold' ? 0.55 : 1,
                      }}
                    >
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-dim)', fontWeight: 600 }}>#{v.id}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                          {v.make} {v.model}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{v.grade} · {v.type}</div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{v.year}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{v.fuel}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {v.mileage.toLocaleString()} km
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: '0.95rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {v.price.toLocaleString('en-LK')}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <select
                          value={v.status}
                          disabled={statusChanging === v.id}
                          onChange={e => handleStatusChange(v.id, e.target.value)}
                          style={{
                            background: 'var(--dark-3)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                            padding: '0.3rem 0.5rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            opacity: statusChanging === v.id ? 0.5 : 1,
                          }}
                        >
                          {STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <button
                          onClick={() => handleDelete(v.id)}
                          disabled={deletingId === v.id}
                          style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#ef4444',
                            padding: '0.3rem 0.7rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: deletingId === v.id ? 'not-allowed' : 'pointer',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            opacity: deletingId === v.id ? 0.5 : 1,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {deletingId === v.id ? 'Removing...' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
