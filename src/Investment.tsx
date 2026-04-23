import { useState, useEffect, useRef, useCallback } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Holding {
  ticker: string
  name: string
  shares: number
  avgCost: number
}

interface PriceData {
  price: number
  change: number
  changePercent: number
  fetchedAt: number
}

// ── Holdings config ───────────────────────────────────────────────────────────
// Fill in your real tickers, share counts, and average cost bases before deploy.

const HOLDINGS: Holding[] = [
  { ticker: 'AAPL', name: 'Apple Inc.',        shares: 0, avgCost: 0 },
  { ticker: 'MSFT', name: 'Microsoft Corp.',   shares: 0, avgCost: 0 },
  { ticker: 'NVDA', name: 'NVIDIA Corp.',      shares: 0, avgCost: 0 },
]

// ── API / cache helpers ───────────────────────────────────────────────────────

const AV_KEY    = import.meta.env.VITE_AV_KEY    as string | undefined
const CACHE_KEY = 'dr_portfolio_prices'
const CACHE_TTL = 15 * 60 * 1000 // 15 minutes

function getCached(): Record<string, PriceData> | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Record<string, PriceData>
    const expired = Object.values(data).some(d => Date.now() - d.fetchedAt > CACHE_TTL)
    return expired ? null : data
  } catch {
    return null
  }
}

function setCache(prices: Record<string, PriceData>) {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(prices)) } catch { /* ignore */ }
}

