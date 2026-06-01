import { Link } from 'react-router-dom'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="wheredoesmycatgo? home">
      <img src="/logo-mark.svg" alt="" className="size-10 transition-transform duration-500 hover:rotate-[360deg]" />
      <span className="text-[15px] font-extrabold tracking-[-0.03em] text-moss sm:text-base">
        wheredidmycatgo<span className="text-peach">?</span>
      </span>
    </Link>
  )
}
