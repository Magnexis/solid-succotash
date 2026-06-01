import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ClipboardCheck, Clock3, MapPinned, ShieldCheck, Sparkles, Target } from 'lucide-react'
import { Link } from 'react-router-dom'

const stats = [
  ['75%', 'of indoor cats are found nearby'],
  ['3-5', 'quiet checks often reveal hiding cats'],
  ['Dusk', 'can be a powerful time to search'],
  ['Small', 'zones make action feel manageable']
]

const steps = [
  ['01', 'Tell us about your cat', 'Personality changes how and where cats hide.'],
  ['02', 'Describe your area', 'Nearby shelter and paths shape likely movement.'],
  ['03', 'Share what happened', 'The escape event helps set the search radius.'],
  ['04', 'Follow your plan', 'Use prioritized zones and update your progress.']
]

const planFeatures = [
  ['Priority hiding spots', 'See which nearby spaces deserve attention first and why.', <Target size={19} />],
  ['Search radius guidance', 'Start with a realistic radius based on lifestyle and escape details.', <MapPinned size={19} />],
  ['A timed action plan', 'Know what to do now, at dusk, after 12 hours, and tomorrow.', <Clock3 size={19} />],
  ['Progress tracking', 'Check off searched areas so the process stays manageable.', <ClipboardCheck size={19} />]
]

const firstHour = [
  'Search the escape point and your home perimeter with a flashlight.',
  'Check beneath vehicles, dense cover, and enclosed spaces slowly.',
  'Ask nearby neighbors to inspect sheds, garages, and porches.',
  'Pause often and listen. A frightened cat may stay completely silent.'
]

export function HomePage() {
  return (
    <>
      <section className="overflow-hidden">
        <div className="page-shell grid gap-12 pb-20 pt-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-20">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="pill"><Sparkles size={14} className="text-peach" /> Calm, practical guidance</span>
            <h1 className="mt-6 max-w-xl font-display text-6xl leading-[.95] tracking-tight sm:text-7xl lg:text-[5.5rem]">
              Lost your <span className="italic text-moss">cat?</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink/70">
              Answer a few questions and get a personalized search plan grounded in feline behavior and your surroundings.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/start" className="btn-primary">Start your search <ArrowRight size={17} /></Link>
              <Link to="/sightings" className="btn-soft">Report a sighting</Link>
              <Link to="/how-it-works" className="btn-soft">How it works</Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-xs font-bold text-ink/60">
              <span className="flex gap-2"><ShieldCheck size={16} className="text-sage" /> Free to get started</span>
              <span className="flex gap-2"><Clock3 size={16} className="text-sage" /> Takes about 4 minutes</span>
            </div>
          </motion.div>
          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-[#ecdfce]/70 blur-3xl" />
            <img className="relative h-[500px] w-full rounded-[2.5rem] object-cover shadow-2xl" src="https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1000&q=85" alt="Curious cat looking outside" />
            <div className="card absolute -bottom-5 left-[-12px] flex items-center gap-3 p-4 sm:left-[-30px]">
              <div className="grid size-11 place-items-center rounded-full bg-[#eaf3ef] text-moss"><Target /></div>
              <div><p className="text-xs font-bold text-sage">Personalized search zone</p><p className="font-display text-xl">Start close. Search smart.</p></div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="page-shell py-16">
          <p className="eyebrow text-center">Why a focused search matters</p>
          <h2 className="section-title mx-auto mt-3 max-w-xl text-center">A missing cat is often closer than you think.</h2>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(([value, label]) => <div className="card p-5" key={label}><p className="font-display text-4xl text-moss">{value}</p><p className="mt-3 text-sm leading-6 text-ink/65">{label}</p></div>)}
          </div>
        </div>
      </section>
      <section className="page-shell py-20">
        <span className="pill">How it works</span>
        <h2 className="section-title mt-4">A calmer way forward.</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {steps.map(([number, title, body]) => <article className="border-t border-line pt-5" key={number}><span className="font-display text-2xl text-peach">{number}</span><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-ink/65">{body}</p></article>)}
        </div>
      </section>
      <section className="bg-[#f2eee7]">
        <div className="page-shell grid gap-12 py-20 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">Your personalized plan</p>
            <h2 className="section-title mt-3">Less guessing. More useful next steps.</h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-ink/65">Every plan combines your cat's normal behavior with the places that actually exist around your home. The result is a focused checklist you can work through calmly.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {planFeatures.map(([title, body, icon]) => <article className="card p-5" key={String(title)}><div className="text-peach">{icon}</div><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-ink/60">{body}</p></article>)}
          </div>
        </div>
      </section>
      <section className="page-shell grid gap-9 py-20 lg:grid-cols-[1fr_.9fr] lg:items-center">
        <div>
          <p className="eyebrow">The first hour</p>
          <h2 className="section-title mt-3">Start small and search thoroughly.</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-ink/65">It is natural to want to search far away immediately. A close physical search is often the stronger first move, especially for an indoor-only cat in unfamiliar territory.</p>
          <Link to="/resources" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-moss">Explore the knowledge center <ArrowRight size={15} /></Link>
        </div>
        <div className="card p-6">
          <p className="font-display text-2xl">Your calm-start checklist</p>
          <div className="mt-5 grid gap-4">{firstHour.map((item) => <div className="flex gap-3" key={item}><CheckCircle2 className="mt-0.5 shrink-0 text-moss" size={18} /><p className="text-sm leading-6 text-ink/65">{item}</p></div>)}</div>
        </div>
      </section>
      <section className="page-shell py-8">
        <div className="rounded-[2rem] bg-moss px-7 py-10 text-white md:flex md:items-center md:justify-between md:px-12">
          <div><p className="eyebrow !text-sun">Ready when you are</p><h2 className="mt-3 font-display text-4xl">Bring them home, one step at a time.</h2></div>
          <Link to="/start" className="btn mt-6 bg-white text-moss hover:bg-sun md:mt-0">Build my search plan <ArrowRight size={17} /></Link>
        </div>
      </section>
    </>
  )
}
