import { useEffect, useState } from 'react'
import { Archive, ArrowLeft, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ReportCard, type Report } from './SightingsPage'

type History = { reports: Report[]; summary: { total: number; sightings: number; updates: number; safe: number; injured: number } }
const emptyHistory: History = { reports: [], summary: { total: 0, sightings: 0, updates: 0, safe: 0, injured: 0 } }

export function SightingsHistoryPage() {
  const [history, setHistory] = useState(emptyHistory)
  const [filters, setFilters] = useState({ type: 'all', status: 'all', query: '' })
  async function load() {
    const params = new URLSearchParams(filters)
    const response = await fetch(`/api/community-sightings/history?${params}`)
    if (response.ok) setHistory(await response.json())
  }
  useEffect(() => { void load() }, [filters.type, filters.status])
  return <main><section className="bg-[#eef4f0]"><div className="page-shell py-12"><Link to="/sightings" className="inline-flex items-center gap-2 text-sm font-bold text-moss"><ArrowLeft size={15} /> Back to sighting board</Link><div className="mt-6 flex flex-wrap items-end justify-between gap-4"><div><span className="pill"><Archive size={14} /> Saved sighting record</span><h1 className="section-title mt-4">Every community report, in one place.</h1><p className="helper">Sightings and updates remain saved so searchers can review patterns, timing, and changes over time.</p></div><Link to="/sightings" className="btn-primary">Post a new update</Link></div></div></section><div className="page-shell py-8"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><Stat value={history.summary.total} label="All saved posts" /><Stat value={history.summary.sightings} label="Sightings" /><Stat value={history.summary.updates} label="Search updates" /><Stat value={history.summary.safe} label="Safe updates" /><Stat value={history.summary.injured} label="Possible injuries" /></div><section className="card mt-6 p-4"><p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-peach">Filter the archive</p><div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]"><label className="relative"><Search className="absolute left-3 top-3.5 text-sage" size={16} /><input className="input !mt-0 pl-9" placeholder="Search location, description, or direction" value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} /></label><select className="input !mt-0 capitalize" value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}><option>all</option><option>sighting</option><option>update</option></select><select className="input !mt-0 capitalize" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>{['all', 'spotted', 'moving', 'hiding', 'safe', 'unknown'].map((item) => <option key={item}>{item}</option>)}</select><button className="btn-soft" onClick={load}>Search records</button></div></section><div className="mt-6 grid gap-4 md:grid-cols-2">{history.reports.length ? history.reports.map((report) => <ReportCard key={report.id} report={report} />) : <div className="card p-8 text-center md:col-span-2"><Archive className="mx-auto text-peach" /><h2 className="mt-4 font-display text-2xl">No saved reports match these filters.</h2><p className="mt-2 text-sm text-ink/55">Try a broader search or return to the board to add an update.</p></div>}</div></div></main>
}
function Stat({ value, label }: { value: number; label: string }) { return <div className="card border-t-4 border-t-peach p-4"><p className="font-display text-3xl text-moss">{value}</p><p className="mt-1 text-xs font-bold text-ink/50">{label}</p></div> }
