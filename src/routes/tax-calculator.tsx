import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/tax-calculator')({
  component: TaxCalculatorPage,
})

const CATEGORIES = [
  { value: 'petrol_car', label: 'Petrol Car / Station Wagon' },
  { value: 'petrol_hybrid', label: 'Petrol Hybrid Car / Station Wagon' },
  { value: 'petrol_phev', label: 'Petrol Plug-in Hybrid Car / Station Wagon' },
  { value: 'diesel_car', label: 'Diesel Car / Station Wagon' },
  { value: 'diesel_hybrid', label: 'Diesel Hybrid Car / Station Wagon' },
  { value: 'diesel_phev', label: 'Diesel Plug-in Hybrid Car / Station Wagon' },
  { value: 'electric_car', label: 'Electric Car / Station Wagon' },
  { value: 'cargo_petrol_van', label: 'Cargo Petrol Van' },
  { value: 'cargo_diesel_van', label: 'Cargo Diesel Van' },
  { value: 'petrol_14_van', label: 'Petrol Van 14 Seater' },
  { value: 'diesel_14_van', label: 'Diesel Van 14 Seater' },
  { value: 'double_cab', label: 'Double Cab' },
  { value: 'petrol_crew_cab', label: 'Petrol Crew Cab' },
  { value: 'diesel_crew_cab', label: 'Diesel Crew Cab' },
  { value: 'diesel_passenger_van', label: 'Diesel Passenger Van 13-24 Seats' },
]

const LUXURY_MAP: Record<string, { deduction: number; multiplier: number }> = {
  petrol_car: { deduction: 5000000, multiplier: 1.00 },
  petrol_hybrid: { deduction: 5500000, multiplier: 0.80 },
  petrol_phev: { deduction: 5500000, multiplier: 0.80 },
  diesel_car: { deduction: 5000000, multiplier: 1.20 },
  diesel_hybrid: { deduction: 5500000, multiplier: 0.90 },
  diesel_phev: { deduction: 5500000, multiplier: 0.90 },
  electric_car: { deduction: 6000000, multiplier: 0.60 },
  diesel_passenger_van: { deduction: 3500000, multiplier: 1.20 },
}

function money(n: number) {
  return 'Rs. ' + Math.round(n).toLocaleString('en-LK')
}

