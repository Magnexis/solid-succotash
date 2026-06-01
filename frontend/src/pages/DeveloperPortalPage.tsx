import { useState } from 'react'
import { ArrowRight, Check, Clipboard, Code2, KeyRound, Radio, ShieldCheck, Sparkles, Terminal } from 'lucide-react'

const requestExample = `curl -X POST http://localhost:4000/api/predictions \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Juniper",
    "age": "adult",
    "sex": "Female",
    "fixed": "Yes",
    "medicalNeeds": ["Daily medication"],
    "lifestyle": "indoor",
    "escapeHistory": "Never escaped",
    "personality": ["Shy", "Hides when stressed"],
    "area": "suburban",
    "homeType": "Detached house",
    "features": ["Porches", "Bushes or hedges", "Parked vehicles"],
    "hazards": ["Busy roads"],
    "weather": "rain",
    "escape": "Door escape",
    "event": ["Loud noise"],
    "when": "1-12 hours",
    "searchActions": ["Checked immediate yard"],
    "location": "Back porch"
  }'`

const responseExample = `{
  "radius": 500,
  "confidence": "High",
  "score": 82,
  "signals": {
    "profile": ["indoor", "adult", "daily medication"],
    "behavior": ["shy", "hides when stressed"],
    "environment": ["suburban", "rain", "porches"],
    "disappearance": ["door escape", "loud noise", "1-12 hours"]
  },
  "zones": [
    {
      "name": "Escape point and home perimeter",
      "level": "High",
      "score": 116
    },
    {
      "name": "Under porches, decks, and crawlspaces",
      "level": "High",
      "score": 114
    },
    {
      "name": "Bushes, hedges, and dense vegetation",
      "level": "High",
      "score": 107
    }
  ]
}`

const sightingsExample = `curl -X POST http://localhost:4000/api/sightings/search \\
  -H "Content-Type: application/json" \\
  -d '{
    "latitude": 40.7128,
    "longitude": -74.0060,
    "radiusMiles": 3,
    "sinceHours": 168
  }'`

