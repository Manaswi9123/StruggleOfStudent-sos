/**
 * SS DATA SERVICE
 * ===============
 * The ONLY file that knows where data is stored. Every page/component talks
 * to these async functions, never to localStorage directly.
 *
 * Today (frontend-only): data lives in the browser's localStorage, seeded from
 * /src/data/seed.js. That means submissions are visible in /admin on the SAME
 * browser/device only.
 *
 * Later (with a backend): replace the bodies of `read`/`write` helpers — or
 * each exported function — with `fetch('/api/...')` calls. The function names,
 * arguments and return shapes are the API contract, so no UI code changes.
 */
import { seed } from '../data/seed'

const STORAGE_KEY = 'ss:db:v6'
const bus = new EventTarget()

export const COLLECTIONS = [
  'members', 'team', 'events', 'eventRegistrations', 'volunteers', 'opportunities',
  'applications', 'services', 'placements', 'sessions', 'sessionRegistrations', 'enquiries',
  'ambassadors', 'talents',
]

export class CapacityError extends Error {
  constructor(message) { super(message); this.name = 'CapacityError' }
}
export class DuplicateError extends Error {
  constructor(message) { super(message); this.name = 'DuplicateError' }
}

/* ---------------- storage helpers (swap these for a backend) -------------- */
let memoryDb = null // fallback if localStorage is unavailable (private mode etc.)

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...structuredClone(seed), ...JSON.parse(raw) }
  } catch { /* ignore */ }
  if (!memoryDb) memoryDb = structuredClone(seed)
  return memoryDb
}

function save(db, changed) {
  memoryDb = db
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)) } catch { /* ignore */ }
  bus.dispatchEvent(new CustomEvent('change', { detail: changed }))
}

const tick = () => new Promise((r) => setTimeout(r, 120)) // feels like a network call
const uid = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
const now = () => new Date().toISOString()
const same = (a = '', b = '') => a.trim().toLowerCase() === b.trim().toLowerCase()

/** Subscribe to data changes. Returns an unsubscribe function. */
export function subscribe(fn) {
  const handler = (e) => fn(e.detail)
  bus.addEventListener('change', handler)
  // keep multiple tabs in sync
  const storage = (e) => e.key === STORAGE_KEY && fn('*')
  window.addEventListener('storage', storage)
  return () => { bus.removeEventListener('change', handler); window.removeEventListener('storage', storage) }
}

/* ---------------- generic CRUD (used by admin) ---------------------------- */
export async function list(collection) {
  await tick()
  return [...(load()[collection] ?? [])]
}

export async function get(collection, id) {
  await tick()
  return load()[collection]?.find((x) => x.id === id) ?? null
}

export async function create(collection, data) {
  await tick()
  const db = load()
  const record = { ...data, id: data.id || uid(collection.slice(0, 3)), createdAt: data.createdAt || now() }
  db[collection] = [record, ...(db[collection] ?? [])]
  save(db, collection)
  return record
}

export async function update(collection, id, patch) {
  await tick()
  const db = load()
  db[collection] = db[collection].map((x) => (x.id === id ? { ...x, ...patch, id } : x))
  save(db, collection)
  return db[collection].find((x) => x.id === id)
}

export async function remove(collection, id) {
  await tick()
  const db = load()
  db[collection] = db[collection].filter((x) => x.id !== id)
  // cascade: clean up child records
  if (collection === 'events') {
    db.volunteers = db.volunteers.filter((v) => v.eventId !== id)
    db.eventRegistrations = db.eventRegistrations.filter((v) => v.eventId !== id)
  }
  if (collection === 'sessions') db.sessionRegistrations = db.sessionRegistrations.filter((r) => r.sessionId !== id)
  if (collection === 'opportunities') db.applications = db.applications.filter((a) => a.opportunityId !== id)
  save(db, collection)
}

/* ---------------- domain actions (used by public pages) ------------------- */