function getCCRate(cat: string, cc: number) {
  if (cat === 'petrol_car') {
    if (cc <= 660) return { xid: 1992000, hs: '8703.21.69', text: '≤660cc Per unit Rs.1,992,000' }
    if (cc <= 1000) return { xid: cc * 2450, hs: '8703.21.69', text: 'Rs.2,450/cc' }
    if (cc <= 1300) return { xid: cc * 3850, hs: '8703.22.50', text: 'Rs.3,850/cc' }
    if (cc <= 1500) return { xid: cc * 4450, hs: '8703.22.50', text: 'Rs.4,450/cc' }
    if (cc <= 1600) return { xid: cc * 5150, hs: '8703.23.52', text: 'Rs.5,150/cc' }
    if (cc <= 1800) return { xid: cc * 6400, hs: '8703.23.55', text: 'Rs.6,400/cc' }
    if (cc <= 2000) return { xid: cc * 7700, hs: '8703.23.59', text: 'Rs.7,700/cc' }
    if (cc <= 2500) return { xid: cc * 8450, hs: '8703.23.70', text: 'Rs.8,450/cc' }
    if (cc <= 2750) return { xid: cc * 9650, hs: '8703.23.70', text: 'Rs.9,650/cc' }
    if (cc <= 3000) return { xid: cc * 10850, hs: '8703.23.70', text: 'Rs.10,850/cc' }
    if (cc <= 4000) return { xid: cc * 12050, hs: '8703.24.50', text: 'Rs.12,050/cc' }
    return { xid: cc * 13300, hs: '8703.24.50', text: 'Rs.13,300/cc' }
  }
  if (cat === 'petrol_hybrid' || cat === 'petrol_phev') {
    const p = cat === 'petrol_hybrid' ? '8703.40' : '8703.60'
    if (cc <= 1000) return { xid: 1810900, hs: p + '.28', text: 'Per unit Rs.1,810,900' }
    if (cc <= 1300) return { xid: cc * 2750, hs: p + '.35', text: 'Rs.2,750/cc' }
    if (cc <= 1500) return { xid: cc * 3450, hs: p + '.35', text: 'Rs.3,450/cc' }
    if (cc <= 1600) return { xid: cc * 4800, hs: p + '.51', text: 'Rs.4,800/cc' }
    if (cc <= 1800) return { xid: cc * (cat === 'petrol_hybrid' ? 6300 : 6250), hs: p + '.53', text: cat === 'petrol_hybrid' ? 'Rs.6,300/cc' : 'Rs.6,250/cc' }
    if (cc <= 2000) return { xid: cc * 6900, hs: p + '.58', text: 'Rs.6,900/cc' }
    if (cc <= 2500) return { xid: cc * 7250, hs: p + '.71', text: 'Rs.7,250/cc' }
    if (cc <= 2750) return { xid: cc * 8450, hs: p + '.71', text: 'Rs.8,450/cc' }
    if (cc <= 3000) return { xid: cc * 9650, hs: p + '.71', text: 'Rs.9,650/cc' }
    if (cc <= 4000) return { xid: cc * 10850, hs: p + '.91', text: 'Rs.10,850/cc' }
    return { xid: cc * 12050, hs: p + '.91', text: 'Rs.12,050/cc' }
  }
  if (cat === 'diesel_car') {
    if (cc <= 1500) return { xid: cc * 5550, hs: '8703.31.70', text: 'Rs.5,550/cc' }
    if (cc <= 1600) return { xid: cc * 6950, hs: '8703.32.52', text: 'Rs.6,950/cc' }
    if (cc <= 1800) return { xid: cc * 8300, hs: '8703.32.55', text: 'Rs.8,300/cc' }
    if (cc <= 2500) return { xid: cc * 9650, hs: '8703.32.59/95', text: 'Rs.9,650/cc' }
    if (cc <= 2750) return { xid: cc * 10850, hs: '8703.33.50', text: 'Rs.10,850/cc' }
    if (cc <= 3000) return { xid: cc * 12050, hs: '8703.33.50', text: 'Rs.12,050/cc' }
    if (cc <= 4000) return { xid: cc * 13300, hs: '8703.33.50', text: 'Rs.13,300/cc' }
    return { xid: cc * 14500, hs: '8703.33.50', text: 'Rs.14,500/cc' }
  }
  if (cat === 'diesel_hybrid' || cat === 'diesel_phev') {
    const p = cat === 'diesel_hybrid' ? '8703.50' : '8703.70'
    if (cc <= 1500) return { xid: cc * 4150, hs: p + '.28/35', text: 'Rs.4,150/cc' }
    if (cc <= 1600) return { xid: cc * 5550, hs: p + '.51', text: 'Rs.5,550/cc' }
    if (cc <= 1800) return { xid: cc * 6900, hs: p + '.53', text: 'Rs.6,900/cc' }
    if (cc <= 2000) return { xid: cc * (cat === 'diesel_hybrid' ? 8350 : 8300), hs: p + '.58', text: cat === 'diesel_hybrid' ? 'Rs.8,350/cc' : 'Rs.8,300/cc' }
    if (cc <= 2500) return { xid: cc * 8450, hs: p + '.68/78', text: 'Rs.8,450/cc' }
    if (cc <= 2750) return { xid: cc * 9650, hs: p + '.68/78', text: 'Rs.9,650/cc' }
    if (cc <= 3000) return { xid: cc * 10850, hs: p + '.68/78', text: 'Rs.10,850/cc' }
    if (cc <= 4000) return { xid: cc * 12050, hs: p + '.88/98', text: 'Rs.12,050/cc' }
    return { xid: cc * 13300, hs: p + '.88/98', text: 'Rs.13,300/cc' }
  }
  if (cat === 'cargo_petrol_van' || cat === 'petrol_14_van' || cat === 'petrol_crew_cab')
    return { xid: cc * 2100, hs: cat === 'cargo_petrol_van' ? '8704.31.93' : cat === 'petrol_14_van' ? '8702.90.39' : '8704.31.71', text: 'Rs.2,100/cc' }
  if (cat === 'cargo_diesel_van' || cat === 'diesel_14_van')
    return { xid: 5432650, hs: cat === 'cargo_diesel_van' ? '8704.21.93' : '8702.10.39', text: 'Rs.5,432,650/unit' }
  if (cat === 'double_cab')
    return { xid: 6036300, hs: '8704.21.91 / 8704.31.91', text: 'Rs.6,036,300/unit' }
  if (cat === 'diesel_crew_cab')
    return { xid: 2414500, hs: '8704.21.71', text: 'Rs.2,414,500/unit' }
  if (cat === 'diesel_passenger_van')
    return { xid: cc * 9450, hs: '8703.32.79', text: 'Rs.9,450/cc' }
  return { xid: 0, hs: '-', text: '-' }
}

