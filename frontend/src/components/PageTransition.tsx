import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function PageTransition() {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    setVisible(true)
    const timer = window.setTimeout(() => setVisible(false), 520)
    return () => window.clearTimeout(timer)
  }, [location.pathname])

  return <AnimatePresence>{visible && <motion.div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-cream/75 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .14 }}><motion.img src="/logo-mark.svg" className="block size-16 origin-center drop-shadow-lg" alt="" initial={{ scale: .88, rotate: 0 }} animate={{ scale: 1, rotate: 360 }} exit={{ scale: .92, opacity: 0, rotate: 360 }} transition={{ duration: .48, ease: [0.22, 1, 0.36, 1] }} /></motion.div>}</AnimatePresence>
}