/** Join the SS community. */
export async function joinCommunity(data) {
  const db = load()
  if (db.members.some((m) => same(m.email, data.email))) throw new DuplicateError('This email is already part of SS. Welcome back! 💙')
  return create('members', { ...data, active: true })
}

/** Apply to an opportunity. */
export async function applyToOpportunity(opportunityId, data) {
  const db = load()
  const opp = db.opportunities.find((o) => o.id === opportunityId)
  if (!opp || opportunityStatus(opp) === 'Closed') throw new CapacityError('Applications for this opportunity are closed.')
  if (db.applications.some((a) => a.opportunityId === opportunityId && same(a.email, data.email)))
    throw new DuplicateError('You have already applied with this email.')
  return create('applications', { ...data, opportunityId, status: 'New' })
}

/** Register to attend an event. */
export async function registerForEvent(eventId, data) {
  const db = load()
  const evt = db.events.find((e) => e.id === eventId)
  const taken = db.eventRegistrations.filter((r) => r.eventId === eventId).length
  if (!evt?.registrationOpen || (evt.registrationCapacity && taken >= evt.registrationCapacity))
    throw new CapacityError('Registrations for this event are closed.')
  if (db.eventRegistrations.some((r) => r.eventId === eventId && same(r.email, data.email)))
    throw new DuplicateError('You are already registered for this event.')
  return create('eventRegistrations', { ...data, eventId })
}

/** Apply to volunteer — automatically blocked when capacity is reached. */
export async function applyToVolunteer(eventId, data) {
  const db = load()
  const evt = db.events.find((e) => e.id === eventId)
  const taken = db.volunteers.filter((v) => v.eventId === eventId).length
  if (!evt || taken >= Number(evt.volunteerCapacity || 0)) throw new CapacityError('Volunteer Slots Full')
  if (db.volunteers.some((v) => v.eventId === eventId && same(v.email, data.email)))
    throw new DuplicateError('You have already applied to volunteer for this event.')
  return create('volunteers', { ...data, eventId })
}

/** Register for an online session — blocked automatically at capacity. */
export async function registerForSession(sessionId, data) {
  const db = load()
  const s = db.sessions.find((x) => x.id === sessionId)
  const taken = db.sessionRegistrations.filter((r) => r.sessionId === sessionId).length
  if (!s || taken >= Number(s.capacity || 0)) throw new CapacityError('This session is full.')
  if (db.sessionRegistrations.some((r) => r.sessionId === sessionId && same(r.email, data.email)))
    throw new DuplicateError('You are already registered for this session.')
  // NOTE (Zoom): with a backend, call Zoom's "add meeting registrant" API here
  // using s.zoomMeetingId and return the personal join_url instead.
  return create('sessionRegistrations', { ...data, sessionId })
}

/** Apply to the Campus Ambassador program (one application per email). */
export async function applyAmbassador(data) {
  const db = load()
  if (db.ambassadors.some((a) => same(a.email, data.email))) throw new DuplicateError('You have already applied to be an ambassador. We’ll be in touch soon!')
  return create('ambassadors', { ...data, status: 'New' })
}

export async function sendEnquiry(data) {
  return create('enquiries', { ...data, status: 'New' })
}

/* ---------------- derived helpers ----------------------------------------- */
export function opportunityStatus(opp, today = new Date()) {
  if (opp.status === 'Closed') return 'Closed'
  if (!opp.deadline) return opp.status || 'Open'
  const end = new Date(`${opp.deadline}T23:59:59`)
  if (end < today) return 'Closed'
  const days = (end - today) / 86400000
  return days <= 7 ? 'Closing soon' : 'Open'
}

export function getSnapshot() { return load() }

/** Admin utilities */
export function exportData() { return JSON.stringify(load(), null, 2) }
export function importData(json) { const parsed = JSON.parse(json); save({ ...structuredClone(seed), ...parsed }, '*') }
export function resetToSeed() { save(structuredClone(seed), '*') }
