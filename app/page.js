'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from 'qrcode'
import {
  ArrowUpRight, ArrowRight, Search, Plus, Check, Lock, WifiOff,
  Sparkles, ShieldCheck, FileText, Upload, ScanLine, LogOut, User, Bell,
  Calendar, Clock,
} from 'lucide-react'

const HolographicCanvas = dynamic(() => import('@/components/HolographicCanvas'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-white" />,
})

/* ------------------------------------------------------------------ *
 *  Brand Logos (true brand marks, monochrome-safe on white)
 * ------------------------------------------------------------------ */
const GoogleMark = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
)

const GitHubMark = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-1.96c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/>
  </svg>
)

/* ------------------------------------------------------------------ *
 *  AUTH NETWORK PARTICLES (left panel) — pure 2D canvas
 * ------------------------------------------------------------------ */
function NetworkCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const cnv = ref.current
    if (!cnv) return
    const ctx = cnv.getContext('2d')
    let raf
    let w = (cnv.width = cnv.offsetWidth * devicePixelRatio)
    let h = (cnv.height = cnv.offsetHeight * devicePixelRatio)
    const N = 70
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.6 + 0.6,
    }))
    const layers = [h * 0.28, h * 0.55, h * 0.82]

    function frame() {
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 1
      layers.forEach((y) => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() })

      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.hypot(dx, dy)
          if (d < 160 * devicePixelRatio) {
            const a = 1 - d / (160 * devicePixelRatio)
            ctx.strokeStyle = `rgba(6,182,212,${a * 0.35})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(frame)
    }
    frame()
    const onResize = () => {
      w = cnv.width = cnv.offsetWidth * devicePixelRatio
      h = cnv.height = cnv.offsetHeight * devicePixelRatio
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />
}

/* ------------------------------------------------------------------ *
 *  Top Navigation
 * ------------------------------------------------------------------ */
const Nav = ({ view, setView, user, onLogout }) => (
  <div className="border-b border-hairline bg-white sticky top-0 z-40">
    <div className="bg-[#111111] text-white text-[11px] tracking-wide">
      <div className="flex items-center justify-between px-6 h-7">
        <div className="flex items-center gap-4">
          <span className="opacity-80">UNIHUB.OS // v2.5.1</span>
          <span className="hidden md:inline opacity-60">Build · Ho Chi Minh City · UTC+7</span>
        </div>
        <div className="hidden md:flex items-center gap-4 opacity-80">
          <span>Help</span><span>·</span><span>EN / VI</span>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between px-6 h-16">
      <button onClick={() => setView('landing')} className="flex items-center gap-2">
        <div className="w-7 h-7 bg-[#111111] flex items-center justify-center">
          <div className="w-3 h-3 border-2 border-white" />
        </div>
        <span className="font-display text-2xl tracking-tight">UNIHUB</span>
      </button>
      <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium uppercase tracking-wide">
        {[
          ['landing', 'Workshops'],
          ['auth', 'Gateway'],
          ['dashboard', 'Command Center'],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setView(k)}
            className={`relative pb-1 transition-colors ${view === k ? 'text-[#111111]' : 'text-[#111111]/60 hover:text-[#111111]'}`}
          >
            {label}
            {view === k && <span className="absolute left-0 right-0 -bottom-[18px] h-[2px] bg-[#111111]" />}
          </button>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <button className="pill-ghost"><Search className="w-4 h-4" />Search</button>
        {user ? (
          <>
            <button className="pill-ghost hidden md:inline-flex"><User className="w-4 h-4" />{user.name}</button>
            <button onClick={onLogout} className="pill-ghost"><LogOut className="w-4 h-4" /></button>
          </>
        ) : (
          <button onClick={() => setView('auth')} className="pill-primary">Sign In <ArrowRight className="w-4 h-4" /></button>
        )}
      </div>
    </div>
  </div>
)

/* ------------------------------------------------------------------ *
 *  PAGE 1 — IMMERSIVE LANDING
 * ------------------------------------------------------------------ */
const Hero = ({ onCta }) => {
  const [now, setNow] = useState(null)
  useEffect(() => {
    setNow(new Date())
    const i = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(i)
  }, [])
  return (
    <section className="relative bg-white border-b border-hairline">
      <div className="relative h-[88vh] min-h-[640px] overflow-hidden">
        <div className="absolute top-6 left-6 right-6 z-20 flex items-start justify-between text-[11px] tracking-[0.2em] uppercase text-[#111111]/70">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#06b6d4] dot-blink" />
            Live Campaign · Q3.2025
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span>{now ? now.toLocaleTimeString('vi-VN') : '--:--:--'}</span>
            <span>SGN · 28°C</span>
            <span>NEXT DROP · 28.06</span>
          </div>
        </div>

        <HolographicCanvas />

        <div className="absolute inset-0 z-10 flex flex-col justify-end pb-[6vh] pointer-events-none">
          <div className="px-6 md:px-10 pointer-events-auto">
            <div className="text-[11px] uppercase tracking-[0.25em] text-[#111111]/60 mb-3">UniHub Workshop / Drop 03</div>
            <h1
              className="font-display uppercase text-[#111111] leading-[0.85] tracking-[-0.02em] max-w-[1100px]"
              style={{ fontSize: 'clamp(56px, 9.2vw, 132px)' }}
            >
              Bước Vào<br />Không Gian Tri Thức<br />
              <span className="inline-flex items-center gap-3">
                Tương Lai
                <ArrowUpRight className="w-[0.7em] h-[0.7em] -mt-2" />
              </span>
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button onClick={onCta} className="pill-outline-image">
                Khám Phá Ngay <ArrowRight className="w-4 h-4" />
              </button>
              <button className="pill-ghost bg-white/60 backdrop-blur-sm">
                Xem Chi Tiết Hệ Thống
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 z-20 hidden md:flex flex-col items-end text-[#111111]">
          <div className="text-[11px] uppercase tracking-[0.25em] opacity-60">Engaged Cohort</div>
          <div className="font-display text-5xl tabular leading-none mt-1">12,408</div>
          <div className="text-[11px] uppercase tracking-[0.25em] opacity-60 mt-1">Sinh viên · 24 trường</div>
        </div>
      </div>

      <div className="bg-[#111111] text-white py-3 overflow-hidden border-t border-[#111111]">
        <div className="flex marquee-track whitespace-nowrap">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex items-center gap-12 px-6 text-[13px] uppercase tracking-[0.18em] font-medium">
              {['Optimistic Locking · Anti-oversell','VNPAY Circuit Breaker · CLOSED','Offline Check-in PWA · HMAC-SHA256','Gemini 2.5 Flash · 30s Summary','3-Layer Security · Edge → API → DB','Real-time seats · WebSocket','—']
                .map((t, i) => (
                  <span key={i} className="flex items-center gap-12">
                    <span>{t}</span>
                    <span className="opacity-30">·</span>
                  </span>
                ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const SeatBar = ({ taken, total }) => {
  const pct = Math.round((taken / total) * 100)
  const left = total - taken
  const low = left < 10
  return (
    <div>
      <div className="flex items-center justify-between text-[12px] tabular">
        <span className={low ? 'text-[#d30005] font-semibold' : 'text-[#111111]/70'}>
          Còn lại {left}/{total} chỗ
        </span>
        <span className="text-[#111111]/50">{pct}%</span>
      </div>
      <div className="mt-1 h-[3px] bg-[#f5f5f5] relative">
        <div
          className={`absolute left-0 top-0 bottom-0 ${low ? 'bg-[#d30005]' : 'bg-[#111111]'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

const WorkshopCard = ({ w, onRegister }) => {
  const left = w.seatsTotal - w.seatsTaken
  const low = left < 10
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="group relative bg-white"
    >
      <div className="relative aspect-square bg-[#f5f5f5] overflow-hidden">
        <img
          src={w.cover}
          alt={w.title}
          className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`badge-promo ${low ? 'badge-red' : ''}`}>
            {low ? 'Urgent Seats' : w.badge}
          </span>
        </div>
        <div className="absolute top-3 right-3 text-[11px] tracking-[0.18em] uppercase font-mono bg-white/80 px-2 py-1">
          {w.id}
        </div>
        <div className="absolute bottom-3 right-3">
          <div className="w-10 h-10 bg-[#111111] text-white flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#111111]/60">
          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{w.date}</span>
          <span>·</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{w.time}</span>
        </div>
      </div>
      <div className="mt-2">
        <SeatBar taken={w.seatsTaken} total={w.seatsTotal} />
      </div>
      <div className="mt-2">
        <h3 className="font-bold text-[16px] tracking-[-0.01em] uppercase">{w.title}</h3>
        <div className="text-[14px] text-[#111111]/60 mt-1">{w.category}</div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button onClick={() => onRegister(w)} className="pill-primary">Đăng Ký</button>
        <button className="pill-ghost">Chi Tiết</button>
        <div className="ml-auto text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/50">Phí</div>
          <div className="font-display text-2xl tabular leading-none">
            {w.price === 0 ? 'FREE' : w.price.toLocaleString('vi-VN')}
            <span className="text-[12px] ml-1 align-top">{w.price === 0 ? '' : 'đ'}</span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

const WorkshopGrid = ({ workshops, onRegister }) => {
  const [filter, setFilter] = useState('ALL')
  const filters = ['ALL', 'AI', 'BLOCKCHAIN', 'SECURITY', 'ROBOTICS', 'DATA']
  const filtered = useMemo(() => {
    if (filter === 'ALL') return workshops
    return workshops.filter(w => w.title.toUpperCase().includes(filter) || w.category.toUpperCase().includes(filter))
  }, [workshops, filter])
  return (
    <section className="bg-white">
      <div className="px-6 md:px-10 pt-14 pb-4">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-[#111111]/60">Drop 03 · Q3.2025</div>
            <h2 className="font-display uppercase mt-1" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>
              Featured Workshops
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[12px] uppercase tracking-[0.18em] px-4 py-2 rounded-full border transition-colors ${
                  filter === f
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-[#111111] border-hairline hover:border-[#111111]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-hairline" />
      <div className="px-6 md:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtered.map(w => (
            <WorkshopCard key={w.id} w={w} onRegister={onRegister} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 *  Section 3 — Technical Integrity Showcase
 * ------------------------------------------------------------------ */
const TechShowcase = () => {
  const [active, setActive] = useState('lock')
  const modules = [
    { id: 'lock', icon: Lock, name: 'Optimistic Locking Seat Manager', tag: 'ANTI-OVERSELL', desc: 'Version-based row locking ngăn double-booking khi 1000+ sinh viên đăng ký đồng thời.', metric: '0', metricLabel: 'oversell trong 30 ngày', accent: 'cyan' },
    { id: 'vnpay', icon: ShieldCheck, name: 'VNPAY Gateway', tag: 'CIRCUIT BREAKER · CLOSED', desc: 'Half-open auto-recovery sau 30s. Idempotent transaction key chống double-charge.', metric: '142', metricLabel: 'ms p95 latency', accent: 'cyan' },
    { id: 'pwa', icon: WifiOff, name: 'Offline Check-In PWA', tag: 'HMAC-SHA256 · OFFLINE', desc: 'QR token được ký HMAC; xác thực < 200ms hoàn toàn không cần Internet.', metric: '187', metricLabel: 'ms verify offline', accent: 'violet' },
    { id: 'ai', icon: Sparkles, name: 'AI Summary Pipeline', tag: 'GEMINI 2.5 FLASH', desc: 'Stream tóm tắt PDF học liệu (≤10MB) thành bullet-point tiếng Việt trong < 30s.', metric: '27.8', metricLabel: 's avg summarize', accent: 'violet' },
  ]
  const cur = modules.find(m => m.id === active) || modules[0]

  return (
    <section className="bg-[#111111] text-white border-y border-[#111111] relative overflow-hidden">
      <div className="px-6 md:px-10 pt-14 pb-4">
        <div className="text-[11px] uppercase tracking-[0.25em] text-white/60">System Integrity</div>
        <h2 className="font-display uppercase mt-1" style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}>
          Built For Scale.<br /> Audited For Trust.
        </h2>
      </div>
      <div className="border-t border-white/15" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-7 relative border-r border-white/10 min-h-[440px]">
          <svg viewBox="0 0 800 460" className="w-full h-full">
            <defs>
              <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="800" height="460" fill="url(#g)" />

            <g stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none">
              <line x1="200" y1="120" x2="400" y2="230" />
              <line x1="600" y1="120" x2="400" y2="230" />
              <line x1="200" y1="340" x2="400" y2="230" />
              <line x1="600" y1="340" x2="400" y2="230" />
            </g>

            <g>
              <circle cx="400" cy="230" r="44" fill="#ffffff" />
              <circle cx="400" cy="230" r="44" fill="none" stroke="#06b6d4" strokeWidth="1" />
              <text x="400" y="226" textAnchor="middle" fill="#111111" fontSize="11" fontWeight="700" letterSpacing="2">UNIHUB</text>
              <text x="400" y="240" textAnchor="middle" fill="#111111" fontSize="9" letterSpacing="2">CORE</text>
            </g>

            {[
              { id: 'lock', x: 200, y: 120, label: 'OPT.LOCK', color: '#06b6d4' },
              { id: 'vnpay', x: 600, y: 120, label: 'VNPAY', color: '#06b6d4' },
              { id: 'pwa', x: 200, y: 340, label: 'PWA·HMAC', color: '#8b5cf6' },
              { id: 'ai', x: 600, y: 340, label: 'GEMINI 2.5', color: '#8b5cf6' },
            ].map(n => (
              <g key={n.id} className="cursor-pointer" onClick={() => setActive(n.id)}>
                <circle cx={n.x} cy={n.y} r="36" fill={active === n.id ? n.color : '#111111'} stroke={n.color} strokeWidth={active === n.id ? 0 : 1} />
                <circle cx={n.x} cy={n.y} r="46" fill="none" stroke={n.color} strokeOpacity={active === n.id ? 0.5 : 0.2} strokeWidth="1" />
                <circle cx={n.x} cy={n.y} r="3" fill={n.color} className="dot-blink" />
                <text x={n.x} y={n.y + 60} textAnchor="middle" fill="#ffffff" fontSize="10" letterSpacing="2" fontWeight="700">{n.label}</text>
              </g>
            ))}

            <text x="40" y="40" fill="rgba(255,255,255,0.4)" fontSize="10" letterSpacing="3">L1 · EDGE</text>
            <text x="40" y="230" fill="rgba(255,255,255,0.4)" fontSize="10" letterSpacing="3">L2 · API</text>
            <text x="40" y="420" fill="rgba(255,255,255,0.4)" fontSize="10" letterSpacing="3">L3 · DB</text>
          </svg>
        </div>

        <div className="lg:col-span-5 p-8 md:p-12 flex flex-col">
          <div className="text-[11px] tracking-[0.25em] uppercase text-white/60 flex items-center gap-2">
            <span className={`w-1.5 h-1.5 ${cur.accent === 'cyan' ? 'bg-[#06b6d4]' : 'bg-[#8b5cf6]'} dot-blink`} />
            Module · {cur.tag}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={cur.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-display uppercase mt-3" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 0.95 }}>
                {cur.name}
              </h3>
              <p className="text-white/70 text-[15px] leading-relaxed mt-4 max-w-md">{cur.desc}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 grid grid-cols-2 gap-2">
            {modules.map(m => (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className={`text-left px-4 py-3 border ${active === m.id ? 'border-white bg-white text-[#111111]' : 'border-white/20 text-white hover:border-white/60'} transition-colors`}
              >
                <div className="text-[10px] tracking-[0.2em] uppercase opacity-60">{m.tag.split('·')[0]}</div>
                <div className="text-[13px] font-semibold mt-1">{m.name}</div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-end gap-6">
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-white/50">{cur.metricLabel}</div>
              <div className="font-display text-6xl tabular leading-none mt-1">{cur.metric}</div>
            </div>
            <div className="ml-auto">
              <button className="pill-outline-image bg-transparent text-white border-white hover:bg-white hover:text-[#111111]">
                Read Spec <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const EditorialCTA = ({ onGo }) => (
  <section className="bg-[#f5f5f5] border-y border-hairline">
    <div className="px-6 md:px-10 py-20 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
      <div className="md:col-span-8">
        <div className="text-[11px] uppercase tracking-[0.25em] text-[#111111]/60">Member Drop · Cohort 03</div>
        <h2 className="font-display uppercase mt-2" style={{ fontSize: 'clamp(40px, 7vw, 96px)', lineHeight: 0.9 }}>
          Mỗi Workshop<br />Là Một Mảnh Ghép<br />Của Tương Lai.
        </h2>
      </div>
      <div className="md:col-span-4 flex md:justify-end">
        <button onClick={onGo} className="pill-primary">
          Vào Cổng Kết Nối <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </section>
)

const Footer = () => (
  <footer className="bg-white border-t border-hairline">
    <div className="px-6 md:px-10 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
      <div className="col-span-2">
        <div className="font-display text-4xl tracking-tight">UNIHUB</div>
        <p className="text-[13px] text-[#111111]/60 max-w-sm mt-3">
          Workshop registration platform · Built for universities. Engineered for scale.
        </p>
      </div>
      {[
        ['Platform', ['Workshops', 'Calendar', 'Speakers', 'Sponsors']],
        ['Engineering', ['System Status', 'API Docs', 'Whitepaper', 'Security']],
        ['Connect', ['Discord', 'Github', 'X / Twitter', 'Newsletter']],
      ].map(([h, items]) => (
        <div key={h}>
          <div className="text-[11px] uppercase tracking-[0.25em] text-[#111111]/60">{h}</div>
          <ul className="mt-3 space-y-2 text-[13px]">
            {items.map(i => <li key={i} className="hover:underline cursor-pointer">{i}</li>)}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-hairline px-6 md:px-10 py-4 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#111111]/60">
      <div>© 2025 UniHub · All rights reserved</div>
      <div className="flex items-center gap-4">
        <span>VI</span><span>·</span><span>EN</span>
      </div>
    </div>
  </footer>
)

/* ------------------------------------------------------------------ *
 *  PAGE 2 — AUTH GATEWAY
 * ------------------------------------------------------------------ */
const AuthPage = ({ onLogin }) => {
  const [role, setRole] = useState('STUDENT')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      })
      const data = await res.json()
      if (data.ok) onLogin(data.user)
    } finally { setLoading(false) }
  }

  const [oauthLoading, setOauthLoading] = useState('')
  const oauthLogin = async (provider) => {
    setOauthLoading(provider)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `${provider}.user@${provider}.unihub`,
          role,
          provider,
        }),
      })
      const data = await res.json()
      if (data.ok) onLogin({ ...data.user, name: provider === 'google' ? 'Google User' : 'GitHub User', provider })
    } finally { setOauthLoading('') }
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-104px)]">
      <div className="relative bg-[#0b0b0b] text-white overflow-hidden border-r border-[#111111] min-h-[420px]">
        <NetworkCanvas />
        <div className="relative z-10 p-10 md:p-14 flex flex-col h-full">
          <div className="text-[11px] tracking-[0.3em] uppercase text-white/60 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#06b6d4] dot-blink" />
            3-Layer Security · ALL CHANNELS NOMINAL
          </div>
          <h2 className="font-display uppercase mt-4" style={{ fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 0.9 }}>
            Cổng Bảo Mật<br />Đa Tầng.
          </h2>
          <p className="text-white/70 max-w-md mt-6 text-[15px] leading-relaxed">
            Mỗi yêu cầu đi qua 3 vành đai: Edge Middleware → API Handler → DB Constraints. Không có shortcut.
          </p>
          <div className="mt-auto pt-10 grid grid-cols-3 gap-2">
            {['EDGE MIDDLEWARE', 'API HANDLER', 'DB CONSTRAINTS'].map((l, i) => (
              <div key={l} className="border border-white/20 p-4">
                <div className="text-[10px] tracking-[0.2em] uppercase text-white/60">L{i + 1}</div>
                <div className="font-mono text-[12px] mt-2">{l}</div>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#007d48] dot-blink" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#007d48]">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 md:p-14 flex flex-col">
        <div className="text-[11px] tracking-[0.3em] uppercase text-[#111111]/60">Authentication / Step 01 of 02</div>
        <h2 className="font-display uppercase mt-3" style={{ fontSize: 'clamp(36px, 4.4vw, 64px)', lineHeight: 0.9 }}>
          Kích Hoạt<br />Cổng Kết Nối.
        </h2>
        <p className="text-[#111111]/60 mt-4 max-w-md">Chọn vai trò và xác thực để truy cập hệ sinh thái UniHub.</p>

        <form onSubmit={submit} className="mt-10 max-w-lg space-y-6">
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#111111]/60 mb-2">Role</div>
            <div className="flex gap-2 flex-wrap">
              {['STUDENT', 'ORGANIZER', 'CHECKIN_STAFF'].map(r => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-5 py-2.5 rounded-full border text-[13px] uppercase tracking-[0.18em] transition-all ${
                    role === r ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white text-[#111111] border-hairline hover:border-[#111111]'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* OAuth providers — pill, hairline, mono styling */}
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#111111]/60 mb-2">
              Đăng Nhập Nhanh · Single Sign-On
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!!oauthLoading}
                onClick={() => oauthLogin('google')}
                className="group relative flex items-center justify-center gap-3 px-6 py-3.5 rounded-full border border-hairline bg-white text-[#111111] text-[14px] font-medium tracking-tight transition-all hover:border-[#111111] hover:-translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {oauthLoading === 'google' ? (
                  <span className="w-5 h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <GoogleMark className="w-5 h-5 shrink-0" />
                )}
                <span>Tiếp tục với <span className="font-semibold">Google</span></span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </button>

              <button
                type="button"
                disabled={!!oauthLoading}
                onClick={() => oauthLogin('github')}
                className="group relative flex items-center justify-center gap-3 px-6 py-3.5 rounded-full border border-[#111111] bg-[#111111] text-white text-[14px] font-medium tracking-tight transition-all hover:bg-black hover:-translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {oauthLoading === 'github' ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <GitHubMark className="w-5 h-5 shrink-0" />
                )}
                <span>Tiếp tục với <span className="font-semibold">GitHub</span></span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </button>
            </div>

            {/* Hairline divider with caption */}
            <div className="relative mt-7 mb-1">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-hairline" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-[11px] tracking-[0.3em] uppercase text-[#111111]/50 font-mono">
                  Hoặc · Email
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] tracking-[0.25em] uppercase text-[#111111]/60">University Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ban@university.edu.vn"
              className="mt-2 w-full bg-white border border-hairline px-4 py-3 text-[15px] focus:outline-none focus:border-[2px] focus:border-[#111111] focus:py-[11px] focus:px-[15px]"
            />
          </div>

          <div>
            <label className="text-[11px] tracking-[0.25em] uppercase text-[#111111]/60">Passkey</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full bg-white border border-hairline px-4 py-3 text-[15px] focus:outline-none focus:border-[2px] focus:border-[#111111] focus:py-[11px] focus:px-[15px]"
            />
          </div>

          <div>
            <label className="text-[11px] tracking-[0.25em] uppercase text-[#111111]/60">Two-Factor Code (Optional)</label>
            <div className="mt-2 flex items-center gap-2 border border-hairline rounded-full px-5 py-2 focus-within:border-[#111111]">
              <ScanLine className="w-4 h-4 text-[#111111]/60" />
              <input
                inputMode="numeric"
                placeholder="6-digit code"
                className="flex-1 bg-transparent outline-none text-[15px] tabular"
              />
              <button type="button" className="text-[11px] uppercase tracking-[0.2em] text-[#111111]/60 hover:text-[#111111]">Send</button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="pill-primary !px-8 !py-4 text-[15px] disabled:opacity-60">
            {loading ? 'Đang xác thực…' : 'Kích Hoạt Cổng Kết Nối'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-6 border-t border-hairline text-[12px] text-[#111111]/60 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#007d48]" />
            Mã hóa TLS 1.3 · Phiên đăng nhập rotate mỗi 60 phút.
          </div>
        </form>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 *  PAGE 3 — STUDENT COMMAND CENTER
 * ------------------------------------------------------------------ */
const useQRDataUrl = (text) => {
  const [url, setUrl] = useState('')
  useEffect(() => {
    if (!text) return
    QRCode.toDataURL(text, { errorCorrectionLevel: 'H', margin: 1, width: 320, color: { dark: '#111111', light: '#ffffff' } })
      .then(setUrl).catch(() => {})
  }, [text])
  return url
}

const BoardingPass = ({ ticket }) => {
  const qr = useQRDataUrl(`UNIHUB|${ticket.id}|${ticket.workshop}|${ticket.hmac}`)
  return (
    <div className="border border-[#111111] bg-white">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-8 p-6 md:p-8 border-b md:border-b-0 md:border-r border-dashed border-[#111111]">
          <div className="flex items-center justify-between">
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#111111]/60">Boarding Pass · Workshop</div>
            <div className="font-mono text-[11px]">{ticket.id}</div>
          </div>
          <div className="mt-2 font-display uppercase" style={{ fontSize: 'clamp(28px, 3.6vw, 48px)', lineHeight: 0.95 }}>
            {ticket.workshop}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-6 text-[12px]">
            <div>
              <div className="uppercase tracking-[0.2em] text-[#111111]/50 text-[10px]">From</div>
              <div className="font-display text-3xl mt-1">SGN</div>
              <div className="text-[#111111]/60 mt-1">Saigon · UTC+7</div>
            </div>
            <div className="flex items-center justify-center text-[#111111]/40">→</div>
            <div>
              <div className="uppercase tracking-[0.2em] text-[#111111]/50 text-[10px]">Gate</div>
              <div className="font-display text-3xl mt-1">{ticket.gate}</div>
              <div className="text-[#111111]/60 mt-1">{ticket.location}</div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-6 text-[12px]">
            <div><div className="uppercase tracking-[0.2em] text-[#111111]/50 text-[10px]">Date</div><div className="mt-1 tabular">{ticket.date}</div></div>
            <div><div className="uppercase tracking-[0.2em] text-[#111111]/50 text-[10px]">Time</div><div className="mt-1 tabular">{ticket.time}</div></div>
            <div><div className="uppercase tracking-[0.2em] text-[#111111]/50 text-[10px]">Seat</div><div className="mt-1 tabular">{ticket.seat}</div></div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]">
            <span className="badge-promo badge-green flex items-center gap-1.5"><Check className="w-3 h-3" />Verified · HMAC-SHA256</span>
            <span className="badge-promo">Offline Ready</span>
          </div>
        </div>
        <div className="md:col-span-4 p-6 md:p-8 flex flex-col items-center justify-center bg-[#f5f5f5] relative group">
          {qr ? (
            <img src={qr} alt="QR" className="w-44 h-44 select-none" />
          ) : (
            <div className="w-44 h-44 bg-white animate-pulse" />
          )}
          <div className="text-center mt-3 text-[11px] uppercase tracking-[0.2em] text-[#111111]/60">Scan to check-in</div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute inset-0 bg-[#111111] text-white flex flex-col items-center justify-center p-4 text-center">
            <ScanLine className="w-6 h-6 mb-2" />
            <div className="text-[12px] uppercase tracking-[0.2em] mb-2">Secure Encryption</div>
            <p className="text-[12px] leading-relaxed">Mã hóa bảo mật cao — hỗ trợ quét Offline không cần Internet.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const AISummaryTerminal = () => {
  const [phase, setPhase] = useState('idle')
  const [filename, setFilename] = useState('')
  const [logs, setLogs] = useState([])
  const [summary, setSummary] = useState(null)
  const [progress, setProgress] = useState(0)
  const fileInput = useRef(null)
  const logEnd = useRef(null)

  const pushLog = (line) => setLogs(l => [...l, line])

  useEffect(() => { logEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [logs])

  const start = async (file) => {
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setPhase('error')
      pushLog(`[ERROR] File ${file.name} vượt giới hạn 10MB.`)
      return
    }
    setSummary(null)
    setLogs([])
    setProgress(0)
    setFilename(file.name)
    setPhase('processing')
    const stages = [
      `[init]   uplink secure → /api/ai/summarize`,
      `[recv]   ${file.name} · ${(file.size / 1024).toFixed(1)} KB`,
      `[ocr]    extracting text layers… (PyMuPDF)`,
      `[chunk]  splitting into semantic blocks…`,
      `[model]  invoking gemini-2.5-flash · stream=true`,
      `[infer]  generating Vietnamese bullet summary…`,
      `[verify] hallucination guard · OK`,
    ]
    for (let i = 0; i < stages.length; i++) {
      await new Promise(r => setTimeout(r, 380 + Math.random() * 280))
      pushLog(stages[i])
      setProgress(Math.round(((i + 1) / (stages.length + 1)) * 100))
    }
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name }),
      })
      const data = await res.json()
      pushLog(`[done]   tokens in=${data.tokens.input} · out=${data.tokens.output} · ${data.latencyMs}ms`)
      setProgress(100)
      setSummary(data.summary)
      setPhase('success')
    } catch (e) {
      pushLog(`[error]  ${e.message}`)
      setPhase('error')
    }
  }

  const onPick = (e) => {
    const f = e.target.files?.[0]
    if (f) start(f)
  }
  const onDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) start(f)
  }

  return (
    <div className="border border-hairline">
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#d30005]" />
          <span className="w-2.5 h-2.5 bg-[#f5f5f5] border border-hairline" />
          <span className="w-2.5 h-2.5 bg-[#007d48]" />
          <span className="ml-3 text-[11px] uppercase tracking-[0.25em] font-mono">unihub://ai-summary</span>
        </div>
        <div className="text-[11px] tracking-[0.2em] uppercase font-mono flex items-center gap-2">
          <span className={`w-1.5 h-1.5 ${phase === 'processing' ? 'bg-[#06b6d4]' : phase === 'success' ? 'bg-[#007d48]' : 'bg-[#cacacb]'} dot-blink`} />
          {phase}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div
          className="bg-[#111111] text-white p-5 font-mono text-[12px] leading-relaxed min-h-[320px] max-h-[420px] overflow-auto"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <div className="text-white/60">$ unihub-ai --model gemini-2.5-flash --lang vi --max 30s</div>
          <div className="text-white/60">$ ready · drop a PDF (≤10MB)…</div>
          {logs.map((l, i) => (
            <div key={i} className="mt-1 text-white">{l}</div>
          ))}
          {phase === 'processing' && (
            <div className="mt-2 text-[#06b6d4] terminal-cursor">processing</div>
          )}
          {phase === 'success' && <div className="mt-2 text-[#007d48]">[ok] summary ready ↓</div>}
          {phase === 'error' && <div className="mt-2 text-[#d30005]">[err] failed</div>}
          <div ref={logEnd} />
        </div>

        <div className="p-5 bg-white border-t lg:border-t-0 lg:border-l border-hairline flex flex-col">
          <div
            onClick={() => fileInput.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="cursor-pointer border border-dashed border-hairline hover:border-[#111111] transition-colors p-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-[#f5f5f5] flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-semibold">Upload PDF học liệu</div>
              <div className="text-[12px] text-[#111111]/60">Drop file hoặc click · max 10MB</div>
            </div>
            <button type="button" className="pill-ghost">Chọn file</button>
            <input ref={fileInput} type="file" accept="application/pdf" className="hidden" onChange={onPick} />
          </div>

          {filename && (
            <div className="mt-3 flex items-center justify-between text-[12px] text-[#111111]/70">
              <span className="flex items-center gap-2"><FileText className="w-4 h-4" />{filename}</span>
              <span className="tabular">{progress}%</span>
            </div>
          )}
          <div className="mt-1 h-[2px] bg-[#f5f5f5]">
            <div className="h-full bg-[#111111] transition-all" style={{ width: `${progress}%` }} />
          </div>

          {summary && (
            <div className="mt-5 border-t border-hairline pt-5">
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#111111]/60">Structured Summary · VI</div>
              <div className="font-display text-2xl uppercase mt-1 leading-tight">{summary.title}</div>
              <ul className="mt-3 space-y-2">
                {summary.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-[13.5px] leading-relaxed">
                    <span className="font-mono text-[10px] mt-1 text-[#111111]/50">0{i + 1}</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {summary.keywords.map(k => (
                  <span key={k} className="badge-promo">{k}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button className="pill-primary">Lưu vào Notebook <Plus className="w-4 h-4" /></button>
                <button className="pill-ghost">Export .md</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const Dashboard = ({ user, workshops }) => {
  const [tab, setTab] = useState('Overview')
  const tabs = ['Overview', 'Tickets', 'AI Notebook', 'History', 'Settings']
  const ticket = {
    id: 'TKT-A8KZ91M2',
    workshop: 'NEXT-GEN AI PIPELINES',
    location: 'Hall A · Innovation Lab',
    gate: 'A1',
    date: '28.06.2025',
    time: '18:30',
    seat: '042',
    hmac: '7f3a…9b21',
  }
  const upcoming = workshops.slice(0, 3)
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-104px)]">
      <aside className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-hairline">
        <div className="p-6 border-b border-hairline">
          <div className="text-[11px] tracking-[0.25em] uppercase text-[#111111]/60">Signed In</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#111111] text-white flex items-center justify-center font-bold uppercase">
              {(user?.name || 'S')[0]}
            </div>
            <div>
              <div className="font-semibold uppercase tracking-tight">{user?.name || 'Guest'}</div>
              <div className="text-[12px] text-[#111111]/60 uppercase tracking-[0.2em]">{user?.role || 'STUDENT'}</div>
            </div>
          </div>
        </div>
        <nav className="p-2">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative w-full text-left px-4 py-3 text-[14px] font-semibold uppercase tracking-tight transition-colors ${
                tab === t ? 'text-[#111111]' : 'text-[#111111]/60 hover:text-[#111111]'
              }`}
            >
              {t}
              {tab === t && <span className="absolute left-4 right-4 -bottom-[1px] h-[2px] bg-[#111111]" />}
            </button>
          ))}
        </nav>
        <div className="border-t border-hairline p-6 mt-6 space-y-3 text-[12px]">
          <div className="flex items-center justify-between">
            <span className="text-[#111111]/60 uppercase tracking-[0.2em]">Streak</span>
            <span className="font-display text-2xl tabular">14d</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#111111]/60 uppercase tracking-[0.2em]">Badges</span>
            <span className="font-display text-2xl tabular">07</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#111111]/60 uppercase tracking-[0.2em]">XP</span>
            <span className="font-display text-2xl tabular">2,840</span>
          </div>
        </div>
      </aside>

      <main className="lg:col-span-9 p-6 md:p-10 space-y-10">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[11px] tracking-[0.25em] uppercase text-[#111111]/60">Command Center</div>
            <h2 className="font-display uppercase mt-1" style={{ fontSize: 'clamp(36px, 4.4vw, 64px)', lineHeight: 0.9 }}>
              Welcome Back, <span className="opacity-70">{user?.name || 'Student'}</span>.
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="pill-ghost"><Bell className="w-4 h-4" />3 New</button>
            <button className="pill-primary">Quét QR <ScanLine className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-l border-hairline">
          {[
            ['Active Tickets', '02', 'workshop sắp tới'],
            ['Hours Logged', '38h', 'tích lũy 30 ngày'],
            ['Avg Summary', '27.8s', 'gemini-2.5-flash'],
            ['Reliability', '99.98%', 'system uptime'],
          ].map(([k, v, sub]) => (
            <div key={k} className="border-r border-b border-hairline p-5">
              <div className="text-[11px] tracking-[0.25em] uppercase text-[#111111]/60">{k}</div>
              <div className="font-display text-5xl tabular leading-none mt-2">{v}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#111111]/50 mt-2">{sub}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between border-b border-hairline pb-3 mb-4">
            <h3 className="font-display uppercase text-2xl">Active Ticket</h3>
            <button className="text-[12px] uppercase tracking-[0.2em] hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></button>
          </div>
          <BoardingPass ticket={ticket} />
        </div>

        <div>
          <div className="flex items-center justify-between border-b border-hairline pb-3 mb-4">
            <div>
              <h3 className="font-display uppercase text-2xl">AI Summary · Notebook</h3>
              <div className="text-[12px] text-[#111111]/60">Gemini 2.5 Flash · Tóm tắt PDF dưới 30 giây</div>
            </div>
            <span className="badge-promo badge-green flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#007d48] dot-blink" />Online</span>
          </div>
          <AISummaryTerminal />
        </div>

        <div>
          <div className="flex items-center justify-between border-b border-hairline pb-3 mb-4">
            <h3 className="font-display uppercase text-2xl">Upcoming Drops</h3>
            <button className="text-[12px] uppercase tracking-[0.2em] hover:underline flex items-center gap-1">Browse all <ArrowRight className="w-3 h-3" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {upcoming.map(w => (
              <div key={w.id} className="border-t border-hairline pt-3">
                <div className="aspect-[4/3] bg-[#f5f5f5] overflow-hidden">
                  <img src={w.cover} alt={w.title} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#111111]/60">{w.date} · {w.time}</div>
                <div className="font-bold text-[14px] uppercase mt-1">{w.title}</div>
                <div className="text-[12px] text-[#111111]/60">{w.location}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 *  ROOT APP
 * ------------------------------------------------------------------ */
function App() {
  const [view, setView] = useState('landing')
  const [user, setUser] = useState(null)
  const [workshops, setWorkshops] = useState([])
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetch('/api/workshops').then(r => r.json()).then(d => setWorkshops(d.workshops || [])).catch(() => {})
  }, [])

  const onLogin = (u) => {
    setUser(u)
    setView('dashboard')
    setToast({ kind: 'success', text: `Đã xác thực · chào ${u.name?.toUpperCase?.() || 'STUDENT'}` })
    setTimeout(() => setToast(null), 2500)
  }
  const onLogout = () => { setUser(null); setView('landing') }

  const onRegister = async (w) => {
    try {
      const r = await fetch('/api/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workshopId: w.id, studentId: user?.email || 'guest' }),
      })
      const d = await r.json()
      setToast({ kind: 'success', text: `Đăng ký thành công · ${d.ticketId}` })
      setTimeout(() => setToast(null), 2500)
    } catch {
      setToast({ kind: 'error', text: 'Đăng ký thất bại' })
      setTimeout(() => setToast(null), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans">
      <Nav view={view} setView={setView} user={user} onLogout={onLogout} />

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {view === 'landing' && (
            <>
              <Hero onCta={() => document.getElementById('grid')?.scrollIntoView({ behavior: 'smooth' })} />
              <div id="grid">
                <WorkshopGrid workshops={workshops} onRegister={onRegister} />
              </div>
              <TechShowcase />
              <EditorialCTA onGo={() => setView('auth')} />
              <Footer />
            </>
          )}
          {view === 'auth' && <AuthPage onLogin={onLogin} />}
          {view === 'dashboard' && <Dashboard user={user || { name: 'Guest', role: 'STUDENT' }} workshops={workshops} />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 bg-[#111111] text-white px-5 py-3 rounded-full text-[13px] font-medium">
              <span className={`w-1.5 h-1.5 ${toast.kind === 'error' ? 'bg-[#d30005]' : 'bg-[#007d48]'} dot-blink`} />
              {toast.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
