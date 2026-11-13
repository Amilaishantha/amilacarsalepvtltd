import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import {
  fetchAdminVehicles,
  addVehicle,
  updateVehicle,
  updateVehicleFlags,
  deleteVehicle,
  updateVehicleStatus,
  verifyAdminKey,
  fetchEnquiries,
  deleteEnquiry,
  type EnquiryRow,
} from '@/lib/vehicle-fns'
import {
  fetchAllPosts,
  savePost,
  deletePost,
  fetchPublicSettings,
  saveSettings,
  EDITABLE_PAGES,
  EMPTY_SETTINGS,
  type BlogPostRow,
  type PostInput,
  type PublicSettings,
  type Testimonial,
} from '@/lib/content-fns'
import {
  CONDITIONS,
  VEHICLE_DEFAULTS,
  findDuplicates,
  formatPrice,
  slugify,
  vehicleAlt,
  vehicleFullName,
  vehicleIssues,
  vehiclePath,
  vehicleSeoDescription,
  vehicleSeoStatus,
  vehicleSeoTitle,
  type NewVehicle,
  type VehicleRow,
} from '@/lib/vehicle-utils'
import { buildSitemap } from '@/lib/sitemap'
import { ARTICLES } from '@/data/articles'
import { SITE_URL, canonicalUrl } from '@/data/site'

export const Route = createFileRoute('/admin/')({
  head: () => ({
    meta: [{ title: 'Admin Dashboard | Amila Car Sale' }, { name: 'robots', content: 'noindex, nofollow' }],
  }),
  component: AdminPage,
})

const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid']
const BODY_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Van', 'Pickup', 'Coupe', 'Wagon', 'Truck', 'Bus', 'Kei Car']
const TRANSMISSIONS = ['Automatic', 'Manual', 'CVT']
const STATUSES = ['Available', 'Reserved', 'Sold']

const emptyForm: NewVehicle = {
  ...VEHICLE_DEFAULTS,
  make: '',
  model: '',
  year: new Date().getFullYear(),
  type: 'SUV',
  fuel: 'Hybrid',
  mileage: 0,
  color: '',
  transmission: 'Automatic',
  price: 0,
}

const emptyPost: PostInput = { id: null, slug: '', title: '', seoTitle: '', description: '', image: '', imageAlt: '', body: '', author: 'Amila Car Sale Pvt Ltd', status: 'draft' }

function inputStyle(extra?: React.CSSProperties): React.CSSProperties {
  return { width: '100%', background: 'var(--dark-3)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '0.6rem 0.85rem', fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit', ...extra }
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>{label}</span>
      {children}
      {hint && <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginTop: '0.25rem' }}>{hint}</span>}
    </label>
  )
}

function Counter({ value, max }: { value: string; max: number }) {
  const n = value.length
  return <span style={{ fontSize: '0.7rem', color: n > max ? '#f87171' : 'var(--text-dim)' }}>{n}/{max}</span>
}

