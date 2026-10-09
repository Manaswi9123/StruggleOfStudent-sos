import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, CalendarDays, Video, Users, Building2, Sparkles, UserCircle, Inbox, FileText,
  Megaphone, Mic, Plus, Pencil, Trash2, Lock, LogOut, Download, Upload, RotateCcw, ListChecks, Eye,
} from 'lucide-react'
import { Logo } from '../../components/ui/Logo'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Textarea, Select, FormError } from '../../components/ui/Field'
import { EmptyState } from '../../components/ui/Feedback'
import { schemas, childSchemas } from './schemas'
import * as api from '../../services/api'
import { site } from '../../config/site'
import { cx, toList } from '../../utils/format'

const tabs = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'opportunities', icon: Briefcase },
  { key: 'events', icon: CalendarDays },
  { key: 'sessions', icon: Video },
  { key: 'members', icon: Users },
  { key: 'ambassadors', icon: Megaphone },
  { key: 'applications', icon: FileText },
  { key: 'enquiries', icon: Inbox },
  { key: 'placements', icon: Building2 },
  { key: 'services', icon: Sparkles },
  { key: 'talents', icon: Mic },
  { key: 'team', icon: UserCircle },
]

const AUTH_KEY = 'ss:admin'
const readAuth = () => { try { return sessionStorage.getItem(AUTH_KEY) === '1' } catch { return false } }

/** Keeps the whole DB snapshot in sync for the admin views. */
function useDb() {
  const [db, setDb] = useState(api.getSnapshot)
  useEffect(() => api.subscribe(() => setDb(api.getSnapshot())), [])
  return db
}

export default function Admin() {
  const [authed, setAuthed] = useState(readAuth)
  if (!authed) return <Login onSuccess={() => { try { sessionStorage.setItem(AUTH_KEY, '1') } catch { /* ignore */ } setAuthed(true) }} />
  return <Dashboard onLogout={() => { try { sessionStorage.removeItem(AUTH_KEY) } catch { /* ignore */ } setAuthed(false) }} />
}

function Login({ onSuccess }) {
  const [error, setError] = useState('')
  return (
    <div className="grid min-h-dvh place-items-center bg-ocean-50 p-4">
      <form
        onSubmit={(e) => { e.preventDefault(); if (new FormData(e.currentTarget).get('code') === site.adminPasscode) onSuccess(); else setError('That passcode isn’t right.') }}
        className="card w-full max-w-sm p-7"
      >
        <Logo />
        <div className="mb-5 mt-8 flex items-center gap-2"><Lock size={18} className="text-brand" /><h1 className="text-2xl font-bold">Team admin</h1></div>
        <Input name="code" type="password" label="Passcode" required autoFocus />
        <div className="mt-3"><FormError>{error}</FormError></div>
        <Button type="submit" size="lg" className="mt-4 w-full">Enter dashboard</Button>
        <p className="mt-4 text-xs text-ocean-900/55">Demo passcode: <code className="rounded bg-ocean-50 px-1">{site.adminPasscode}</code> — change it in <code>src/config/site.js</code>. Front-end only; replace with real auth when a backend is added.</p>
      </form>
    </div>
  )
}

function Dashboard({ onLogout }) {
  const db = useDb()
  const [tab, setTab] = useState('overview')
  const fileRef = useRef(null)

  const download = (name, text, type = 'application/json') => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([text], { type }))
    a.download = name; a.click(); URL.revokeObjectURL(a.href)
  }

  return (
    <div className="min-h-dvh bg-ocean-25">
      <header className="sticky top-0 z-30 border-b border-ocean-100 bg-white/90 backdrop-blur">
        <div className="flex h-16 items-center justify-between gap-3 px-4 lg:px-6">
          <div className="flex items-center gap-3"><Logo /><span className="hidden rounded-full bg-lagoon-mint px-2.5 py-1 text-xs font-bold text-ocean-900 sm:inline">Admin</span></div>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold hover:bg-ocean-50 sm:inline-flex"><Eye size={15} />View site</Link>
            <Button variant="ghost" size="sm" onClick={onLogout}><LogOut size={15} />Log out</Button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:hidden">
          {tabs.map((t) => <TabButton key={t.key} t={t} active={tab === t.key} onClick={() => setTab(t.key)} db={db} />)}
        </nav>
      </header>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-60 shrink-0 flex-col gap-1 overflow-y-auto border-r border-ocean-100 bg-white p-3 lg:flex">
          {tabs.map((t) => <TabButton key={t.key} t={t} active={tab === t.key} onClick={() => setTab(t.key)} db={db} vertical />)}
          <div className="mt-auto space-y-1 border-t border-ocean-100 pt-3 text-sm">
            <button onClick={() => download(`ss-data-${new Date().toISOString().slice(0, 10)}.json`, api.exportData())} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 font-medium hover:bg-ocean-50"><Download size={16} />Export all data</button>
            <button onClick={() => fileRef.current?.click()} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 font-medium hover:bg-ocean-50"><Upload size={16} />Import data</button>
            <button onClick={() => { if (window.confirm('Reset all data to the starting content? This removes everything submitted on this browser.')) api.resetToSeed() }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 font-medium hover:bg-ocean-50"><RotateCcw size={16} />Reset to starting data</button>
            <input ref={fileRef} type="file" accept="application/json" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) { try { api.importData(await f.text()) } catch { window.alert('That file isn’t valid SS data.') } } e.target.value = '' }} />
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {tab === 'overview' ? <Overview db={db} go={setTab} /> : <CollectionView key={tab} name={tab} db={db} download={download} />}
        </main>
      </div>
    </div>
  )
}