export function DeveloperPortalPage() {
  const [copied, setCopied] = useState(false)
  async function copyExample() {
    await navigator.clipboard.writeText(requestExample)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <main>
      <section className="overflow-hidden bg-moss text-white">
        <div className="page-shell grid gap-10 py-16 lg:grid-cols-[1fr_.8fr] lg:items-center lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold"><Code2 size={14} /> Developer portal</span>
            <p className="mt-6 text-xs font-bold uppercase tracking-[.2em] text-sun">CatWoman API</p>
            <h1 className="mt-3 max-w-2xl font-display text-5xl leading-tight sm:text-6xl">LInk our API to your project!</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/75">Bring behavior-informed lost-cat search predictions into shelter tools, neighborhood apps, volunteer workflows, and recovery platforms.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#quickstart" className="btn bg-white text-moss hover:bg-sun">Start building <ArrowRight size={16} /></a>
              <a href="#endpoints" className="btn border border-white/20 bg-white/5 text-white hover:bg-white/10">View endpoints</a>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/15 bg-[#29483f] p-5 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-white/60"><Terminal size={15} /> API preview</div>
            <pre className="mt-4 overflow-auto text-xs leading-6 text-[#dbeee7]"><code>{responseExample}</code></pre>
          </div>
        </div>
      </section>
      <section className="page-shell py-16">
        <div className="grid gap-4 md:grid-cols-3">
          <Feature icon={<Sparkles />} title="Explainable predictions" body="Receive a search radius, ranked hiding spots, and the signals behind the plan." />
          <Feature icon={<ShieldCheck />} title="Focused by design" body="Feature-specific hiding spots only appear when they exist in the reported area." />
          <Feature icon={<Radio />} title="Built to expand" body="The API foundation is ready for saved searches, sightings, and recovery feedback." />
        </div>
      </section>
      <section id="quickstart" className="bg-[#f2eee7]">
        <div className="page-shell grid gap-8 py-16 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <p className="eyebrow">Quickstart</p>
            <h2 className="section-title mt-3">Make your first prediction.</h2>
            <p className="mt-4 text-sm leading-7 text-ink/65">Send a questionnaire to the prediction endpoint. CatWoman API returns a prioritized plan you can render in your own product.</p>
            <div className="mt-6 rounded-2xl border border-line bg-white p-4 text-sm"><p className="text-xs font-bold uppercase tracking-wide text-peach">Base URL</p><code className="mt-2 block font-bold text-moss">http://localhost:4000/api</code></div>
          </div>
          <div className="overflow-hidden rounded-[1.5rem] bg-[#24352f] shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3"><span className="text-xs font-bold text-white/60">Request example</span><button onClick={copyExample} className="flex items-center gap-2 text-xs font-bold text-sun">{copied ? <Check size={14} /> : <Clipboard size={14} />}{copied ? 'Copied' : 'Copy'}</button></div>
            <pre className="overflow-auto p-5 text-xs leading-6 text-[#dbeee7]"><code>{requestExample}</code></pre>
          </div>
        </div>
      </section>
      <section id="endpoints" className="page-shell py-16">
        <p className="eyebrow">Endpoints</p>
        <h2 className="section-title mt-3">A small, useful API surface.</h2>
        <div className="mt-8 grid gap-4">
          <Endpoint method="GET" path="/api/health" state="Available" body="Check whether the CatWoman API service is online." />
          <Endpoint method="POST" path="/api/predictions" state="Available" body="Generate a behavior-informed search radius and ranked hiding-spot plan." />
          <Endpoint method="POST" path="/api/sightings/search" state="Available" body="Search configured public feeds and structured pages for attributed cat sightings near a coordinate." />
          <Endpoint method="POST" path="/api/searches/:id/sightings" state="Roadmap" body="Attach reported sightings and update an active search plan." />
          <Endpoint method="POST" path="/api/searches/:id/recovery" state="Roadmap" body="Record recovery outcomes to improve future search guidance." />
        </div>
      </section>
      <section className="page-shell py-16">
        <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <p className="eyebrow">Nearby sightings</p>
            <h2 className="section-title mt-3">Search attributed public reports.</h2>
            <p className="mt-4 text-sm leading-7 text-ink/65">CatWoman API can aggregate allowlisted public JSON feeds and public pages with JSON-LD metadata. Results are filtered by distance and recency, deduplicated, and returned with source links for verification.</p>
          </div>
          <div className="overflow-hidden rounded-[1.5rem] bg-[#24352f] shadow-xl">
            <div className="border-b border-white/10 px-5 py-3 text-xs font-bold text-white/60">Nearby sightings request</div>
            <pre className="overflow-auto p-5 text-xs leading-6 text-[#dbeee7]"><code>{sightingsExample}</code></pre>
          </div>
        </div>
      </section>
      <section className="bg-[#f2eee7]">
        <div className="page-shell py-16">
          <p className="eyebrow">Prediction categories</p>
          <h2 className="section-title mt-3">More context in, more useful guidance out.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/65">CatWoman API accepts detailed questionnaire fields across the categories that shape a search plan.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Category title="Cat profile" body="Age, sex, fixed status, lifestyle, medical needs, and previous escape experience." />
            <Category title="Behavior" body="Shyness, stress hiding, food motivation, climbing, exploration, and response patterns." />
            <Category title="Environment" body="Neighborhood type, home type, nearby hiding places, weather, and local hazards." />
            <Category title="Disappearance" body="Escape method, stress events, elapsed time, and last known location." />
            <Category title="Search history" body="Completed checks, neighbor outreach, shelter contact, cameras, and traps." />
            <Category title="Prediction output" body="Search radius, specificity, ranked zones, per-zone points, and explanations." />
          </div>
          <div className="mt-8 overflow-hidden rounded-[1.5rem] bg-[#24352f] shadow-xl">
            <div className="border-b border-white/10 px-5 py-3 text-xs font-bold text-white/60">Expanded category payload preview</div>
            <pre className="overflow-auto p-5 text-xs leading-6 text-[#dbeee7]"><code>{`{
  "catProfile": {
    "age": "adult",
    "sex": "Female",
    "fixed": "Yes",
    "medicalNeeds": ["Daily medication"],
    "lifestyle": "indoor",
    "escapeHistory": "Never escaped"
  },
  "behavior": ["Shy", "Hides when stressed"],
  "environment": {
    "area": "suburban",
    "homeType": "Detached house",
    "features": ["Porches", "Bushes or hedges"],
    "hazards": ["Busy roads"],
    "weather": "rain"
  },
  "disappearance": {
    "escape": "Door escape",
    "events": ["Loud noise"],
    "elapsed": "1-12 hours",
    "location": "Back porch"
  },
  "searchHistory": ["Checked immediate yard"]
}`}</code></pre>
          </div>
        </div>
      </section>
      <section className="page-shell pb-16">
        <div className="grid gap-5 rounded-[1.5rem] bg-[#eef4f0] p-6 md:grid-cols-[auto_1fr] md:items-start">
          <div className="grid size-11 place-items-center rounded-xl bg-white text-moss"><KeyRound size={20} /></div>
          <div><p className="font-display text-2xl">Authentication roadmap</p><p className="mt-2 max-w-3xl text-sm leading-7 text-ink/65">The local endpoints are currently open for development. Before a public launch, CatWoman API will issue scoped keys, add rate limits, and separate anonymous predictions from account-level saved search data. Public sighting sources remain allowlisted server-side.</p></div>
        </div>
      </section>
    </main>
  )
}

function Category({ title, body }: { title: string; body: string }) {
  return <article className="card p-5"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-ink/60">{body}</p></article>
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return <article className="card p-5"><div className="text-peach">{icon}</div><h2 className="mt-4 font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-ink/60">{body}</p></article>
}

function Endpoint({ method, path, state, body }: { method: string; path: string; state: string; body: string }) {
  const live = state === 'Available'
  return <article className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center"><span className={`w-fit rounded-lg px-2.5 py-1 text-xs font-extrabold ${method === 'GET' ? 'bg-[#eaf3ef] text-moss' : 'bg-[#fbefe9] text-[#9a563a]'}`}>{method}</span><div className="min-w-0 flex-1"><code className="font-bold text-ink">{path}</code><p className="mt-1 text-sm leading-6 text-ink/60">{body}</p></div><span className={`w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${live ? 'bg-[#eaf3ef] text-moss' : 'bg-[#f2eee7] text-ink/55'}`}>{state}</span></article>
}