function getEVRate(kw: number, age: string) {
  let rate = 0, hs = ''
  if (age === 'brandnew') {
    if (kw <= 50) { rate = 9050; hs = '8703.80.31' }
    else if (kw <= 100) { rate = 12050; hs = '8703.80.32' }
    else if (kw <= 200) { rate = 18100; hs = '8703.80.33' }
    else { rate = 48300; hs = '8703.80.34' }
  } else {
    if (kw <= 50) { rate = 18100; hs = '8703.80.31' }
    else if (kw <= 100) { rate = 18100; hs = '8703.80.32' }
    else if (kw <= 200) { rate = 30200; hs = '8703.80.33' }
    else { rate = 66400; hs = '8703.80.34' }
  }
  return { xid: kw * rate, hs, text: `Rs.${rate.toLocaleString()}/kW` }
}

interface CalcResult {
  category: string
  hs: string
  xidRate: string
  cif: number
  xid: number
  cid: number
  sur: number
  luxuryTax: number
  sscl: number
  vat: number
  vel: number
  total: number
}

function TaxCalculatorPage() {
  const [category, setCategory] = useState('petrol_car')
  const [cif, setCif] = useState('')
  const [cc, setCc] = useState('')
  const [kw, setKw] = useState('')
  const [evAge, setEvAge] = useState('brandnew')
  const [cidRate, setCidRate] = useState('20')
  const [surRate, setSurRate] = useState('50')
  const [ssclRate, setSsclRate] = useState('2.5')
  const [vatRate, setVatRate] = useState('18')
  const [vel, setVel] = useState('15000')
  const [fx, setFx] = useState('')
  const [foreignCif, setForeignCif] = useState('')
  const [result, setResult] = useState<CalcResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const isEV = category === 'electric_car'

  function convertCIF() {
    const fxV = parseFloat(fx)
    const amtV = parseFloat(foreignCif)
    if (!fxV || !amtV) { setError('Enter converter rate and foreign CIF amount'); return }
    setCif(Math.round(fxV * amtV).toString())
    setError('')
  }

  function calculate() {
    const cifV = parseFloat(cif)
    const ccV = parseFloat(cc)
    const kwV = parseFloat(kw)
    if (!cifV || (isEV && !kwV) || (!isEV && !ccV)) {
      setError('Please enter all required fields')
      return
    }
    setError('')

    const xidData = isEV ? getEVRate(kwV, evAge) : getCCRate(category, ccV)
    const xid = xidData.xid
    const cidV = cifV * (parseFloat(cidRate) / 100)
    const surV = cidV * (parseFloat(surRate) / 100)

    let luxuryTax = 0
    const lux = LUXURY_MAP[category]
    if (lux) {
      const excess = cifV - lux.deduction
      if (excess > 0) luxuryTax = excess * lux.multiplier
    }

    const ssclV = (cifV + xid + cidV + surV + luxuryTax) * (parseFloat(ssclRate) / 100)
    const vatV = (cifV * 1.10 + xid + cidV + surV + luxuryTax + ssclV) * (parseFloat(vatRate) / 100)
    const velV = parseFloat(vel) || 0
    const total = xid + cidV + surV + luxuryTax + ssclV + vatV + velV

    setResult({
      category: CATEGORIES.find(c => c.value === category)?.label || category,
      hs: xidData.hs,
      xidRate: xidData.text,
      cif: cifV,
      xid,
      cid: cidV,
      sur: surV,
      luxuryTax,
      sscl: ssclV,
      vat: vatV,
      vel: velV,
      total,
    })
  }

  function reset() {
    setCif(''); setCc(''); setKw(''); setFx(''); setForeignCif('')
    setCidRate('20'); setSurRate('50'); setSsclRate('2.5'); setVatRate('18'); setVel('15000')
    setResult(null); setError('')
  }

  function copyResult() {
    if (!result) return
    const text = [
      `Vehicle: ${result.category}`,
      `HS Code: ${result.hs}`,
      `CIF: ${money(result.cif)}`,
      `XID Duty: ${money(result.xid)}`,
      `CID: ${money(result.cid)}`,
      `SUR: ${money(result.sur)}`,
      `Luxury Tax: ${money(result.luxuryTax)}`,
      `SSCL: ${money(result.sscl)}`,
      `VAT: ${money(result.vat)}`,
      `VEL: ${money(result.vel)}`,
      `TOTAL IMPORT TAX: ${money(result.total)}`,
    ].join('\n')
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const inputStyle = {
    width: '100%',
    padding: '0.7rem 1rem',
    background: 'var(--dark-3)',
    border: '1px solid var(--border-light)',
    color: 'var(--text-primary)',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '0.88rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  }

  const labelStyle = {
    fontSize: '0.68rem',
    fontWeight: 700 as const,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: 'var(--gold)',
    display: 'block',
    marginBottom: '0.4rem',
  }

  return (
    <main style={{ minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{
        background: 'var(--dark-2)',
        borderBottom: '1px solid var(--border)',
        padding: '3.5rem 2rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="hero-orb" style={{ width: '400px', height: '400px', background: 'rgba(184,0,0,0.07)', top: '-150px', right: '10%' }} />
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="section-tag" style={{ marginBottom: '0.75rem' }}>Free Tool · Gazette XID Rates</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700, margin: '0 0 0.75rem' }}>
            Sri Lanka Vehicle Import Tax Calculator
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.92rem', maxWidth: '600px', lineHeight: 1.7 }}>
            Calculate XID, CID, SUR, SSCL, VAT, Luxury Tax, and VEL based on the latest gazette rates. Direct importers since establishment — Amila Car Sale Pvt Ltd, Bandarawela.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '2rem', alignItems: 'start' }}>

          {/* Input form */}
          <div>
            <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '2rem', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 600, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                Vehicle Details
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {/* Category */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Vehicle Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>

                {/* CIF */}
                <div>
                  <label style={labelStyle}>CIF Value (LKR)</label>
                  <input type="number" value={cif} onChange={e => setCif(e.target.value)} placeholder="e.g. 5000000" style={inputStyle} />
                </div>

                {/* CC or kW */}
                {!isEV ? (
                  <div>
                    <label style={labelStyle}>Engine Capacity (CC)</label>
                    <input type="number" value={cc} onChange={e => setCc(e.target.value)} placeholder="e.g. 1500" style={inputStyle} />
                  </div>
                ) : (
                  <>
                    <div>
                      <label style={labelStyle}>Motor Power (kW)</label>
                      <input type="number" value={kw} onChange={e => setKw(e.target.value)} placeholder="e.g. 100" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>EV Condition</label>
                      <select value={evAge} onChange={e => setEvAge(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option value="brandnew">Brand New / 1 Year</option>
                        <option value="used">Used / More than 1 Year</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Rate overrides */}
            <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '2rem', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 600, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                Tax Rates
                <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.75rem', fontStyle: 'italic' }}>pre-filled with current defaults</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.25rem' }}>
                {[
                  { label: 'CID %', value: cidRate, set: setCidRate },
                  { label: 'SUR % of CID', value: surRate, set: setSurRate },
                  { label: 'SSCL %', value: ssclRate, set: setSsclRate },
                  { label: 'VAT %', value: vatRate, set: setVatRate },
                  { label: 'VEL (LKR)', value: vel, set: setVel },
                ].map(({ label, value, set }) => (
                  <div key={label}>
                    <label style={labelStyle}>{label}</label>
                    <input type="number" value={value} onChange={e => set(e.target.value)} step="0.01" style={inputStyle} />
                  </div>
                ))}
              </div>
            </div>

            {/* Currency converter */}
            <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '2rem', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 600, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                Currency Converter <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)', fontStyle: 'italic' }}>(optional)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>JPY/USD to LKR Rate</label>
                  <input type="number" value={fx} onChange={e => setFx(e.target.value)} placeholder="e.g. 0.50" step="0.0001" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Foreign CIF Amount</label>
                  <input type="number" value={foreignCif} onChange={e => setForeignCif(e.target.value)} placeholder="e.g. 3500000" style={inputStyle} />
                </div>
              </div>
              <button onClick={convertCIF} style={{
                background: 'var(--dark-3)',
                border: '1px solid var(--border)',
                color: 'var(--gold)',
                padding: '0.65rem 1.25rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'background 0.2s ease',
              }}>
                Convert → Fill CIF
              </button>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: 'rgba(184,0,0,0.15)', border: '1px solid rgba(184,0,0,0.4)', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#f87171', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <button onClick={calculate} className="btn-gold" style={{ justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                Calculate Import Tax
              </button>
              <button onClick={reset} style={{
                background: 'var(--dark-3)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-muted)',
                padding: '0.75rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'color 0.2s ease',
              }}>
                Reset
              </button>
            </div>
          </div>

          {/* Results panel */}
          <div style={{ position: 'sticky', top: '90px' }}>
            {!result ? (
              <div style={{
                background: 'var(--dark-2)',
                border: '1px solid var(--border)',
                padding: '3rem 2rem',
                textAlign: 'center',
              }}>
                <svg style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>No calculation yet</div>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>
                  Fill in the vehicle details and press Calculate Import Tax to see a full breakdown.
                </p>
              </div>
            ) : (
              <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)' }}>
                {/* Result header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.25rem' }}>Tax Breakdown</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{result.category}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>HS: {result.hs} · Rate: {result.xidRate}</div>
                </div>

                {/* Line items */}
                <div style={{ padding: '1rem 1.5rem' }}>
                  {[
                    { label: 'CIF Value', value: result.cif, highlight: false },
                    { label: 'XID (Excise/Import Duty)', value: result.xid, highlight: false },
                    { label: 'CID (Customs Import Duty)', value: result.cid, highlight: false },
                    { label: 'SUR (Surcharge)', value: result.sur, highlight: false },
                    { label: 'Luxury Tax', value: result.luxuryTax, highlight: false },
                    { label: 'SSCL', value: result.sscl, highlight: false },
                    { label: 'VAT', value: result.vat, highlight: false },
                    { label: 'VEL (Vehicle Emission Levy)', value: result.vel, highlight: false },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.6rem 0',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      gap: '1rem',
                    }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{label}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: highlight ? 'var(--gold)' : 'var(--text-primary)', whiteSpace: 'nowrap', fontFamily: 'DM Mono, monospace' }}>
                        {money(value)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div style={{
                  margin: '0 1.5rem 1.5rem',
                  background: 'var(--dark)',
                  border: '1px solid var(--gold)',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 700 }}>Total Import Tax</span>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold)' }}>
                    {money(result.total)}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ padding: '0 1.5rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button onClick={() => window.print()} style={{
                    background: 'var(--dark-3)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-muted)',
                    padding: '0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                    Print PDF
                  </button>
                  <button onClick={copyResult} style={{
                    background: copied ? 'rgba(15,118,110,0.2)' : 'var(--dark-3)',
                    border: `1px solid ${copied ? 'rgba(52,211,153,0.4)' : 'var(--border-light)'}`,
                    color: copied ? '#34d399' : 'var(--text-muted)',
                    padding: '0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s ease',
                  }}>
                    {copied ? (
                      <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
                    ) : (
                      <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div style={{ background: 'var(--dark-3)', border: '1px solid var(--border)', padding: '1.25rem 1.5rem', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: 1.7 }}>
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>Important: </span>
              This is an estimate based on the latest XID gazette rates. Final duty payable may vary based on Customs valuation, exchange rates, HS classification, vehicle age, and any subsequent Gazette updates.
            </div>

            {/* Contact CTA */}
            <div style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', padding: '1.5rem', marginTop: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Need help with the import process?</div>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.78rem', lineHeight: 1.6, margin: '0 0 0.75rem' }}>Contact our team for personalized assistance and a full landed cost quote.</p>
              <a href="tel:+94754543533" style={{ color: 'var(--gold)', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                Call: 075 454 3533 →
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          main > div:last-child > div {
            grid-template-columns: 1fr !important;
          }
          main > div:last-child > div > div:last-child {
            position: static !important;
          }
        }
        @media print {
          nav, footer { display: none !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>
    </main>
  )
}
