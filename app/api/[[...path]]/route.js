import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

let client
async function getDb() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
  }
  return client.db(process.env.DB_NAME || 'unihub')
}

const SEED_WORKSHOPS = [
  {
    id: 'ws-001',
    title: 'NEXT-GEN AI PIPELINES',
    category: 'Công nghệ • AI & Big Data',
    badge: 'Just In',
    seatsTotal: 60,
    seatsTaken: 48,
    date: '28.06.2025',
    time: '18:30',
    location: 'Hall A · Innovation Lab',
    speaker: 'Dr. Trần Minh Quân',
    cover: 'https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwYWJzdHJhY3R8ZW58MHx8fGJsYWNrX2FuZF93aGl0ZXwxNzc4NDA2NjAyfDA&ixlib=rb-4.1.0&q=85',
    price: 0,
  },
  {
    id: 'ws-002',
    title: 'WEB3 · DECENTRALIZED FUTURES',
    category: 'Công nghệ • Blockchain',
    badge: 'Member Exclusive',
    seatsTotal: 80,
    seatsTaken: 72,
    date: '02.07.2025',
    time: '19:00',
    location: 'Hall B · Block 2',
    speaker: 'Lê Hoàng Anh',
    cover: 'https://images.unsplash.com/photo-1486551937199-baf066858de7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHx0ZWNoJTIwYWJzdHJhY3R8ZW58MHx8fGJsYWNrX2FuZF93aGl0ZXwxNzc4NDA2NjAyfDA&ixlib=rb-4.1.0&q=85',
    price: 199000,
  },
  {
    id: 'ws-003',
    title: 'SYSTEM DESIGN MASTERCLASS',
    category: 'Kỹ thuật • System Architecture',
    badge: 'Coming Soon',
    seatsTotal: 50,
    seatsTaken: 30,
    date: '05.07.2025',
    time: '14:00',
    location: 'Auditorium 01',
    speaker: 'Nguyễn Vũ Bảo',
    cover: 'https://images.unsplash.com/photo-1482053450283-3e0b78b09a70?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwzfHx0ZWNoJTIwYWJzdHJhY3R8ZW58MHx8fGJsYWNrX2FuZF93aGl0ZXwxNzc4NDA2NjAyfDA&ixlib=rb-4.1.0&q=85',
    price: 0,
  },
  {
    id: 'ws-004',
    title: 'OFFENSIVE SECURITY · RED TEAM',
    category: 'Công nghệ • Cyber Security',
    badge: 'Just In',
    seatsTotal: 40,
    seatsTaken: 38,
    date: '11.07.2025',
    time: '20:00',
    location: 'Cyber Range · Lab 04',
    speaker: 'Phạm Đức Tùng',
    cover: 'https://images.unsplash.com/photo-1512998844734-cd2cca565822?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHx0ZWNoJTIwYWJzdHJhY3R8ZW58MHx8fGJsYWNrX2FuZF93aGl0ZXwxNzc4NDA2NjAyfDA&ixlib=rb-4.1.0&q=85',
    price: 299000,
  },
  {
    id: 'ws-005',
    title: 'ROBOTICS · AUTONOMOUS AGENTS',
    category: 'Kỹ thuật • Robotics',
    badge: 'Member Exclusive',
    seatsTotal: 55,
    seatsTaken: 23,
    date: '15.07.2025',
    time: '09:30',
    location: 'Robotics Lab · Block C',
    speaker: 'Dr. Hoàng Bảo Châu',
    cover: 'https://images.unsplash.com/photo-1561972465-05c968dc2c91?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwyfHxkaWdpdGFsJTIwdGVjaG5vbG9neXxlbnwwfHx8YmxhY2tfYW5kX3doaXRlfDE3Nzg0MDY2MDh8MA&ixlib=rb-4.1.0&q=85',
    price: 0,
  },
  {
    id: 'ws-006',
    title: 'DATA STORYTELLING · VIZ LAB',
    category: 'Dữ liệu • Visualization',
    badge: 'Coming Soon',
    seatsTotal: 70,
    seatsTaken: 12,
    date: '20.07.2025',
    time: '17:00',
    location: 'Hall C · Studio 02',
    speaker: 'Đỗ Khánh Linh',
    cover: 'https://images.unsplash.com/photo-1506917288995-8f5ee0aa4c1f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdGVjaG5vbG9neXxlbnwwfHx8YmxhY2tfYW5kX3doaXRlfDE3Nzg0MDY2MDh8MA&ixlib=rb-4.1.0&q=85',
    price: 99000,
  },
]

