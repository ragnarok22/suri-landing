import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import ThemeToggle from './theme-toggle'

const NAV_ITEMS = ['Features', 'How it Works', 'FAQ'] as const
const WHITESPACE_RE = /\s/g

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    // Check initial scroll position on mount
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    setMobileMenuOpen(false)

    // If we're not on the homepage, let the href handle navigation
    if (window.location.pathname !== '/') return

    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackEvent('cta_click', { type: 'download', location: 'header' })
    scrollToSection(e, 'download')
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a
          href="/"
          className="flex items-center gap-2"
          onClick={handleLogoClick}
        >
          <img
            src="/suri-logo.jpg"
            alt="Suri logo"
            className="w-10 h-10 rounded-xl shadow-lg shadow-emerald-500/30"
          />
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Suri
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const id = item.toLowerCase().replace(WHITESPACE_RE, '-')
            return (
              <a
                key={item}
                href={`/#${id}`}
                onClick={(e) => scrollToSection(e, id)}
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors"
              >
                {item}
              </a>
            )
          })}
          <ThemeToggle />
          <a
            href="/#download"
            onClick={handleDownloadClick}
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            Download App
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-600 dark:text-slate-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 shadow-xl transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col p-6 gap-4">
          {NAV_ITEMS.map((item) => {
            const id = item.toLowerCase().replace(WHITESPACE_RE, '-')
            return (
              <a
                key={item}
                href={`/#${id}`}
                onClick={(e) => scrollToSection(e, id)}
                className="text-lg font-medium text-slate-600 dark:text-slate-300"
              >
                {item}
              </a>
            )
          })}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Theme
            </span>
            <ThemeToggle />
          </div>
          <a
            href="/#download"
            onClick={handleDownloadClick}
            className="block w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition-colors text-center"
          >
            Download App
          </a>
        </div>
      </div>
    </nav>
  )
}