function TabButton({ t, active, onClick, db, vertical }) {
  const label = t.label || schemas[t.key].label
  const n = t.key !== 'overview' ? db[t.key]?.length : null
  return (
    <button onClick={onClick} className={cx('flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition', vertical && 'w-full', active ? 'bg-ocean-900 text-white' : 'text-ocean-900/75 hover:bg-ocean-50')}>
      <t.icon size={16} />{label}
      {n != null && <span className={cx('ml-auto rounded-full px-2 text-xs', active ? 'bg-white/15' : 'bg-ocean-50')}>{n}</span>}
    </button>
  )
}

function Overview({ db, go }) {
  const backup = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([api.exportData()], { type: 'application/json' }))
    a.download = `ss-data-${new Date().toISOString().slice(0, 10)}.json`; a.click()
  }
  const newEnq = db.enquiries.filter((e) => e.status === 'New').length
  const cards = [
    ['members', 'Community members', db.members.length + db.talents.length + db.team.length, `${db.members.length} joined via site · ${db.talents.length} talent · ${db.team.length} team`],
    ['opportunities', 'Open opportunities', db.opportunities.filter((o) => api.opportunityStatus(o) !== 'Closed').length, `${db.applications.length} applications`],
    ['ambassadors', 'Ambassador applications', db.ambassadors.length, `${db.ambassadors.filter((a) => a.status === 'New').length} new`],
    ['events', 'Events', db.events.length, `${db.volunteers.length} volunteers · ${db.eventRegistrations.length} registrations`],
    ['sessions', 'Online sessions', db.sessions.length, `${db.sessionRegistrations.length} registrations`],
    ['enquiries', 'Enquiries', db.enquiries.length, `${newEnq} new`],
    ['placements', 'Students placed', db.placements.reduce((n, p) => n + Number(p.studentsPlaced || 0), 0), `${db.placements.length} companies`],
  ]
  return (
    <div>
      <h1 className="text-3xl font-bold">Hello, team 👋</h1>
      <p className="mt-1 text-ocean-900/65">Everything on the public site comes from here.</p>
      <div className="mt-4 rounded-2xl bg-white p-4 text-sm ring-1 ring-ocean-100">
        <b>Frontend-only mode:</b> data is saved in this browser. Use <i>Export all data</i> to back it up or move it to another device. When a backend is added, only <code>src/services/api.js</code> needs to change.
      </div>
      <div className="mt-3 flex gap-2 lg:hidden">
        <Button variant="outline" size="sm" onClick={backup}><Download size={15} />Export all data</Button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([key, label, value, hint]) => (
          <button key={key} onClick={() => go(key)} className="card card-hover p-5 text-left">
            <p className="text-sm font-semibold text-ocean-900/60">{label}</p>
            <p className="mt-2 font-display text-4xl font-extrabold tabular-nums">{value}</p>
            <p className="mt-1 text-sm text-ocean-900/55">{hint}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function CollectionView({ name, db, download }) {
  const schema = schemas[name]
  const rows = db[name] || []
  const [editing, setEditing] = useState(null) // record | {} for new
  const [children, setChildren] = useState(null) // { parent, child }
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim()
    return t ? rows.filter((r) => JSON.stringify(r).toLowerCase().includes(t)) : rows
  }, [rows, q])

  const del = async (r) => {
    if (window.confirm(`Delete “${schema.columns[0].get(r, db)}”? This can’t be undone.`)) await api.remove(name, r.id)
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-3xl font-bold">{schema.label}</h1><p className="text-sm text-ocean-900/60">{rows.length} total</p></div>
        <div className="flex flex-wrap gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="field-input !h-10 !w-44 !py-2 text-sm" />
          <Button variant="outline" size="sm" className="!h-10" onClick={() => download(`ss-${name}.csv`, toCsv(rows), 'text/csv')}><Download size={15} />CSV</Button>
          {!schema.readOnly && <Button size="sm" className="!h-10" onClick={() => setEditing({})}><Plus size={16} />New {schema.singular.toLowerCase()}</Button>}
        </div>
      </div>

      {!filtered.length ? <EmptyState title={`No ${schema.label.toLowerCase()} yet`} /> : (
        <>
          {/* desktop table */}
          <div className="card hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ocean-100 text-xs uppercase tracking-wider text-ocean-900/55">
                <tr>{schema.columns.map((c) => <th key={c.label} className="px-4 py-3 font-semibold">{c.label}</th>)}<th className="px-4 py-3" /></tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-ocean-50 last:border-0 hover:bg-ocean-25">
                    {schema.columns.map((c) => <td key={c.label} className={cx('max-w-xs truncate px-4 py-3', c.primary && 'font-semibold')}>{String(c.get(r, db) ?? '')}</td>)}
                    <td className="whitespace-nowrap px-4 py-3 text-right"><RowActions schema={schema} r={r} onEdit={setEditing} onDel={del} onChildren={(child) => setChildren({ parent: r, child })} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((r) => (
              <div key={r.id} className="card p-4">
                {schema.columns.map((c, i) => (
                  <p key={c.label} className={cx('text-sm', i === 0 ? 'mb-1 text-base font-bold' : 'text-ocean-900/70')}>
                    {i > 0 && <span className="font-semibold text-ocean-900/50">{c.label}: </span>}{String(c.get(r, db) ?? '')}
                  </p>
                ))}
                <div className="mt-3 flex flex-wrap gap-2 border-t border-ocean-50 pt-3"><RowActions schema={schema} r={r} onEdit={setEditing} onDel={del} onChildren={(child) => setChildren({ parent: r, child })} /></div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? `Edit ${schema.singular.toLowerCase()}` : `New ${schema.singular.toLowerCase()}`} size="lg">
        {editing && <RecordForm schema={schema} record={editing} readOnlyView={schema.readOnly} onSave={async (data) => { if (editing.id) await api.update(name, editing.id, data); else await api.create(name, data); setEditing(null) }} />}
      </Modal>
      <Modal open={!!children} onClose={() => setChildren(null)} title={children ? `${children.child.label} — ${schema.columns[0].get(children.parent, db)}` : ''} size="lg">
        {children && <ChildList db={db} spec={children.child} parent={children.parent} download={download} />}
      </Modal>
    </div>
  )
}

function RowActions({ schema, r, onEdit, onDel, onChildren }) {
  return (
    <div className="inline-flex flex-wrap gap-1">
      {(schema.children || []).map((c) => (
        <button key={c.collection} onClick={() => onChildren(c)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ocean-800 hover:bg-ocean-50"><ListChecks size={14} />{c.label}</button>
      ))}
      <button onClick={() => onEdit(r)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ocean-800 hover:bg-ocean-50" aria-label="Edit">{schema.readOnly ? <Eye size={14} /> : <Pencil size={14} />}{schema.readOnly ? 'Open' : 'Edit'}</button>
      <button onClick={() => onDel(r)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ocean-900/60 hover:bg-ocean-50 hover:text-ocean-900" aria-label="Delete"><Trash2 size={14} /></button>
    </div>
  )
}

function RecordForm({ schema, record, onSave, readOnlyView }) {
  const [saving, setSaving] = useState(false)
  const [bools, setBools] = useState(() => Object.fromEntries(schema.fields.filter((f) => f.type === 'checkbox').map((f) => [f.name, record.id ? !!record[f.name] : f.name === 'registrationOpen' || f.name === 'active'])))

  const submit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const data = {}
    for (const f of schema.fields) {
      const v = fd.get(f.name)
      if (f.type === 'checkbox') data[f.name] = !!bools[f.name]
      else if (f.type === 'number') data[f.name] = v === '' ? 0 : Number(v)
      else if (f.type === 'list') data[f.name] = toList(v)
      else data[f.name] = v ?? ''
    }
    setSaving(true); await onSave(data); setSaving(false)
  }

  return (
    <form onSubmit={submit}>
      {readOnlyView && (
        <dl className="mb-6 grid gap-3 rounded-2xl bg-ocean-25 p-4 text-sm ring-1 ring-ocean-100 sm:grid-cols-2">
          {Object.entries(record).filter(([k]) => !['id', 'status'].includes(k)).map(([k, v]) => (
            <div key={k} className={cx(String(v).length > 40 && 'sm:col-span-2')}><dt className="text-xs font-semibold uppercase tracking-wider text-ocean-900/50">{k}</dt><dd className="whitespace-pre-wrap break-words">{Array.isArray(v) ? v.join(', ') : String(v)}</dd></div>
          ))}
        </dl>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {schema.fields.map((f) => {
          const common = { name: f.name, label: f.label, required: f.required, hint: f.hint, className: f.full ? 'sm:col-span-2' : '' }
          const val = record[f.name]
          if (f.type === 'textarea') return <Textarea key={f.name} {...common} defaultValue={val ?? ''} />
          if (f.type === 'list') return <Textarea key={f.name} {...common} rows={3} defaultValue={Array.isArray(val) ? val.join('\n') : val ?? ''} />
          if (f.type === 'select') return <Select key={f.name} {...common} options={f.options} defaultValue={val ?? ''} />
          if (f.type === 'checkbox') return (
            <label key={f.name} className={cx('flex cursor-pointer items-start gap-3 rounded-xl border border-ocean-100 bg-white p-3', common.className)}>
              <input type="checkbox" checked={!!bools[f.name]} onChange={(e) => setBools({ ...bools, [f.name]: e.target.checked })} className="mt-0.5 size-5 accent-ocean-700" />
              <span><span className="text-sm font-semibold">{f.label}</span>{f.hint && <span className="block text-xs text-ocean-900/55">{f.hint}</span>}</span>
            </label>
          )
          return <Input key={f.name} {...common} type={f.type} defaultValue={val ?? ''} min={f.type === 'number' ? 0 : undefined} />
        })}
      </div>
      <Button type="submit" size="lg" disabled={saving} className="mt-6 w-full">{saving ? 'Saving…' : 'Save'}</Button>
    </form>
  )
}

function ChildList({ db, spec, parent, download }) {
  const rows = (db[spec.collection] || []).filter((x) => x[spec.key] === parent.id)
  const cols = childSchemas[spec.collection]
  const cap = spec.collection === 'volunteers' ? Number(parent.volunteerCapacity) : spec.collection === 'sessionRegistrations' ? Number(parent.capacity) : Number(parent.registrationCapacity) || null
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold">{rows.length}{cap ? ` / ${cap}` : ''} {cap && rows.length >= cap && <span className="ml-2 rounded-full bg-ocean-900 px-2 py-0.5 text-xs text-white">Full — applications closed</span>}</p>
        <Button variant="outline" size="sm" onClick={() => download(`ss-${spec.collection}-${parent.id}.csv`, toCsv(rows), 'text/csv')}><Download size={14} />CSV</Button>
      </div>
      {spec.collection === 'volunteers' && <p className="mb-4 text-xs text-ocean-900/60">Need more volunteers? Edit the event and raise its volunteer capacity — applications reopen automatically. Removing a volunteer frees a slot.</p>}
      {!rows.length ? <EmptyState title="No one yet" /> : (
        <ul className="divide-y divide-ocean-50 rounded-2xl ring-1 ring-ocean-100">
          {rows.map((r) => (
            <li key={r.id} className="flex items-start gap-3 p-3 text-sm">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{r.name} {r.role && <span className="ml-1 rounded-full bg-lagoon-mint-soft px-2 py-0.5 text-xs text-lagoon-deep">{r.role}</span>}</p>
                <p className="truncate text-ocean-900/65">{cols.filter((c) => !['name', 'role'].includes(c) && r[c]).map((c) => (c === 'createdAt' ? new Date(r[c]).toLocaleDateString('en-IN') : r[c])).join(' · ')}</p>
              </div>
              <button onClick={() => window.confirm(`Remove ${r.name}?`) && api.remove(spec.collection, r.id)} className="rounded-lg p-2 text-ocean-900/50 hover:bg-ocean-50 hover:text-ocean-900" aria-label={`Remove ${r.name}`}><Trash2 size={15} /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function toCsv(rows) {
  if (!rows.length) return ''
  const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))]
  const esc = (v) => `"${String(Array.isArray(v) ? v.join('; ') : v ?? '').replace(/"/g, '""')}"`
  return [keys.join(','), ...rows.map((r) => keys.map((k) => esc(r[k])).join(','))].join('\n')
}