function Pill({ tone, children }: { tone: 'ok' | 'warn' | 'bad' | 'info'; children: React.ReactNode }) {
  const c = { ok: ['rgba(34,197,94,0.12)', '#4ade80'], warn: ['rgba(234,179,8,0.12)', '#facc15'], bad: ['rgba(239,68,68,0.12)', '#f87171'], info: ['rgba(59,130,246,0.12)', '#93c5fd'] }[tone]
  return <span style={{ background: c[0], color: c[1], fontSize: '0.66rem', fontWeight: 700, padding: '0.15rem 0.45rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{children}</span>
}

type Tab = 'vehicles' | 'enquiries' | 'seo' | 'pages' | 'blog' | 'settings'

function AdminPage() {
  const [adminKey, setAdminKey] = useState('')
  const [keyInput, setKeyInput] = useState('')
  const [authError, setAuthError] = useState('')
  const [isAuthed, setIsAuthed] = useState(false)
  const [tab, setTab] = useState<Tab>('vehicles')

  const [vehicles, setVehicles] = useState<VehicleRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<NewVehicle>(emptyForm)
  const [featuresInput, setFeaturesInput] = useState('')
  const [galleryInput, setGalleryInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [vFilter, setVFilter] = useState<'all' | 'issues' | 'duplicates' | 'drafts' | 'noindex'>('all')

  const [enquiries, setEnquiries] = useState<EnquiryRow[]>([])
  const [enquiriesLoading, setEnquiriesLoading] = useState(false)
  const [deletingEnquiryId, setDeletingEnquiryId] = useState<number | null>(null)

  const [posts, setPosts] = useState<BlogPostRow[]>([])
  const [post, setPost] = useState<PostInput | null>(null)
  const [settings, setSettings] = useState<PublicSettings>(EMPTY_SETTINGS)

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_key')
    if (stored) {
      setAdminKey(stored)
      setIsAuthed(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthed) {
      loadVehicles()
      loadEnquiries()
      loadPosts()
      fetchPublicSettings().then(setSettings).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed])

  function flash(msg: string) {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 3500)
  }

  function key() {
    return sessionStorage.getItem('admin_key') ?? adminKey
  }

  function handleUnauthorized(err: unknown, fallback: string) {
    const msg = err instanceof Error ? err.message : ''
    if (/unauthori/i.test(msg)) {
      sessionStorage.removeItem('admin_key')
      setIsAuthed(false)
      setAuthError('Your session has expired or the admin key changed. Please sign in again.')
    } else setError(fallback + (msg && !/unauthori|query|select|insert|update/i.test(msg) ? ` (${msg.slice(0, 160)})` : ''))
  }

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
      setVehicles(await fetchAdminVehicles({ data: { adminKey: key() } }))
    } catch (err) {
      handleUnauthorized(err, 'Failed to load vehicles.')
    } finally {
      setLoading(false)
    }
  }

  async function loadEnquiries() {
    setEnquiriesLoading(true)
    try {
      setEnquiries(await fetchEnquiries({ data: { adminKey: key() } }))
    } catch (err) {
      handleUnauthorized(err, 'Failed to load enquiries.')
    } finally {
      setEnquiriesLoading(false)
    }
  }

  async function loadPosts() {
    try {
      setPosts(await fetchAllPosts({ data: { adminKey: key() } }))
    } catch { /* table may not exist until the migration runs */ }
  }

  async function handleDeleteEnquiry(id: number) {
    if (!confirm('Permanently delete this customer enquiry? This cannot be undone.')) return
    setDeletingEnquiryId(id)
    try {
      await deleteEnquiry({ data: { adminKey: key(), id } })
      setEnquiries(prev => prev.filter(e => e.id !== id))
      flash('Enquiry deleted.')
    } catch (err) {
      handleUnauthorized(err, 'Failed to delete enquiry.')
    } finally {
      setDeletingEnquiryId(null)
    }
  }

  async function handleDelete(v: VehicleRow) {
    if (!confirm(`Permanently delete #${v.id} ${vehicleFullName(v)}?\n\nTip: to keep the vehicle's history, set it to "Sold" or "Draft" instead. Deleting cannot be undone.`)) return
    setBusyId(v.id)
    setError('')
    try {
      await deleteVehicle({ data: { adminKey: key(), id: v.id } })
      setVehicles(prev => prev.filter(x => x.id !== v.id))
      flash('Vehicle removed.')
    } catch (err) {
      handleUnauthorized(err, 'Failed to remove vehicle.')
    } finally {
      setBusyId(null)
    }
  }

  async function handleStatusChange(id: number, status: string) {
    setBusyId(id)
    setError('')
    try {
      const updated = await updateVehicleStatus({ data: { adminKey: key(), id, status } })
      setVehicles(prev => prev.map(v => (v.id === id ? updated : v)))
      flash(`Status updated to ${status}.`)
    } catch (err) {
      handleUnauthorized(err, 'Failed to update status.')
    } finally {
      setBusyId(null)
    }
  }

  async function handleFlags(id: number, flags: { featured?: boolean; visibility?: string; noindex?: boolean }) {
    setBusyId(id)
    try {
      const updated = await updateVehicleFlags({ data: { adminKey: key(), id, ...flags } })
      setVehicles(prev => prev.map(v => (v.id === id ? updated : v)))
      flash('Saved.')
    } catch (err) {
      handleUnauthorized(err, 'Failed to save.')
    } finally {
      setBusyId(null)
    }
  }

  function startAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setFeaturesInput('')
    setGalleryInput('')
    setShowForm(true)
  }

  function startEdit(v: VehicleRow) {
    const { id: _id, updatedAt: _u, ...rest } = v
    setEditingId(v.id)
    setForm(rest)
    setFeaturesInput(v.features.join('\n'))
    setGalleryInput(v.gallery.join('\n'))
    setShowForm(true)
    setTab('vehicles')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSaveVehicle(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const features = featuresInput.split('\n').map(s => s.trim()).filter(Boolean)
    const gallery = galleryInput.split('\n').map(s => s.trim()).filter(Boolean)
    const vehicle = { ...form, features, gallery, mileage: form.mileage || 0, price: form.price || 0 }
    try {
      if (editingId) {
        const updated = await updateVehicle({ data: { adminKey: key(), id: editingId, vehicle } })
        setVehicles(prev => prev.map(v => (v.id === editingId ? updated : v)))
        flash('Vehicle updated.')
      } else {
        const created = await addVehicle({ data: { adminKey: key(), vehicle } })
        setVehicles(prev => [created, ...prev])
        flash('Vehicle added to marketplace.')
      }
      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm)
    } catch (err) {
      handleUnauthorized(err, 'Failed to save vehicle. Check required fields.')
    } finally {
      setSubmitting(false)
    }
  }

  function updateForm<K extends keyof NewVehicle>(k: K, value: NewVehicle[K]) {
    setForm(prev => ({ ...prev, [k]: value }))
  }

  // ── derived SEO data ──
  const duplicates = useMemo(() => findDuplicates(vehicles), [vehicles])
  const published = useMemo(() => vehicles.filter(v => v.visibility === 'published'), [vehicles])
  const sitemap = useMemo(
    () => buildSitemap(published, posts.filter(p => p.status === 'published').map(p => ({ slug: p.slug, updatedAt: p.updatedAt }))),
    [published, posts],
  )
  const shownVehicles = vehicles.filter(v => {
    if (vFilter === 'issues') return vehicleIssues(v).some(i => i.level === 'error')
    if (vFilter === 'duplicates') return duplicates.has(v.id)
    if (vFilter === 'drafts') return v.visibility !== 'published'
    if (vFilter === 'noindex') return !vehicleSeoStatus(v, published).indexable
    return true
  })

  if (!isAuthed) {
    return (
      <main id="main" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <div className="section-tag" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>Restricted area</div>
            <h1 className="h1" style={{ fontSize: '2rem' }}>Admin Dashboard</h1>
            <p className="muted" style={{ fontSize: '0.88rem', margin: 0 }}>Enter the admin key set in your Netlify environment variables.</p>
          </div>
          <form onSubmit={handleLogin} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Field label="Admin key">
              <input type="password" value={keyInput} onChange={e => setKeyInput(e.target.value)} placeholder="Enter ADMIN_KEY value" required autoFocus autoComplete="current-password" style={inputStyle()} />
            </Field>
            {authError && <p role="alert" style={{ color: '#f87171', fontSize: '0.84rem', margin: 0, lineHeight: 1.5 }}>{authError}</p>}
            <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>Sign in</button>
          </form>
        </div>
      </main>
    )
  }

  const tabs: [Tab, string][] = [
    ['vehicles', `Vehicles (${vehicles.length})`],
    ['enquiries', `Enquiries (${enquiries.length})`],
    ['seo', 'SEO & sitemap'],
    ['pages', 'Page SEO'],
    ['blog', `Blog (${posts.length})`],
    ['settings', 'Analytics & settings'],
  ]

  return (
    <main id="main" style={{ minHeight: '100vh', padding: '2rem 0 4rem' }}>
      <div className="container">
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div className="section-tag" style={{ marginBottom: '0.5rem' }}>Amila Car Sale</div>
            <h1 className="h1" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', margin: 0 }}>Marketplace Dashboard</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={showForm ? () => setShowForm(false) : startAdd} className="btn-gold" style={{ padding: '0.65rem 1.2rem' }}>
              {showForm ? '✕ Close form' : '+ Add vehicle'}
            </button>
            <button onClick={() => { sessionStorage.removeItem('admin_key'); setIsAuthed(false); setAdminKey('') }} className="btn-outline" style={{ padding: '0.55rem 1rem' }}>
              Sign out
            </button>
          </div>
        </div>

        <nav aria-label="Dashboard sections" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
          {tabs.map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} aria-current={tab === t ? 'page' : undefined}
              style={{ background: tab === t ? 'var(--dark-3)' : 'transparent', border: 'none', borderBottom: tab === t ? '2px solid var(--gold)' : '2px solid transparent', color: tab === t ? '#fff' : 'var(--text-muted)', padding: '0.7rem 1rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.84rem', fontWeight: 600 }}>
              {label}
            </button>
          ))}
        </nav>

        {success && <div role="status" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', padding: '0.75rem 1rem', fontSize: '0.86rem', marginBottom: '1.25rem' }}>{success}</div>}
        {error && <div role="alert" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '0.75rem 1rem', fontSize: '0.86rem', marginBottom: '1.25rem' }}>{error}</div>}

        {/* ───────── Add / edit vehicle ───────── */}
        {showForm && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 className="h3" style={{ fontSize: '1.3rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.9rem', marginBottom: '1.25rem' }}>
              {editingId ? `Edit vehicle #${editingId}` : 'Add new vehicle'}
            </h2>
            <form onSubmit={handleSaveVehicle}>
              <h3 className="h3" style={{ fontSize: '0.95rem' }}>Specifications</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <Field label="Make"><input type="text" required value={form.make} onChange={e => updateForm('make', e.target.value)} placeholder="Toyota" style={inputStyle()} /></Field>
                <Field label="Model"><input type="text" required value={form.model} onChange={e => updateForm('model', e.target.value)} placeholder="Raize" style={inputStyle()} /></Field>
                <Field label="Grade / trim"><input type="text" value={form.grade} onChange={e => updateForm('grade', e.target.value)} placeholder="Z" style={inputStyle()} /></Field>
                <Field label="Model year"><input type="number" required min={1990} max={2030} value={form.year} onChange={e => updateForm('year', parseInt(e.target.value) || 0)} style={inputStyle()} /></Field>
                <Field label="Manufacture date" hint="e.g. 2024-03 (optional)"><input type="text" value={form.manufactureDate} onChange={e => updateForm('manufactureDate', e.target.value)} style={inputStyle()} /></Field>
                <Field label="Body type"><select value={form.type} onChange={e => updateForm('type', e.target.value)} style={inputStyle()}>{BODY_TYPES.map(t => <option key={t}>{t}</option>)}{!BODY_TYPES.includes(form.type) && <option>{form.type}</option>}</select></Field>
                <Field label="Fuel type"><select value={form.fuel} onChange={e => updateForm('fuel', e.target.value)} style={inputStyle()}>{FUEL_TYPES.map(f => <option key={f}>{f}</option>)}{!FUEL_TYPES.includes(form.fuel) && <option>{form.fuel}</option>}</select></Field>
                <Field label="Engine cc" hint="Leave blank for EV"><input type="number" min={0} value={form.engineCC ?? ''} onChange={e => updateForm('engineCC', e.target.value ? parseInt(e.target.value) : null)} placeholder="1500" style={inputStyle()} /></Field>
                <Field label="Motor kW" hint="EV only"><input type="number" min={0} value={form.motorKW ?? ''} onChange={e => updateForm('motorKW', e.target.value ? parseInt(e.target.value) : null)} placeholder="160" style={inputStyle()} /></Field>
                <Field label="Mileage (km)"><input type="number" required min={0} value={form.mileage} onChange={e => updateForm('mileage', parseInt(e.target.value) || 0)} style={inputStyle()} /></Field>
                <Field label="Colour"><input type="text" value={form.color} onChange={e => updateForm('color', e.target.value)} placeholder="Pearl White" style={inputStyle()} /></Field>
                <Field label="Transmission"><select value={form.transmission} onChange={e => updateForm('transmission', e.target.value)} style={inputStyle()}>{TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}{!TRANSMISSIONS.includes(form.transmission) && <option>{form.transmission}</option>}</select></Field>
                <Field label="Price (LKR)" hint='0 = shows "Price on Request"'><input type="number" min={0} value={form.price} onChange={e => updateForm('price', parseInt(e.target.value) || 0)} style={inputStyle()} /></Field>
                <Field label="Status"><select value={form.status} onChange={e => updateForm('status', e.target.value)} style={inputStyle()}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></Field>
                <Field label="Condition"><select value={form.condition} onChange={e => updateForm('condition', e.target.value)} style={inputStyle()}>{CONDITIONS.map(c => <option key={c} value={c}>{c || '— not stated —'}</option>)}</select></Field>
                <Field label="Auction grade" hint="e.g. 4.5, S, R"><input type="text" value={form.auctionGrade} onChange={e => updateForm('auctionGrade', e.target.value)} style={inputStyle()} /></Field>
                <Field label="Chassis number" hint="Shown publicly if entered"><input type="text" value={form.chassisNumber} onChange={e => updateForm('chassisNumber', e.target.value)} style={inputStyle()} /></Field>
              </div>

              <h3 className="h3" style={{ fontSize: '0.95rem' }}>Photos</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <Field label="Main image URL"><input type="text" value={form.image} onChange={e => updateForm('image', e.target.value)} placeholder="https://res.cloudinary.com/…" style={inputStyle()} /></Field>
                <Field label="Main image ALT text" hint={`Leave blank for automatic: “${vehicleAlt({ ...form, id: 0, updatedAt: '' } as VehicleRow)}”`}>
                  <input type="text" value={form.imageAlt} maxLength={250} onChange={e => updateForm('imageAlt', e.target.value)} style={inputStyle()} />
                </Field>
                <Field label="Extra photos (one URL per line)"><textarea rows={3} value={galleryInput} onChange={e => setGalleryInput(e.target.value)} style={inputStyle({ resize: 'vertical' })} /></Field>
              </div>

              <h3 className="h3" style={{ fontSize: '0.95rem' }}>Description & features</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <Field label="Description"><textarea rows={4} value={form.description} onChange={e => updateForm('description', e.target.value)} style={inputStyle({ resize: 'vertical' })} /></Field>
                <Field label="Features (one per line)"><textarea rows={4} value={featuresInput} onChange={e => setFeaturesInput(e.target.value)} placeholder={'Reverse Camera\nSmart Key & Push Start'} style={inputStyle({ resize: 'vertical' })} /></Field>
              </div>

              <h3 className="h3" style={{ fontSize: '0.95rem' }}>SEO & publishing</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <Field label="SEO title (optional)" hint={`Automatic: ${vehicleSeoTitle({ ...form, seoTitle: '', id: 0, updatedAt: '' } as VehicleRow)}`}>
                  <input type="text" maxLength={120} value={form.seoTitle} onChange={e => updateForm('seoTitle', e.target.value)} style={inputStyle()} /> <Counter value={form.seoTitle} max={60} />
                </Field>
                <Field label="Meta description (optional)" hint="Leave blank to generate from the specifications">
                  <textarea rows={2} maxLength={320} value={form.seoDescription} onChange={e => updateForm('seoDescription', e.target.value)} style={inputStyle({ resize: 'vertical' })} /> <Counter value={form.seoDescription} max={160} />
                </Field>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <select value={form.visibility} onChange={e => updateForm('visibility', e.target.value)} style={inputStyle({ width: 'auto' })}>
                    <option value="published">Published</option>
                    <option value="draft">Draft (hidden)</option>
                  </select>
                </label>
                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><input type="checkbox" checked={form.featured} onChange={e => updateForm('featured', e.target.checked)} /> Featured on homepage</label>
                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><input type="checkbox" checked={form.noindex} onChange={e => updateForm('noindex', e.target.checked)} /> Hide from Google (noindex)</label>
              </div>
              <button type="submit" disabled={submitting} className="btn-gold" style={{ opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'Saving…' : editingId ? 'Save changes' : 'Add to marketplace'}
              </button>
            </form>
          </div>
        )}

        {/* ───────── Vehicles ───────── */}
        {tab === 'vehicles' && (
          <section>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem', alignItems: 'center' }}>
              <span className="muted" style={{ fontSize: '0.8rem', marginRight: '0.4rem' }}>Show:</span>
              {([['all', 'All'], ['issues', 'Missing specs'], ['duplicates', `Possible duplicates (${duplicates.size})`], ['drafts', 'Drafts'], ['noindex', 'Not indexed']] as const).map(([f, l]) => (
                <button key={f} onClick={() => setVFilter(f)} className="chip" style={{ cursor: 'pointer', borderColor: vFilter === f ? 'var(--gold)' : undefined, color: vFilter === f ? '#fff' : undefined, fontFamily: 'inherit' }}>{l}</button>
              ))}
              <button onClick={loadVehicles} className="chip" style={{ cursor: 'pointer', marginLeft: 'auto', fontFamily: 'inherit' }}>↻ Refresh</button>
            </div>
            {loading ? (
              <div className="muted" style={{ padding: '3rem', textAlign: 'center' }}>Loading vehicles…</div>
            ) : (
              <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['ID', 'Vehicle', 'Price', 'Status', 'SEO / quality', 'Publishing', 'Actions'].map(h => (
                        <th key={h} scope="col" style={{ padding: '0.8rem 0.9rem', textAlign: 'left', fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {shownVehicles.length === 0 ? (
                      <tr><td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>No vehicles match.</td></tr>
                    ) : shownVehicles.map(v => {
                      const issues = vehicleIssues(v)
                      const seo = vehicleSeoStatus(v, published)
                      const dup = duplicates.get(v.id)
                      return (
                        <tr key={v.id} style={{ borderBottom: '1px solid var(--border)', opacity: v.status === 'Sold' ? 0.6 : 1, verticalAlign: 'top' }}>
                          <td style={{ padding: '0.75rem 0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>#{v.id}</td>
                          <td style={{ padding: '0.75rem 0.9rem', minWidth: '210px' }}>
                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                              <img src={v.image} alt="" width={56} height={40} loading="lazy" style={{ width: 56, height: 40, objectFit: 'cover', flexShrink: 0, background: 'var(--dark-3)' }} />
                              <div>
                                <div style={{ fontWeight: 600 }}>{vehicleFullName(v)}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{v.type} · {v.fuel} · {v.mileage.toLocaleString()} km</div>
                                {v.visibility === 'published' && <a href={vehiclePath(v)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', color: 'var(--gold-light)' }}>View page ↗</a>}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem 0.9rem', whiteSpace: 'nowrap', fontWeight: 600 }}>{formatPrice(v)}</td>
                          <td style={{ padding: '0.75rem 0.9rem' }}>
                            <select value={v.status} disabled={busyId === v.id} onChange={e => handleStatusChange(v.id, e.target.value)} style={inputStyle({ width: 'auto', padding: '0.3rem 0.5rem', fontSize: '0.78rem' })} aria-label={`Status of #${v.id}`}>
                              {STATUSES.map(s => <option key={s}>{s}</option>)}
                            </select>
                          </td>
                          <td style={{ padding: '0.75rem 0.9rem', minWidth: '240px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.35rem' }}>
                              {seo.indexable ? <Pill tone="ok">Indexed · in sitemap</Pill> : <Pill tone="info">Not indexed</Pill>}
                              {dup && <Pill tone="warn">Possible duplicate of #{dup.join(', #')}</Pill>}
                              {v.seoTitle && <Pill tone="info">Custom title</Pill>}
                            </div>
                            {!seo.indexable && <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{seo.reasons.join(' · ')}</div>}
                            {issues.length > 0 && (
                              <ul style={{ margin: '0.3rem 0 0', paddingLeft: '1rem', fontSize: '0.72rem', lineHeight: 1.5 }}>
                                {issues.map(i => <li key={i.message} style={{ color: i.level === 'error' ? '#f87171' : '#facc15' }}>{i.message}</li>)}
                              </ul>
                            )}
                          </td>
                          <td style={{ padding: '0.75rem 0.9rem', whiteSpace: 'nowrap', fontSize: '0.78rem' }}>
                            <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                              <input type="checkbox" checked={v.visibility === 'published'} disabled={busyId === v.id} onChange={e => handleFlags(v.id, { visibility: e.target.checked ? 'published' : 'draft' })} /> Published
                            </label>
                            <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                              <input type="checkbox" checked={v.featured} disabled={busyId === v.id} onChange={e => handleFlags(v.id, { featured: e.target.checked })} /> Featured
                            </label>
                            <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                              <input type="checkbox" checked={v.noindex} disabled={busyId === v.id} onChange={e => handleFlags(v.id, { noindex: e.target.checked })} /> Noindex
                            </label>
                          </td>
                          <td style={{ padding: '0.75rem 0.9rem', whiteSpace: 'nowrap' }}>
                            <button onClick={() => startEdit(v)} className="chip" style={{ cursor: 'pointer', marginRight: '0.4rem', fontFamily: 'inherit' }}>Edit</button>
                            <button onClick={() => handleDelete(v)} disabled={busyId === v.id} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '0.4rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', fontFamily: 'inherit' }}>
                              Remove
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <p className="muted" style={{ fontSize: '0.78rem', marginTop: '0.75rem' }}>
              Duplicate warnings compare make, model, year, grade, colour and mileage. Nothing is deleted automatically — review each one and set the extra listing to Draft or Sold, or remove it.
            </p>
          </section>
        )}

        {/* ───────── Enquiries ───────── */}
        {tab === 'enquiries' && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="h3" style={{ margin: 0 }}>Customer enquiries</h2>
              <button onClick={loadEnquiries} className="btn-outline" style={{ padding: '0.5rem 1rem' }}>{enquiriesLoading ? 'Refreshing…' : '↻ Refresh'}</button>
            </div>
            {enquiries.length === 0 ? (
              <div className="card muted" style={{ fontSize: '0.88rem' }}>
                {enquiriesLoading ? 'Loading enquiries…' : 'No enquiries yet. Enquiries from vehicle pages, the contact form, import requests and the tax calculator appear here and are also sent to your WhatsApp.'}
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '0.9rem' }}>
                {enquiries.map(enq => (
                  <div key={enq.id} className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'flex-start', padding: '1.2rem' }}>
                    {enq.vehicleImage && <img src={enq.vehicleImage} alt={enq.vehicleTitle} width={110} height={76} loading="lazy" style={{ width: 110, height: 76, objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }} />}
                    <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <strong>{enq.customerName}</strong>
                        <Pill tone="info">{enq.source || 'vehicle'}</Pill>
                      </div>
                      <a href={`tel:${enq.customerPhone.replace(/[^+\d]/g, '')}`} style={{ fontSize: '0.84rem', color: 'var(--gold-light)' }}>{enq.customerPhone}</a>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{enq.vehicleTitle || 'Vehicle'}</strong>
                        {enq.vehiclePrice && enq.vehiclePrice >= 100000 ? ` · Rs. ${enq.vehiclePrice.toLocaleString('en-LK')}` : ''}
                        {enq.vehicleId ? ` · Stock #${enq.vehicleId}` : ''}
                      </div>
                      {enq.customerMessage && <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.6, borderLeft: '2px solid var(--gold)', paddingLeft: '0.7rem', whiteSpace: 'pre-line' }}>{enq.customerMessage}</div>}
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>{new Date(enq.createdAt).toLocaleString('en-LK')}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <a href={`https://wa.me/${enq.customerPhone.replace(/\D/g, '').replace(/^0/, '94')}`} target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ padding: '0.55rem 1rem', fontSize: '0.72rem' }}>Reply on WhatsApp</a>
                      <button onClick={() => handleDeleteEnquiry(enq.id)} disabled={deletingEnquiryId === enq.id} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-dim)', padding: '0.5rem 1rem', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                        {deletingEnquiryId === enq.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ───────── SEO & sitemap ───────── */}
        {tab === 'seo' && (
          <section style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="grid-3">
              <div className="card"><div className="muted" style={{ fontSize: '0.75rem' }}>URLs in sitemap</div><div style={{ fontSize: '2rem', fontWeight: 800 }}>{sitemap.entries.length}</div><a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-light)', fontSize: '0.82rem' }}>Open /sitemap.xml ↗</a></div>
              <div className="card"><div className="muted" style={{ fontSize: '0.75rem' }}>Vehicle pages indexed</div><div style={{ fontSize: '2rem', fontWeight: 800 }}>{published.length - sitemap.excluded.length}<span className="muted" style={{ fontSize: '1rem' }}> / {published.length}</span></div><span className="muted" style={{ fontSize: '0.8rem' }}>published vehicles</span></div>
              <div className="card"><div className="muted" style={{ fontSize: '0.75rem' }}>Possible duplicate listings</div><div style={{ fontSize: '2rem', fontWeight: 800, color: duplicates.size ? '#facc15' : undefined }}>{duplicates.size}</div><button onClick={() => { setTab('vehicles'); setVFilter('duplicates') }} className="chip" style={{ cursor: 'pointer', fontFamily: 'inherit' }}>Review</button></div>
            </div>

            <div className="card">
              <h2 className="h3">Indexing status</h2>
              <p className="muted" style={{ fontSize: '0.86rem', lineHeight: 1.7 }}>
                The website cannot see Google’s index directly. Once Google Search Console is verified (Analytics &amp; settings tab), check real indexing, impressions,
                clicks and average position there. Use the links below to inspect a URL.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <a className="chip" href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">Google Search Console ↗</a>
                <a className="chip" href={`https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(SITE_URL + '/')}`} target="_blank" rel="noopener noreferrer">Submit sitemap ↗</a>
                <a className="chip" href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer">Bing Webmaster Tools ↗</a>
                <a className="chip" href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(SITE_URL + '/')}`} target="_blank" rel="noopener noreferrer">Rich Results Test ↗</a>
                <a className="chip" href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(SITE_URL + '/')}`} target="_blank" rel="noopener noreferrer">PageSpeed Insights ↗</a>
              </div>
            </div>

            <div className="card">
              <h2 className="h3">Vehicle pages excluded from Google ({sitemap.excluded.length})</h2>
              {sitemap.excluded.length === 0 ? <p className="muted">All published vehicle pages are indexable.</p> : (
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.85rem', lineHeight: 1.8 }}>
                  {sitemap.excluded.map(x => {
                    const v = vehicles.find(y => y.id === x.id)
                    return (
                      <li key={x.id}>
                        <strong>#{x.id} {x.name}</strong> — <span className="muted">{x.reasons.join(' · ')}</span>{' '}
                        {v && <button onClick={() => startEdit(v)} style={{ background: 'none', border: 'none', color: 'var(--gold-light)', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit' }}>Fix</button>}
                      </li>
                    )
                  })}
                </ul>
              )}
              <p className="muted" style={{ fontSize: '0.78rem', marginTop: '0.75rem' }}>
                Sold vehicles stay visible on the site for history but are not indexed. Drafts are hidden from the public completely.
              </p>
            </div>

            <div className="card">
              <h2 className="h3">Vehicle SEO preview</h2>
              <div style={{ display: 'grid', gap: '0.9rem' }}>
                {published.filter(v => vehicleSeoStatus(v, published).indexable).slice(0, 8).map(v => (
                  <div key={v.id} style={{ borderLeft: '2px solid var(--border)', paddingLeft: '0.8rem' }}>
                    <div style={{ color: '#8ab4f8', fontSize: '0.95rem' }}>{vehicleSeoTitle(v)}</div>
                    <div style={{ color: '#4ade80', fontSize: '0.74rem' }}>{canonicalUrl(vehiclePath(v))}</div>
                    <div className="muted" style={{ fontSize: '0.8rem' }}>{vehicleSeoDescription(v)}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ───────── Page SEO ───────── */}
        {tab === 'pages' && (
          <PageSeoEditor settings={settings} onSave={async s => {
            try {
              setSettings(await saveSettings({ data: { adminKey: key(), settings: s } }))
              flash('Page SEO saved. Changes appear on the next page load.')
            } catch (err) { handleUnauthorized(err, 'Failed to save page SEO.') }
          }} />
        )}

        {/* ───────── Blog ───────── */}
        {tab === 'blog' && (
          <section>
            {post ? (
              <PostEditor
                post={post}
                onCancel={() => setPost(null)}
                onSave={async p => {
                  try {
                    const saved = await savePost({ data: { adminKey: key(), post: p } })
                    setPosts(prev => [saved, ...prev.filter(x => x.id !== saved.id)])
                    setPost(null)
                    flash(p.status === 'published' ? 'Post published.' : 'Draft saved.')
                  } catch (err) { handleUnauthorized(err, 'Failed to save post.') }
                }}
              />
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 className="h3" style={{ margin: 0 }}>Knowledge-centre posts</h2>
                  <button onClick={() => setPost(emptyPost)} className="btn-gold" style={{ padding: '0.55rem 1rem' }}>+ New post</button>
                </div>
                <div style={{ display: 'grid', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  {posts.length === 0 && <div className="card muted" style={{ fontSize: '0.86rem' }}>No custom posts yet. Write news, new-arrival announcements or extra guides here.</div>}
                  {posts.map(p => (
                    <div key={p.id} className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.2rem' }}>
                      <div>
                        <strong>{p.title}</strong> <Pill tone={p.status === 'published' ? 'ok' : 'warn'}>{p.status}</Pill>
                        <div className="muted" style={{ fontSize: '0.75rem' }}>/blog/{p.slug} · updated {new Date(p.updatedAt).toLocaleDateString('en-LK')}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {p.status === 'published' && <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="chip">View ↗</a>}
                        <button className="chip" style={{ cursor: 'pointer', fontFamily: 'inherit' }} onClick={() => setPost({ id: p.id, slug: p.slug, title: p.title, seoTitle: p.seoTitle, description: p.description, image: p.image, imageAlt: p.imageAlt, body: p.body, author: p.author, status: p.status as 'draft' | 'published' })}>Edit</button>
                        <button className="chip" style={{ cursor: 'pointer', color: '#f87171', fontFamily: 'inherit' }} onClick={async () => {
                          if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return
                          try { await deletePost({ data: { adminKey: key(), id: p.id } }); setPosts(prev => prev.filter(x => x.id !== p.id)); flash('Post deleted.') } catch (err) { handleUnauthorized(err, 'Failed to delete post.') }
                        }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="h3">Built-in guides ({ARTICLES.length})</h3>
                <p className="muted" style={{ fontSize: '0.8rem' }}>These are part of the website code (src/data/articles.ts) and are reviewed by the developer when regulations change.</p>
                <ul style={{ fontSize: '0.84rem', lineHeight: 1.8, paddingLeft: '1.1rem' }}>
                  {ARTICLES.map(a => <li key={a.slug}><Link to="/blog/$slug" params={{ slug: a.slug }} style={{ color: '#fff' }}>{a.title}</Link> <span className="muted">· updated {a.updated}</span></li>)}
                </ul>
              </>
            )}
          </section>
        )}

        {/* ───────── Settings ───────── */}
        {tab === 'settings' && (
          <SettingsEditor settings={settings} onSave={async s => {
            try {
              setSettings(await saveSettings({ data: { adminKey: key(), settings: s } }))
              flash('Settings saved. They take effect on the next page load.')
            } catch (err) { handleUnauthorized(err, 'Failed to save settings — check the format of each ID.') }
          }} />
        )}
      </div>
    </main>
  )
}

function PageSeoEditor({ settings, onSave }: { settings: PublicSettings; onSave: (s: PublicSettings) => Promise<void> }) {
  const [pageSeo, setPageSeo] = useState(settings.pageSeo)
  useEffect(() => setPageSeo(settings.pageSeo), [settings])
  return (
    <section className="card">
      <h2 className="h3">Page titles & meta descriptions</h2>
      <p className="muted" style={{ fontSize: '0.84rem', marginBottom: '1.25rem' }}>Leave a field blank to use the built-in, keyword-optimised default. Aim for ≤ 60 characters for titles and ≤ 160 for descriptions.</p>
      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {EDITABLE_PAGES.map(p => {
          const v = pageSeo[p.path] ?? { title: '', description: '' }
          const set = (patch: Partial<typeof v>) => setPageSeo(prev => ({ ...prev, [p.path]: { ...v, ...patch } }))
          return (
            <div key={p.path} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{p.label} <span className="muted" style={{ fontWeight: 400, fontSize: '0.78rem' }}>{p.path}</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                <Field label="SEO title"><input value={v.title} maxLength={120} onChange={e => set({ title: e.target.value })} style={inputStyle()} /> <Counter value={v.title} max={60} /></Field>
                <Field label="Meta description"><textarea rows={2} value={v.description} maxLength={320} onChange={e => set({ description: e.target.value })} style={inputStyle({ resize: 'vertical' })} /> <Counter value={v.description} max={160} /></Field>
              </div>
            </div>
          )
        })}
      </div>
      <button className="btn-gold" style={{ marginTop: '1.25rem' }} onClick={() => onSave({ ...settings, pageSeo })}>Save page SEO</button>
    </section>
  )
}

function SettingsEditor({ settings, onSave }: { settings: PublicSettings; onSave: (s: PublicSettings) => Promise<void> }) {
  const [s, setS] = useState(settings)
  useEffect(() => setS(settings), [settings])
  const setT = (i: number, patch: Partial<Testimonial>) => setS(prev => ({ ...prev, testimonials: prev.testimonials.map((t, j) => (j === i ? { ...t, ...patch } : t)) }))
  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      <div className="card">
        <h2 className="h3">Search engines & analytics</h2>
        <p className="muted" style={{ fontSize: '0.84rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          These are public IDs and verification tokens (they appear in the page HTML by design) — never paste passwords or API secrets here.
          Leave a field blank to switch it off. Status: {s.gtmId ? `Tag Manager ${s.gtmId}` : 'Tag Manager GTM-M8WQ4ZFQ (default)'}{s.ga4Id ? ` + GA4 ${s.ga4Id}` : ''} ·{' '}
          {s.googleVerification ? 'Google verification tag present (confirm “Verified” in Search Console)' : 'Google Search Console not set up'}.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <Field label="Google Analytics 4 measurement ID" hint="Looks like G-XXXXXXXXXX. Skip if you load GA4 through Tag Manager."><input value={s.ga4Id} onChange={e => setS({ ...s, ga4Id: e.target.value.trim().toUpperCase() })} placeholder="G-XXXXXXXXXX" style={inputStyle()} /></Field>
          <Field label="Google Tag Manager container ID" hint="Looks like GTM-XXXXXXX. Leave blank to use the site's default container (GTM-M8WQ4ZFQ)."><input value={s.gtmId} onChange={e => setS({ ...s, gtmId: e.target.value.trim().toUpperCase() })} placeholder="GTM-XXXXXXX" style={inputStyle()} /></Field>
          <Field label="Google Search Console verification" hint='From the "HTML tag" method — paste only the content="…" value'><input value={s.googleVerification} onChange={e => setS({ ...s, googleVerification: e.target.value.trim() })} style={inputStyle()} /></Field>
          <Field label="Bing Webmaster verification" hint='From the msvalidate.01 meta tag — content value only'><input value={s.bingVerification} onChange={e => setS({ ...s, bingVerification: e.target.value.trim() })} style={inputStyle()} /></Field>
          <Field label="Google Business Profile / Maps link" hint="Used for “Get directions” and in structured data (sameAs)"><input value={s.googleBusinessUrl} onChange={e => setS({ ...s, googleBusinessUrl: e.target.value.trim() })} placeholder="https://maps.app.goo.gl/…" style={inputStyle()} /></Field>
        </div>
        <details style={{ marginTop: '1.25rem' }}>
          <summary style={{ cursor: 'pointer', fontSize: '0.86rem', fontWeight: 600 }}>Events sent to GA4 / Tag Manager</summary>
          <ul className="muted" style={{ fontSize: '0.82rem', lineHeight: 1.8 }}>
            <li><code>vehicle_enquiry_submit</code> — vehicle enquiry / reservation form</li>
            <li><code>contact_form_submit</code> — contact page form</li>
            <li><code>import_request_submit</code> — import request and tax-quote forms</li>
            <li><code>whatsapp_click</code>, <code>phone_click</code>, <code>email_click</code> — every WhatsApp, phone and email link</li>
            <li><code>tax_calculator_use</code> — each calculation</li>
            <li><code>vehicle_search</code> — marketplace search</li>
          </ul>
          <p className="muted" style={{ fontSize: '0.8rem' }}>Organic traffic is reported by GA4; search impressions, clicks and average position are reported by Search Console (link the two in GA4 → Admin → Product links).</p>
        </details>
      </div>

      <div className="card">
        <h2 className="h3">Customer testimonials</h2>
        <p className="muted" style={{ fontSize: '0.84rem', lineHeight: 1.7 }}>
          Only add genuine reviews from real customers, with their permission (for example copied from your Facebook or Google reviews). The homepage section stays hidden while this list is empty.
        </p>
        {s.testimonials.map((t, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem', borderTop: '1px solid var(--border)', padding: '0.9rem 0' }}>
            <Field label="Customer name"><input value={t.name} onChange={e => setT(i, { name: e.target.value })} style={inputStyle()} /></Field>
            <Field label="Source"><input value={t.source} onChange={e => setT(i, { source: e.target.value })} placeholder="Facebook review" style={inputStyle()} /></Field>
            <Field label="Date"><input value={t.date} onChange={e => setT(i, { date: e.target.value })} placeholder="2026-10" style={inputStyle()} /></Field>
            <Field label="Link to original (optional)"><input value={t.url} onChange={e => setT(i, { url: e.target.value })} style={inputStyle()} /></Field>
            <div style={{ gridColumn: '1 / -1' }}><Field label="Review text"><textarea rows={2} value={t.text} onChange={e => setT(i, { text: e.target.value })} style={inputStyle({ resize: 'vertical' })} /></Field></div>
            <button type="button" onClick={() => setS(prev => ({ ...prev, testimonials: prev.testimonials.filter((_, j) => j !== i) }))} className="chip" style={{ cursor: 'pointer', justifySelf: 'start', fontFamily: 'inherit' }}>Remove</button>
          </div>
        ))}
        <button type="button" className="chip" style={{ cursor: 'pointer', fontFamily: 'inherit' }} onClick={() => setS(prev => ({ ...prev, testimonials: [...prev.testimonials, { name: '', text: '', source: '', date: '', url: '' }] }))}>+ Add testimonial</button>
      </div>

      <button className="btn-gold" style={{ justifySelf: 'start' }} onClick={() => onSave(s)}>Save settings</button>
    </section>
  )
}

function PostEditor({ post, onSave, onCancel }: { post: PostInput; onSave: (p: PostInput) => Promise<void>; onCancel: () => void }) {
  const [p, setP] = useState(post)
  const [saving, setSaving] = useState(false)
  return (
    <form className="card" onSubmit={async e => { e.preventDefault(); setSaving(true); await onSave(p); setSaving(false) }}>
      <h2 className="h3">{p.id ? 'Edit post' : 'New post'}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <Field label="Title"><input required value={p.title} onChange={e => setP({ ...p, title: e.target.value, slug: p.id ? p.slug : slugify(e.target.value) })} style={inputStyle()} /></Field>
        <Field label="URL slug" hint={`/blog/${p.slug || '…'}`}><input required value={p.slug} onChange={e => setP({ ...p, slug: slugify(e.target.value) })} style={inputStyle()} /></Field>
        <Field label="SEO title (optional)"><input value={p.seoTitle} maxLength={120} onChange={e => setP({ ...p, seoTitle: e.target.value })} style={inputStyle()} /> <Counter value={p.seoTitle} max={60} /></Field>
        <Field label="Meta description"><textarea rows={2} value={p.description} maxLength={320} onChange={e => setP({ ...p, description: e.target.value })} style={inputStyle({ resize: 'vertical' })} /> <Counter value={p.description} max={160} /></Field>
        <Field label="Image URL"><input value={p.image} onChange={e => setP({ ...p, image: e.target.value })} style={inputStyle()} /></Field>
        <Field label="Image ALT text"><input value={p.imageAlt} maxLength={250} onChange={e => setP({ ...p, imageAlt: e.target.value })} style={inputStyle()} /></Field>
        <Field label="Author"><input value={p.author} onChange={e => setP({ ...p, author: e.target.value })} style={inputStyle()} /></Field>
        <Field label="Status">
          <select value={p.status} onChange={e => setP({ ...p, status: e.target.value as 'draft' | 'published' })} style={inputStyle()}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
      </div>
      <Field label="Body" hint="Formatting: ## Heading, ### Subheading, - bullet, 1. numbered, **bold**, [link text](/vehicles), > quote, | table | rows |">
        <textarea rows={16} value={p.body} onChange={e => setP({ ...p, body: e.target.value })} style={inputStyle({ resize: 'vertical', fontFamily: 'ui-monospace, monospace', fontSize: '0.84rem' })} />
      </Field>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        <button type="submit" className="btn-gold" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" className="btn-outline" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