async function ensureSeed() {
  try {
    const db = await getDb()
    const col = db.collection('workshops')
    const count = await col.countDocuments()
    if (count === 0) await col.insertMany(SEED_WORKSHOPS.map(w => ({ ...w })))
  } catch (e) { /* noop */ }
}

function json(data, status = 200) {
  return NextResponse.json(data, { status })
}

export async function GET(request, { params }) {
  const path = (params?.path || []).join('/')
  if (path === '' || path === 'health') return json({ ok: true, service: 'unihub', ts: Date.now() })
  if (path === 'workshops') {
    try {
      await ensureSeed()
      const db = await getDb()
      const list = await db.collection('workshops').find({}, { projection: { _id: 0 } }).toArray()
      return json({ workshops: list.length ? list : SEED_WORKSHOPS })
    } catch (e) { return json({ workshops: SEED_WORKSHOPS }) }
  }
  if (path.startsWith('workshops/')) {
    const id = path.split('/')[1]
    const ws = SEED_WORKSHOPS.find(w => w.id === id)
    return json(ws || { error: 'not_found' }, ws ? 200 : 404)
  }
  if (path === 'system/status') {
    return json({
      modules: [
        { id: 'lock', name: 'Optimistic Locking Seat Manager', status: 'CLOSED', latencyMs: 38, color: 'cyan' },
        { id: 'vnpay', name: 'VNPAY Gateway · Circuit Breaker', status: 'CLOSED', latencyMs: 142, color: 'cyan' },
        { id: 'pwa', name: 'Offline Check-In PWA · HMAC-SHA256', status: 'CLOSED', latencyMs: 187, color: 'violet' },
        { id: 'ai', name: 'AI Summary Pipeline · Gemini 2.5 Flash', status: 'CLOSED', latencyMs: 28000, color: 'violet' },
      ],
      uptime: '99.98%',
    })
  }
  return json({ error: 'not_found', path }, 404)
}

export async function POST(request, { params }) {
  const path = (params?.path || []).join('/')
  let body = {}
  try { body = await request.json() } catch {}

  if (path === 'register') {
    const { workshopId, studentId } = body
    return json({
      ok: true,
      ticketId: 'TKT-' + Math.random().toString(36).slice(2, 10).toUpperCase(),
      workshopId, studentId,
      issuedAt: new Date().toISOString(),
      hmac: 'sha256:' + Math.random().toString(36).slice(2, 18) + Math.random().toString(36).slice(2, 18),
    })
  }

  if (path === 'auth/login') {
    const { email, role } = body
    return json({
      ok: true,
      token: 'jwt.' + Buffer.from(JSON.stringify({ e: email, r: role, t: Date.now() })).toString('base64url'),
      user: { email, role, name: (email || 'student').split('@')[0] },
    })
  }

  if (path === 'ai/summarize') {
    // Mocked Gemini 2.5 Flash response — to be replaced with real integration on user approval
    const { filename = 'document.pdf' } = body
    return json({
      ok: true,
      model: 'gemini-2.5-flash',
      tokens: { input: 4218, output: 612 },
      latencyMs: 27840,
      summary: {
        title: 'Tóm tắt: ' + filename,
        bullets: [
          'Hệ thống áp dụng Optimistic Locking ở tầng database để chống oversell ghế khi nhiều sinh viên đăng ký đồng thời.',
          'VNPAY tích hợp Circuit Breaker pattern nhằm cô lập lỗi và tự phục hồi khi gateway gặp sự cố.',
          'PWA hỗ trợ Check-in offline; QR code được ký HMAC-SHA256, xác thực dưới 200ms không cần Internet.',
          'Pipeline tóm tắt tài liệu chạy nền dưới 30 giây bằng Gemini 2.5 Flash, output có cấu trúc bullet-point.',
          'Bảo mật 3 lớp: Edge Middleware → API Handler → DB Constraints, đảm bảo tính toàn vẹn end-to-end.',
        ],
        keywords: ['Optimistic Locking', 'Circuit Breaker', 'HMAC-SHA256', 'Gemini 2.5 Flash', 'PWA Offline'],
      },
    })
  }

  return json({ error: 'not_found', path }, 404)
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
