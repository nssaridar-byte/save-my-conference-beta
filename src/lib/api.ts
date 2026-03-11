/**
 * API Service Layer
 * ==================
 * All backend calls will go through this file.
 * Currently returns mock data. When your backend is ready,
 * replace the mock implementations with real fetch() calls.
 *
 * Backend endpoints to implement:
 *   POST /api/auth/login          → returns { user, token }
 *   POST /api/auth/signup         → returns { user, token }
 *   GET  /api/usage/today         → returns DailyUsage
 *   POST /api/usage/increment     → returns updated DailyUsage
 *   GET  /api/speeches            → returns Speech[]
 *   POST /api/speeches            → creates Speech, returns Speech
 *   PUT  /api/speeches/:id        → updates Speech
 *   POST /api/speeches/:id/analyze→ returns SpeechAnalysis
 *   GET  /api/subscription/status → returns { plan, renewsAt }
 *   POST /api/stripe/checkout     → returns { checkoutUrl }
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function apiLogin(email: string, password: string) {
  // TODO: replace with real call
  // return fetch(`${API_BASE}/api/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) })
  return { user: { id: '1', name: 'Nicolas Saridar', email, role: 'FREE_USER' }, token: 'mock_token' };
}

export async function apiSignup(name: string, email: string, password: string) {
  // TODO: replace with real call
  return { user: { id: '1', name, email, role: 'FREE_USER' }, token: 'mock_token' };
}

// ─── Usage ───────────────────────────────────────────────────────────────────

export async function apiGetDailyUsage() {
  // TODO: replace with GET /api/usage/today
  return null; // null = use local store
}

export async function apiIncrementUsage(type: string) {
  // TODO: replace with POST /api/usage/increment
  return null;
}

// ─── Speeches ────────────────────────────────────────────────────────────────

export async function apiGetSpeeches() {
  // TODO: replace with GET /api/speeches
  return [
    { id: '1', title: 'Opening Statement - UNSC', content: '', estimatedSeconds: 180, grade: 'B+' },
    { id: '2', title: 'Working Paper Alpha Defense', content: '', estimatedSeconds: 105, grade: null },
  ];
}

export async function apiAnalyzeSpeech(speechId: string, content: string) {
  // TODO: replace with POST /api/speeches/:id/analyze
  return {
    grade: 'B+',
    wpmScore: 148,
    tips: [
      { type: 'strength', text: 'Strong opening hook.' },
      { type: 'strength', text: 'Clear operative language for UNSC context.' },
      { type: 'warning', text: "Avoid 'I' — use 'The delegation of France...' instead." },
      { type: 'warning', text: 'Section 2 is dense. Split into two paragraphs.' },
      { type: 'tip', text: 'Quote UN Charter Article 39 to strengthen your legal basis.' },
    ],
  };
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export async function apiGetSubscriptionStatus() {
  // TODO: replace with GET /api/subscription/status
  return { plan: 'FREE', renewsAt: null };
}

export async function apiCreateCheckoutSession(priceId: string) {
  // TODO: replace with POST /api/stripe/checkout
  return { checkoutUrl: '#' };
}