async function fetchPrice(ticker: string): Promise<PriceData | null> {
  if (!AV_KEY) return null
  try {
    const url =
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${AV_KEY}`
    const res  = await fetch(url)
    const json = await res.json()
    const q    = json['Global Quote']
    if (!q?.['05. price']) return null
    return {
      price:         parseFloat(q['05. price']),
      change:        parseFloat(q['09. change']),
      changePercent: parseFloat((q['10. change percent'] as string).replace('%', '')),
      fetchedAt:     Date.now(),
    }
  } catch {
    return null
  }
}

// ── Formatting helpers ────────────────────────────────────────────────────────

const fmt    = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`

// ── PIN Modal ─────────────────────────────────────────────────────────────────

interface PinModalProps {
  onSuccess: () => void
  onClose:   () => void
}

export function PinModal({ onSuccess, onClose }: PinModalProps) {
  const CORRECT = import.meta.env.VITE_PORTFOLIO_PIN as string | undefined

  const [pin,      setPin]      = useState('')
  const [error,    setError]    = useState('')
  const [shake,    setShake]    = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [cooldown, setCooldown] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const submit = () => {
    if (cooldown > 0 || !pin) return

    if (!CORRECT) {
      setError('PIN not configured. Add VITE_PORTFOLIO_PIN to .env.local.')
      return
    }

    if (pin === CORRECT) {
      onSuccess()
    } else {
      const next = attempts + 1
      setAttempts(next)
      setShake(true)
      setTimeout(() => setShake(false), 600)
      setPin('')

      if (next >= 3) {
        setError('Too many attempts. Please wait 30 seconds.')
        setCooldown(30)
        setAttempts(0)
      } else {
        setError(`Incorrect PIN. ${3 - next} attempt${3 - next === 1 ? '' : 's'} remaining.`)
      }
    }
  }

  return (
    <div className="pin-overlay" onClick={onClose}>
      <div
        className={`pin-modal${shake ? ' pin-modal--shake' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <button className="pin-modal__close" onClick={onClose} aria-label="Close">✕</button>
        <div className="pin-modal__icon">🔒</div>
        <h3 className="pin-modal__title">Private Section</h3>
        <p className="pin-modal__sub">Enter your PIN to unlock</p>

        <input
          ref={inputRef}
          className="pin-modal__input"
          type="password"
          inputMode="numeric"
          maxLength={8}
          value={pin}
          placeholder="••••••"
          onChange={e => { setPin(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          disabled={cooldown > 0}
          autoComplete="off"
        />

        {error && (
          <p className="pin-modal__error">
            {cooldown > 0 ? `${error} (${cooldown}s)` : error}
          </p>
        )}

        <button
          className="btn"
          style={{ marginTop: '16px' }}
          onClick={submit}
          disabled={cooldown > 0 || !pin}
        >
          Unlock
        </button>
      </div>
    </div>
  )
}

// ── Investment Section ────────────────────────────────────────────────────────

interface InvestmentSectionProps {
  onLock: () => void
}

export function InvestmentSection({ onLock }: InvestmentSectionProps) {
  const [prices,   setPrices]   = useState<Record<string, PriceData | null>>({})
  const [loading,  setLoading]  = useState(true)
  const [isCached, setIsCached] = useState(false)

  const loadPrices = useCallback(async (forceRefresh = false) => {
    setLoading(true)

    if (!forceRefresh) {
      const cached = getCached()
      if (cached) {
        const map: Record<string, PriceData | null> = {}
        HOLDINGS.forEach(h => { map[h.ticker] = cached[h.ticker] ?? null })
        setPrices(map)
        setIsCached(true)
        setLoading(false)
        return
      }
    }

    setIsCached(false)

    const results = await Promise.allSettled(
      HOLDINGS.map(async h => ({ ticker: h.ticker, data: await fetchPrice(h.ticker) }))
    )

    const map: Record<string, PriceData | null> = {}
    HOLDINGS.forEach(h => { map[h.ticker] = null })
    results.forEach(r => {
      if (r.status === 'fulfilled') map[r.value.ticker] = r.value.data
    })

    setPrices(map)

    const toCache: Record<string, PriceData> = {}
    Object.entries(map).forEach(([k, v]) => { if (v) toCache[k] = v })
    if (Object.keys(toCache).length > 0) setCache(toCache)

    setLoading(false)
  }, [])

  useEffect(() => { loadPrices() }, [loadPrices])

  // Derived totals
  let totalValue = 0, totalCost = 0
  HOLDINGS.forEach(h => {
    const p = prices[h.ticker]
    totalValue += (p?.price ?? 0) * h.shares
    totalCost  += h.avgCost * h.shares
  })
  const totalGain    = totalValue - totalCost
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0
  const portfolioPos = totalGain >= 0

  return (
    <section id="investment" className="section investment">
      <div className="container">
        <h2 className="section__heading">
          Portfolio
          <button className="investment__lock-btn" onClick={onLock} title="Lock section">
            🔒 Lock
          </button>
        </h2>

        {!AV_KEY && (
          <p className="investment__notice">
            ⚠ No API key found. Add <code>VITE_AV_KEY</code> to <code>.env.local</code> for live prices.
          </p>
        )}

        {loading ? (
          <div className="investment__loading">
            <div className="investment__spinner" />
            <p>{AV_KEY ? 'Fetching live prices…' : 'No API key — showing placeholder data'}</p>
          </div>
        ) : (
          <>
            <div className="investment__overview">
              <div className="investment__stat">
                <span className="investment__stat-label">Total Value</span>
                <span className="investment__stat-value">{fmt(totalValue)}</span>
              </div>
              <div className="investment__stat">
                <span className="investment__stat-label">Total Gain / Loss</span>
                <span className={`investment__stat-value ${portfolioPos ? 'investment--gain' : 'investment--loss'}`}>
                  {fmt(totalGain)} ({fmtPct(totalGainPct)})
                </span>
              </div>
              <div className="investment__actions">
                {isCached && <span className="investment__cached">⚠ Cached</span>}
                {AV_KEY && (
                  <button className="btn" style={{ marginTop: 0 }} onClick={() => loadPrices(true)}>
                    Refresh
                  </button>
                )}
              </div>
            </div>

            <div className="investment__table-wrap">
              <table className="investment__table">
                <thead>
                  <tr>
                    <th>Ticker</th><th>Name</th><th>Shares</th>
                    <th>Avg Cost</th><th>Price</th><th>Value</th><th>Gain / Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {HOLDINGS.map(h => {
                    const p       = prices[h.ticker]
                    const value   = (p?.price ?? 0) * h.shares
                    const cost    = h.avgCost * h.shares
                    const gain    = value - cost
                    const gainPct = cost > 0 ? (gain / cost) * 100 : 0
                    const pos     = gain >= 0
                    return (
                      <tr key={h.ticker}>
                        <td className="investment__ticker">{h.ticker}</td>
                        <td>{h.name}</td>
                        <td>{h.shares}</td>
                        <td>{fmt(h.avgCost)}</td>
                        <td>{p ? fmt(p.price) : '—'}</td>
                        <td>{p ? fmt(value) : '—'}</td>
                        <td className={pos ? 'investment--gain' : 'investment--loss'}>
                          {p ? `${fmt(gain)} (${fmtPct(gainPct)})` : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
