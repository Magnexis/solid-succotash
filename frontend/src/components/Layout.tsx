import { useState } from 'react'
import { ArrowRight, Menu, Settings, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { Logo } from './Logo'
import { PageTransition } from './PageTransition'

const navLink = ({ isActive }: { isActive: boolean }) =>
  `relative py-2 hover:text-moss ${isActive ? 'text-moss after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-peach' : 'text-ink/70'}`

export function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <>
      <PageTransition />
      <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/90 backdrop-blur-xl">
        <div className="page-shell flex items-center justify-between py-3.5">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
            <NavLink to="/how-it-works" className={navLink}>How it works</NavLink>
            <NavLink to="/resources" className={navLink}>Resources</NavLink>
            <NavLink to="/sightings" className={navLink}>Sightings</NavLink>
            <NavLink to="/dashboard" className={navLink}>My search</NavLink>
            <NavLink to="/developers" className={navLink}>Developers</NavLink>
            <Link to="/start" className="btn-primary !px-4 !py-2.5">Start search <ArrowRight size={15} /></Link>
            <NavLink to="/settings" aria-label="Settings" className={navLink}><Settings size={17} /></NavLink>
          </nav>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <nav className="grid gap-4 border-t border-line bg-white p-5 text-sm font-bold md:hidden">
            <Link onClick={() => setMenuOpen(false)} to="/how-it-works">How it works</Link>
            <Link onClick={() => setMenuOpen(false)} to="/resources">Resources</Link>
            <Link onClick={() => setMenuOpen(false)} to="/sightings">Sightings</Link>
            <Link onClick={() => setMenuOpen(false)} to="/dashboard">My search</Link>
            <Link onClick={() => setMenuOpen(false)} to="/developers">Developers</Link>
            <Link onClick={() => setMenuOpen(false)} to="/start" className="btn-primary">Start search</Link>
            <Link onClick={() => setMenuOpen(false)} to="/settings">Settings</Link>
          </nav>
        )}
      </header>
      {children}
      <footer className="mt-12 border-t border-line">
        <div className="page-shell flex flex-col gap-4 py-8 text-xs text-ink/60 sm:flex-row sm:justify-between">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-moss hover:opacity-80" aria-label="wheredidmycatgo? home">
            <img src="/logo-mark.svg" alt="" className="size-7" />
            <span>wheredidmycatgo<span className="text-peach">?</span></span>
          </Link>
          <div className="flex flex-wrap gap-4"><span>Behavior-informed guidance for a more focused search.</span><Link className="font-bold text-moss" to="/sightings">Report a sighting</Link></div>
        </div>
      </footer>
    </>
  )
}
